import React, { ReactNode } from "react";

export default function MessagesLayout({ children }: { children: ReactNode }) {
    return (
        <div>
            {children}
        </div>
    )
}