import React, { ReactNode } from "react";

export default function ChatLayout({ children }: { children: ReactNode }) {
    return (
        <div className="w-full">
            {children}
        </div>
    )
}