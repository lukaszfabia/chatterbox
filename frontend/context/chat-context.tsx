"use client";

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { ConversationDTO, MessageDTO } from '@/lib/dto/message';
import { api } from '@/lib/api';
import useSWR, { mutate } from 'swr';
import { useProfile } from './profile-context';
import { denormalizeUser, User } from '@/lib/dto/user';

type ChatCtxProps = {
    socket: Socket | null,
    error: string | null,
    conversations: ConversationDTO[],
    messages: MessageDTO[],
    sendMessage: (msg: MessageDTO) => Promise<void>;
    initConversation: (sender: User, receiver: User) => Promise<ConversationDTO | null>;
    selectChat: (chatID: string) => void;
};

const host = process.env.NEXT_PUBLIC_CHAT_SERVICE_HOST!;
const addr = `http://${host}`;

const ChatCtx = createContext<ChatCtxProps>({
    socket: null,
    error: null,
    conversations: [],
    messages: [],
    sendMessage: async (msg: MessageDTO) => { },
    initConversation: async (sender: User, receiver: User) => null,
    selectChat: (chatID: string) => { },
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

    const { data: conversations, error: conversationsError } = useSWR<ConversationDTO[] | null>('/chat/conversations', fetcher);

    const { data: chatMessages, error: messagesError } = useSWR<MessageDTO[] | null>(
        chatID ? `/chat/${chatID}/messages` : null,
        fetcher
    );

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
        const socket = io(addr);
        socketRef.current = socket;

        socket.on('connect', () => {
            if (currUserProfile?.id) {
                socket.emit('register', currUserProfile.id);
            }
        });

        socket.on('newMessage', (message: MessageDTO) => {
            if (chatID === message.chatID) {
                setMessages((prevMessages) => [...prevMessages, message]);
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [currUserProfile, chatID]);

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
        console.log('sending messs', msg);

        const response = await api<MessageDTO>({
            service: 'chat',
            apiVersion: 'api/v1',
            endpoint: `/chat/new/message`,
            method: 'POST',
            body: msg,
        });

        if (response) {
            socketRef.current?.emit('newMessage', msg);
            mutate(`/chat/${chatID}/messages`);
        } else {
            console.log("Failed to send message");
            setError("Failed to send message");
        }
    };

    const selectChat = (id: string) => {
        console.log('setting id', id);
        setChatID(id);
    };

    const initConversation = async (sender: User, receiver: User) => {
        const body = {
            members: [receiver, sender].map((user) => denormalizeUser(user)),
        };

        const conversation = await api<ConversationDTO>({
            service: 'chat',
            apiVersion: 'api/v1',
            endpoint: '/chat/new/chat',
            method: 'POST',
            body: body,
        });

        if (conversation) {
            mutate('/chat/conversations');
            return conversation;
        } else {
            setError('Failed to init conversation');
        }
        return null;
    };

    return (
        <ChatCtx.Provider value={{ error, socket: socketRef.current, messages, conversations: conversations ?? [], sendMessage, selectChat, initConversation }}>
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
