"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./auth-context";
import { api } from "@/lib/api";
import { StatusDTO } from "@/lib/dto/status";

type StatusCtxProps = {
    socket: Socket | null;
    isConnected: boolean;
    registerUser: () => void;
    sendPing: () => void;
    fetchStatus: (userID: string) => Promise<StatusDTO | null>;
};

const host = process.env.NEXT_PUBLIC_STATUS_SERVICE_HOST!;
const addr = `http://${host}`;

const StatusCtx = createContext<StatusCtxProps>({
    socket: null,
    isConnected: false,
    registerUser: () => { },
    sendPing: () => { },
    fetchStatus: async (userID: string) => null,
});

export function StatusProvider({ children }: { children: React.ReactNode }) {
    const [isConnected, setIsConnected] = useState(false);
    const { userID } = useAuth();
    const socketRef = useRef<Socket | null>(null);
    const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const socket = io(addr, {
            transports: ["websocket"],
            reconnection: true,
            reconnectionAttempts: 10,
        });

        socketRef.current = socket;

        socket.on("connect", () => {
            setIsConnected(true);

            if (userID) {
                socket.emit("register", userID);
            }

            if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
            pingIntervalRef.current = setInterval(() => {
                if (userID) {
                    socket.emit("ping", { userID });
                }
            }, 30_000);
        });

        socket.on("disconnect", () => {
            setIsConnected(false);
            if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
        });

        socket.on("pong", (data) => {
        });

        socket.on("error", (err) => {
            console.error("[socket] Error:", err);
        });

        return () => {
            socket.disconnect();
            if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
        };
    }, []);

    useEffect(() => {
        if (isConnected && userID) {
            registerUser();

            pingIntervalRef.current = setInterval(() => {
                sendPing();
            }, 30_000);
        }
    }, [isConnected, userID]);


    const registerUser = () => {
        if (userID && socketRef.current) {
            socketRef.current.emit("register", userID);
        }
    };

    const fetchStatus = async (userID: string) => {
        return await api<StatusDTO>({
            apiVersion: "api/v1",
            endpoint: `/status/check/${userID}`,
            method: "GET",
            service: "status"
        })
    };


    const sendPing = () => {
        if (userID && socketRef.current) {
            socketRef.current.emit("ping", { userID });
        }
    };


    return (
        <StatusCtx.Provider value={{ socket: socketRef.current, isConnected, registerUser, sendPing, fetchStatus }}>
            {children}
        </StatusCtx.Provider>
    );
}

export const useStatus = () => {
    const ctx = useContext(StatusCtx);
    if (!ctx) throw new Error("StatusProvider must be used within WebSocketProvider");
    return ctx;
};
