"use client";

import { ConversationDTO, MessageDTO, DenormalizedUser } from "@/lib/dto/message";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useRef, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { TextAreaField } from "../forms/form-components";
import { messageSchema } from "../forms/schemas";
import { Button } from "../ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "./message";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ChatInterfaceProps {
    conversations: ConversationDTO[];
    currentConversation: ConversationDTO | null;
    messages: MessageDTO[];
    currentUser: DenormalizedUser;
    onConversationSelect: (conversationId: string) => void;
    onSendMessage: (values: z.infer<typeof messageSchema>) => void;
    isLoading?: boolean;
}

export function ChatInterface({
    currentConversation,
    messages,
    currentUser,
    onSendMessage,
    isLoading = false,
}: ChatInterfaceProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema),
        defaultValues: {
            message: "",
        },
    });

    useEffect(() => {
        const viewport = scrollRef.current?.querySelector('[data-radix-scroll-area-viewport]') as HTMLDivElement | null;
        if (viewport) {
            viewport.scrollTo({ top: viewport.scrollHeight, behavior: "smooth" });
        }
    }, [messages]);


    const renderMessageSkeletons = () => (
        <>
            {[1, 2, 3].map((i) => (
                <div key={i} className={cn("flex gap-3 items-end", i % 2 === 0 ? "justify-end" : "justify-start")}>
                    {i % 2 !== 0 && <Skeleton className="w-10 h-10 rounded-full" />}
                    <div>
                        <Skeleton className={cn("h-12 w-48 rounded-lg", i % 2 === 0 ? "ml-auto" : "")} />
                        <Skeleton className={cn("h-3 w-20 mt-1", i % 2 === 0 ? "ml-auto" : "")} />
                    </div>
                </div>
            ))}
        </>
    );

    return (
        <div className="flex-1 flex flex-col bg-background h-[80vh] w-full max-w-full">
            {currentConversation ? (
                <>
                    <div className="flex-1 overflow-hidden relative">
                        <ScrollArea className="h-full w-full" ref={scrollRef}>
                            <div className="p-4 space-y-4 min-h-full">
                                {isLoading ? (
                                    renderMessageSkeletons()
                                ) : (
                                    messages.map((msg) => {
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
                                    })
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                    <div className="w-full">
                        <FormProvider {...form}>
                            <form onSubmit={form.handleSubmit((values) => {
                                onSendMessage(values);
                                form.reset();
                            })} className="p-4 flex items-center space-x-3">
                                <div className="flex-1">
                                    <TextAreaField name="message" control={form.control} placeholder={"Type your message..."} label={""} />
                                </div>
                                <div className="mt-2">
                                    <Button type="submit" disabled={!form.formState.isValid || isLoading}>
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
    );
}