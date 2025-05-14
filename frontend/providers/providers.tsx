"use client";

import { AuthProvider } from "@/context/auth-context";
import { StatusProvider, useStatus } from "@/context/status-context";
import { ProfileProvider } from "@/context/profile-context";
import React, { useEffect, useState } from "react";
import { ChatProvider } from "@/context/chat-context";
import { NotificationProvider, useNotification } from "@/context/notification-context";
import { toast } from "sonner";
import { Notification } from "@/lib/dto/notification";

function AppContent({ children }: { children: React.ReactNode }) {
    const { isConnected, registerUser } = useStatus();
    const [prevNoti, setPrevNoti] = useState<Notification | null>(null);

    const NotificationConsumer = () => {
        const { newNoti, isConnected: isNotificationConnected } = useNotification();

        useEffect(() => {
            if (isNotificationConnected && newNoti && newNoti !== prevNoti) {
                toast(newNoti.info, {
                    description: newNoti.sub,
                    action: {
                        label: "Ok",
                        onClick: () => { },
                    },
                });

                setPrevNoti(newNoti);
            }
        }, [newNoti, isNotificationConnected]);

        return null;
    };

    useEffect(() => {
        if (isConnected) {
            registerUser();
        }
    }, [isConnected, registerUser]);

    return (
        <>
            <NotificationConsumer />
            {children}
        </>
    );
}

export default function Provider({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <StatusProvider>
                <ProfileProvider>
                    <NotificationProvider>
                        <AppContent>
                            {children}
                        </AppContent>
                    </NotificationProvider>
                </ProfileProvider>
            </StatusProvider>
        </AuthProvider >
    );
}