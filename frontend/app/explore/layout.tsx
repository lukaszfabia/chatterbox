import { ChatProvider } from "@/context/chat-context";
import React, { ReactNode } from "react";

export default function ExploreLayout({ children }: { children: ReactNode }) {
    return (
        <div>
            {children}
        </div>
    )
}