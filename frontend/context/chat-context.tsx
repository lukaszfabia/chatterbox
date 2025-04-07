"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { ConversationDTO, MessageDTO } from '@/lib/dto/message';
import { api } from '@/lib/api';
import useSWR, { mutate } from 'swr';
import { useProfile } from './profile-context';
import { denormalizeUser, User } from '@/lib/dto/user';
import { debounce } from 'lodash';

type ChatCtxProps = {
    socket: Socket | null,
    error: string | null,
    typingUser: string | null,
    conversations: ConversationDTO[],
    messages: MessageDTO[],
    isLoading: boolean,
    sendMessage: (msg: MessageDTO) => Promise<void>;
    selectChat: (chatID: string) => void;
    emitTyping: (chatID: string, userID: string, username: string) => void;
};

const host = process.env.NEXT_PUBLIC_CHAT_SERVICE_HOST!;
const addr = `http://${host}`;

const ChatCtx = createContext<ChatCtxProps>({
    socket: null,
    error: null,
    typingUser: null,
    conversations: [],
    messages: [],
    isLoading: false,
    sendMessage: async (msg: MessageDTO) => { },
    selectChat: (chatID: string) => { },
    emitTyping: (chatID, userID, username) => { },
});

const fetcher = <T,>(url: string): Promise<T | null> =>
    api<T>({
        service: 'chat',
        apiVersion: 'api/v1',
        endpoint: url,
        method: 'GET',
    });

export function ChatProvider({ children }: { children: React.ReactNode }) {
    const { currUserProfile } = useProfile();
    const [error, setError] = useState<string | null>(null);
    const socketRef = useRef<Socket | null>(null);
    const [chatID, setChatID] = useState<string | null>(null);
    const [messages, setMessages] = useState<MessageDTO[]>([]);
    const [typingUser, setTypingUser] = useState<string | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [isSending, setIsSending] = useState<boolean>(false);

    const { data: conversations, error: conversationsError, isLoading: isConversationsLoading } = useSWR<ConversationDTO[] | null>(
        '/chat/conversations',
        fetcher
    );

    const { data: chatMessages, error: messagesError, isLoading: isMessagesLoading } = useSWR<MessageDTO[] | null>(
        chatID ? `/chat/${chatID}/messages` : null,
        fetcher
    );

    const isLoading = isConversationsLoading || isMessagesLoading || isSending;

    useEffect(() => {
        if (!currUserProfile?.id) return;

        setChatID(null);
        setMessages([]);

        mutate('/chat/conversations', null, { revalidate: false });
        mutate((key) => typeof key === 'string' && key.startsWith('/chat/'), null, { revalidate: false });
    }, [currUserProfile?.id]);


    useEffect(() => {
        if (currUserProfile?.id) {
            mutate('/chat/conversations');
        }
    }, [currUserProfile?.id]);


    useEffect(() => {
        if (!currUserProfile?.id) return;

        const socket = io(addr);
        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('Socket connected');
            socket.emit('register', currUserProfile.id);
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });

        socket.on('error', (error) => {
            setError('Connection error occurred');
        });

        socket.on('newMessage', (message: MessageDTO) => {
            if (chatID === message.chatID) {
                console.log('New message received:', message);
                setMessages((prevMessages) => [...prevMessages, message]);
            } else {
                console.log('Message ignored, chatID mismatch');
            }
            mutate('/chat/conversations');
        });

        socket.onAny((event, ...args) => {
            console.log(`[DEBUG] Socket event ${event}:`, args);
        });

        socket.on('typing', (data) => {
            console.log('Typing event received:', data);
            if (!data || !data.username) {
                return;
            }

            setTypingUser(data.username);

            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                setTypingUser(null);
            }, 3000);
        });

        return () => {
            console.log('Cleaning up socket');
            socket.disconnect();
            socketRef.current = null;
        };
    }, [currUserProfile?.id, chatID]);

    useEffect(() => {
        if (chatID) {
            console.log('Loading messages for chat:', chatID);
        }
    }, [chatID]);

    useEffect(() => {
        if (conversationsError) {
            setError('Failed to load conversations');
        }

        if (messagesError) {
            setError('Failed to load messages');
        } else if (chatMessages) {
            setMessages(chatMessages);
        }
    }, [conversationsError, messagesError, chatMessages]);

    const sendMessage = async (msg: MessageDTO) => {
        try {
            setIsSending(true);
            console.log('Sending message:', msg);

            const response = await api<MessageDTO>({
                service: 'chat',
                apiVersion: 'api/v1',
                endpoint: `/chat/new/message`,
                method: 'POST',
                body: msg,
            });

            if (response) {
                setMessages((prevMessages) => [...prevMessages, response]);

                if (socketRef.current?.connected) {
                    socketRef.current.emit('newMessage', response);
                } else {
                    console.warn('Socket not connected, message might not be delivered in real-time');
                }

                mutate(`/chat/${chatID}/messages`);
                mutate('/chat/conversations');
            } else {
                setError("Failed to send message");
            }
        } catch (err) {
            setError("Error sending message");
        } finally {
            setIsSending(false);
        }
    };

    const selectChat = (id: string) => {
        if (!id) return;

        console.log('Selecting chat:', id);

        const socket = socketRef.current;
        const userID = currUserProfile?.id;

        if (!userID) {
            return;
        }

        if (id !== chatID && socket?.connected) {
            if (chatID) {
                console.log(`Leaving room ${chatID}`);
                socket.emit('leaveRoom', chatID, userID);
            }

            console.log(`Joining room ${id}`);
            socket.emit('joinRoom', id, userID);

            setChatID(id);
            setMessages([]);
        }
    };


    const emitTyping = useMemo(() => debounce((chatID: string, userID: string, username: string) => {
        console.log(`Emit typing - chatID: ${chatID}, userID: ${userID}, username: ${username}`);

        if (!socketRef.current) {
            return;
        }

        if (!socketRef.current.connected) {
            return;
        }

        socketRef.current.emit('typing', {
            chatID: chatID,
            userID: userID,
            username: username
        });
    }, 500), []);

    return (
        <ChatCtx.Provider value={{
            error,
            socket: socketRef.current,
            messages,
            conversations: conversations ?? [],
            isLoading,
            sendMessage,
            selectChat,
            emitTyping,
            typingUser
        }}>
            {children}
        </ChatCtx.Provider>
    );
}

export const useChat = () => {
    const ctx = useContext(ChatCtx);
    if (!ctx)
        throw new Error('useChat must be used with ChatProvider, register new provider in provider.tsx!');
    return ctx;
};