"use client";

import { ConversationDTO, DenormalizedUser } from "@/lib/dto/message";
import { SearchIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ConversationItem } from "./conversation";
import { Skeleton } from "@/components/ui/skeleton";

interface ChatListProps {
    currentUser?: DenormalizedUser | null;
    conversations: ConversationDTO[];
    currentConversation?: ConversationDTO | null;
    onConversationSelect: (conversation: ConversationDTO | null) => void;
    isLoading?: boolean;
}

function ChatListSkeleton({ amount = 4 }: { amount?: number }) {
    return (
        <div>
            {Array.from({ length: amount }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer rounded-lg">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="flex-1 flex min-w-0 flex-col gap-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                    <Skeleton className="h-3 w-12" />
                </div>
            ))}
        </div>
    )
}

export function ChatList({
    conversations,
    onConversationSelect,
    currentUser,
    currentConversation,
    isLoading = false,
}: ChatListProps) {
    const [phrase, setPhrase] = useState<string>("");

    const filtered = conversations.filter((c) => {
        const normalized = phrase.toLowerCase();
        return phrase.length > 0
            ? c.members.some((u) => u.username.toLowerCase().includes(normalized))
            : true;
    });

    return (
        <div className="w-1/4 border-r bg-muted/50 flex flex-col">
            <div className="p-2 flex space-x-4">
                <Input
                    type="text"
                    placeholder="Search for conversations..."
                    onChange={(e) => setPhrase(e.target.value)}
                    value={phrase}
                    disabled={isLoading}
                />
                <Button disabled={isLoading}>
                    <SearchIcon className="h-4 w-4" />
                </Button>
            </div>
            <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                    {isLoading ? (
                        <ChatListSkeleton />
                    ) : (
                        filtered.map((conversation: ConversationDTO) => (
                            <ConversationItem
                                key={conversation.id}
                                conversation={conversation}
                                user={currentUser}
                                onClick={() => onConversationSelect(conversation)}
                                isActive={currentConversation?.id === conversation.id}
                            />
                        ))
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}