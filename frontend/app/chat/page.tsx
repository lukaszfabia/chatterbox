"use client";

import { MessageDTO, ConversationDTO, getConversation, sortConversations } from "@/lib/dto/message";
import { useEffect, useState } from "react";
import { ChatProvider, useChat } from "@/context/chat-context";
import { useProfile } from "@/context/profile-context";
import { denormalizeUser } from "@/lib/dto/user";
import { messageSchema } from "@/components/forms/schemas";
import { z } from "zod";
import { useParams } from "next/navigation";
import { ChatInterface } from "@/components/chat/chat-interface";
import { ChatList } from "@/components/chat/chat-list";

export default function Chat() {
    const { chatID } = useParams();
    const { conversations, selectChat, messages, sendMessage, isLoading: isChatLoading, emitTyping, typingUser } = useChat();
    const { currUserProfile: currentUser, isLoading: isProfileLoading } = useProfile();
    const [currentConversation, setCurrentConversation] = useState<ConversationDTO | null>(
        chatID ? getConversation(chatID as string, conversations) : null
    );

    useEffect(() => {
        if (chatID) {
            const conversation = getConversation(chatID as string, conversations);
            if (conversation) {
                setCurrentConversation(conversation);
                selectChat(conversation.id);
            }
        }
    }, [chatID, conversations, selectChat]);

    const handleSendMessage = async (values: z.infer<typeof messageSchema>) => {
        if (currentConversation && currentUser) {
            const msg: MessageDTO = {
                senderID: currentUser.id,
                receiverID: currentConversation.members.find((v) => v.userID !== currentUser.id)!.userID,
                content: values.message,
                sentAt: new Date().getTime(),
                chatID: currentConversation?.id,
            }

            await sendMessage(msg);
        }
    };

    if (!conversations || conversations.length === 0) {
        return (
            <div className="flex min-h-screen items-center justify-center p-4 w-full">
                <div>
                    <h1 className="font-extrabold">No conversations yet!</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4 w-full">
            <div className="w-full flex justify-center">
                <div className="flex h-[80vh] w-full max-w-full border rounded-lg shadow-lg overflow-hidden">
                    <ChatList
                        conversations={sortConversations(conversations)}
                        isLoading={isChatLoading || isProfileLoading}
                        currentUser={denormalizeUser(currentUser)}
                        currentConversation={currentConversation}
                        onConversationSelect={(conversation) => {
                            if (conversation) {
                                selectChat(conversation.id);
                                setCurrentConversation(conversation);
                            }
                        }}
                    />
                    <ChatInterface
                        emitTyping={emitTyping}
                        typingUser={typingUser}
                        conversations={sortConversations(conversations)}
                        currentConversation={currentConversation}
                        messages={messages}
                        currentUser={denormalizeUser(currentUser)}
                        onConversationSelect={(id) => {
                            selectChat(id);
                            setCurrentConversation(getConversation(id, conversations));
                        }}
                        onSendMessage={handleSendMessage}
                    />
                </div>
            </div>
        </div>
    );
}
