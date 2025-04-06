"use client";

import { AuthProvider } from "@/context/auth-context";
import { StatusProvider, useStatus } from "@/context/status-context";
import { ProfileProvider } from "@/context/profile-context";
import React, { useEffect } from "react";
import { ChatProvider } from "@/context/chat-context";

export default function Provider({ children }: { children: React.ReactNode }) {
    const { isConnected, registerUser } = useStatus();

    useEffect(() => {
        if (isConnected) {
            registerUser();
        }
    }, [isConnected]);


    return (
        <AuthProvider>
            <StatusProvider>
                <ProfileProvider>
                    <ChatProvider>
                        {children}
                    </ChatProvider>
                </ProfileProvider>
            </StatusProvider>
        </AuthProvider>
    )
}