"use client";

import Loading from "@/components/indicator";
import { useAuth } from "@/context/auth-context";
import { ChatProvider } from "@/context/chat-context";
import { useRouter } from "next/navigation";
import React, { ReactNode, useEffect } from "react";

export default function ChatLayout({ children }: { children: ReactNode }) {
    const { isAuth, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuth && !isLoading) {
            router.push("/login");
        }
    }, [isAuth, isLoading, router]);

    if (isLoading) {
        return <Loading />;
    }

    return (
        <ChatProvider>
            <div className="w-full">
                {children}
            </div>
        </ChatProvider>
    );
}
