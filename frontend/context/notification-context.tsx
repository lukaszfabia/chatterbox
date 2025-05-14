"use client";

import React, { useContext, useEffect, createContext, useRef, useState } from "react";
import useSWR from "swr";
import { api } from "@/lib/api";
import { Notification } from "@/lib/dto/notification";
import { useAuth } from "./auth-context";
import getToken, { ACCESS } from "@/lib/token";

const host = `ws://${process.env.NEXT_PUBLIC_NOTIFICATION_SERVICE_HOST}/ws`;

const fetcher = <T,>(url: string): Promise<T | null> =>
    api<T>({
        service: "notification",
        apiVersion: "api/v1",
        endpoint: url,
        method: "GET",
    });

type NotificationCtxProps = {
    notifications?: Notification[] | null;
    newNoti?: Notification | null;
    isLoading: boolean;
    isConnected: boolean;
    error: string | null;
};

const NotificationCtx = createContext<NotificationCtxProps>({
    notifications: [],
    newNoti: null,
    isConnected: false,
    isLoading: false,
    error: null,
});

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const { isAuth } = useAuth();
    const [newNoti, setNewNoti] = useState<Notification | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const {
        data: notifications,
        error: fetchError,
        isLoading,
        mutate,
    } = useSWR<Notification[] | null>(
        isAuth ? "/notifications" : null,
        fetcher
    );

    const connectWebSocket = () => {
        try {
            const token = getToken(ACCESS);
            if (!token) {
                return;
            }

            if (wsRef.current) {
                wsRef.current.close();
            }

            const ws = new WebSocket(`${host}?token=${encodeURIComponent(token)}`);
            wsRef.current = ws;

            ws.onopen = () => {
                ws.send(JSON.stringify({ type: "AUTH", token }));
                setIsConnected(true);
                setError(null);
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data) as Notification;
                    setNewNoti(data);
                    mutate((prev) => [data, ...(prev ?? [])], { revalidate: false });
                } catch (err) {
                    console.error("Failed to parse WebSocket message", err);
                    setError("Failed to parse notification");
                }
            };

            ws.onerror = (err) => {
                console.error("WebSocket error occurred");
                if (err instanceof Error) {
                    console.error("WebSocket error message:", err.message);
                    setError(`WebSocket error: ${err.message}`);
                } else {
                    console.error("WebSocket error details:", err);
                    setError("WebSocket connection error");
                }
                setIsConnected(false);

                if (reconnectTimeoutRef.current) {
                    clearTimeout(reconnectTimeoutRef.current);
                }
                reconnectTimeoutRef.current = setTimeout(connectWebSocket, 5000);
            };

            ws.onclose = (event) => {
                setIsConnected(false);

                if (event.code !== 1000) {
                    if (reconnectTimeoutRef.current) {
                        clearTimeout(reconnectTimeoutRef.current);
                    }
                    reconnectTimeoutRef.current = setTimeout(connectWebSocket, 5000);
                }
            };
        } catch (err) {
            console.error("Error establishing WebSocket connection:", err);
            setError("Failed to connect to notification service");
        }
    };

    useEffect(() => {
        if (isAuth) {
            connectWebSocket();
        }

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
            }

            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
                reconnectTimeoutRef.current = null;
            }
        };
    }, [isAuth]);

    useEffect(() => {
        if (fetchError) {
            console.error("Error fetching notifications:", fetchError);
            setError("Failed to load notifications");
        }
    }, [fetchError]);

    return (
        <NotificationCtx.Provider
            value={{
                isLoading,
                error,
                newNoti,
                isConnected,
                notifications,
            }}
        >
            {children}
        </NotificationCtx.Provider>
    );
}

export const useNotification = () => {
    const context = useContext(NotificationCtx);
    if (!context) {
        throw new Error("useNotification must be used within a NotificationProvider");
    }
    return context;
};