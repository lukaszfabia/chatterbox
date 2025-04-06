"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageDTO, DenormalizedUser, ConversationDTO } from "@/lib/dto/message";
import { useEffect, useState } from "react";
import { ConversationItem } from "@/components/chat/conversation";
import { Message } from "@/components/chat/message";
import { SearchIcon, Send } from "lucide-react";
import { Form, FormProvider, useForm } from "react-hook-form";
import { useChat } from "@/context/chat-context";
import { useProfile } from "@/context/profile-context";
import { denormalizeUser } from "@/lib/dto/user";
import { TextAreaField } from "@/components/forms/form-components";
import { messageSchema } from "@/components/forms/schemas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Link from "next/link";

interface ChatInterfaceProps {
    conversations: ConversationDTO[];
    currentConversation: ConversationDTO | null;
    messages: MessageDTO[];
    currentUser: DenormalizedUser;
    onConversationSelect: (conversationId: string) => void;
    onSendMessage: (values: z.infer<typeof messageSchema>) => void;
}

export function ChatInterface({
    conversations,
    currentConversation,
    messages,
    currentUser,
    onConversationSelect,
    onSendMessage,
}: ChatInterfaceProps) {

    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema),
        defaultValues: {
            message: "",
        },
    });

    return (
        <div className="flex h-[80vh] w-full max-w-full border rounded-lg shadow-lg overflow-hidden">
            <div className="w-1/4 border-r bg-muted/50 flex flex-col">
                <div className="p-2 flex space-x-4">
                    <Input type="text" placeholder="Search for conversations..." />
                    <Button disabled>
                        <SearchIcon />
                    </Button>
                </div>
                <ScrollArea className="flex-1">
                    <div className="p-2 space-y-1">
                        {conversations.map((conversation) => (
                            <ConversationItem
                                key={conversation.id}
                                conversation={conversation}
                                currentUserId={currentUser.userID}
                                onClick={() => onConversationSelect(conversation.id)}
                                isActive={currentConversation?.id === conversation.id}
                            />
                        ))}
                    </div>
                </ScrollArea>
            </div>

            <div className="flex-1 flex flex-col bg-background">
                {currentConversation ? (
                    <>
                        <div className="flex-1 overflow-hidden">
                            <ScrollArea className="h-full w-full">
                                <div className="p-4 space-y-4 min-h-full">
                                    {messages.map((msg) => {
                                        const sender = msg.senderID === currentUser.userID
                                            ? currentUser
                                            : currentConversation.members.find(m => m.userID === msg.senderID);

                                        return sender ? (
                                            <Message
                                                key={msg.id}
                                                message={msg}
                                                sender={sender}
                                                isCurrentUser={msg.senderID === currentUser.userID}
                                            />
                                        ) : null;
                                    })}
                                </div>
                            </ScrollArea>
                        </div>
                        <div className="w-full">
                            <FormProvider {...form}>
                                <form onSubmit={form.handleSubmit(onSendMessage)} className="p-4 flex items-center space-x-3">
                                    <div className="flex-1">
                                        <TextAreaField name="message" control={form.control} placeholder={"Type your message..."} label={""} />
                                    </div>
                                    <div className="mt-2">
                                        <Button type="submit" disabled={!form.formState.isValid}>
                                            <Send className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </form>

                            </FormProvider>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-muted-foreground">
                        Select a conversation to start chatting
                    </div>
                )}
            </div>
        </div>
    );
}

export default function Chat() {
    const { conversations, selectChat, messages, sendMessage, error } = useChat();
    const { currUserProfile: currentUser } = useProfile();
    const [currentConversation, setCurrnetConversation] = useState<ConversationDTO | null>(null);

    useEffect(() => {
        console.log('conversations', conversations)
        console.log('messages', messages)
    }, [])

    if (!conversations || conversations.length === 0) {
        return (
            <div className="flex min-h-screen items-center justify-center p-4 w-full">
                <div>
                    <h1 className="font-extrabold" >No conversations yet!</h1>
                    <Link href="/explore"><Button variant="link">Explore new people!</Button></Link>
                </div>
            </div>
        )
    }

    if (!currentUser) {
        return <div className="flex min-h-screen items-center justify-center p-4 w-full">  <svg className="mr-3 size-5 animate-spin ..." viewBox="0 0 24 24">
        </svg></div>
    }

    const handleSendMessage = async (values: z.infer<typeof messageSchema>) => {
        if (currentConversation) {
            const msg: MessageDTO = {
                senderID: currentUser.id,
                receiverID: currentConversation.members.find((v) => v.userID !== currentUser.id)!.userID,
                content: values.message,
                sentAt: new Date().getTime(),
                chatID: currentConversation?.id,
            }

            await sendMessage(msg)
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4 w-full">
            <div className="w-full flex justify-center">
                <ChatInterface
                    conversations={conversations}
                    currentConversation={currentConversation}
                    messages={messages}
                    currentUser={denormalizeUser(currentUser)}
                    onConversationSelect={(id) => {
                        selectChat(id)
                        setCurrnetConversation(getConversation(id, conversations))
                    }}
                    onSendMessage={handleSendMessage}
                />
            </div>
        </div>
    );
}

function getConversation(id: string, conversations: ConversationDTO[]): ConversationDTO | null {
    return conversations.find((v) => id === v.id) ?? null;
}