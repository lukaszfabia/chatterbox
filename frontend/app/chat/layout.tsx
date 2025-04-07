import { ChatProvider } from "@/context/chat-context";
import React, { ReactNode } from "react";

export default function ChatLayout({ children }: { children: ReactNode }) {
    return (
        <ChatProvider>
            <div className="w-full">
                {children}
            </div>
        </ChatProvider>
    )
}