"use client";

import { microservices } from "@/config/config";
import Link from "next/link";
import { Link as LinkIcon, ShieldCheck, MessageCircle, Bell, User, Activity } from "lucide-react";
import { useState, useEffect } from "react";

const descriptions: Record<keyof typeof microservices, string> = {
    auth: "Authenthication and user logging",
    profile: "Profile managment",
    notification: "Notification delivery",
    chat: "Conversation and message handling",
    status: "Tracking status Online",
};

const getStatusIcon = (name: keyof typeof microservices) => {
    switch (name) {
        case "auth":
            return <ShieldCheck className="h-5 w-5 text-muted-foreground" />;
        case "chat":
            return <MessageCircle className="h-5 w-5 text-muted-foreground" />;
        case "notification":
            return <Bell className="h-5 w-5 text-muted-foreground" />;
        case "profile":
            return <User className="h-5 w-5 text-muted-foreground" />;
        case "status":
            return <Activity className="h-5 w-5 text-muted-foreground" />;
        default:
            return null;
    }
};

const checkServiceStatus = async (url: string) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
        const response = await fetch(url, {
            method: "HEAD",
            signal: controller.signal,
        });

        return response.ok;
    } catch (error) {
        return false;
    } finally {
        clearTimeout(timeoutId);
    }
};

const getServices = Object.entries(microservices).map(([name, url]) => {
    const fullUrl = url.startsWith("http://") || url.startsWith("https://")
        ? url
        : `http://${url}`;

    return [name, `${fullUrl}/api/v1/docs/`];
});

export default function DocsPage() {
    const services = getServices;
    const [serviceStatus, setServiceStatus] = useState<Record<keyof typeof microservices, boolean>>({
        auth: false,
        profile: false,
        notification: false,
        chat: false,
        status: false,
    });


    useEffect(() => {
        const checkStatuses = async () => {
            const statuses = await Promise.all(
                services.map(async ([name, url]) => {
                    const isOnline = await checkServiceStatus(url);
                    return [name, isOnline];
                })
            );

            const statusMap = Object.fromEntries(statuses) as Record<keyof typeof microservices, boolean>;
            setServiceStatus(statusMap);
        };

        checkStatuses();

        const intervalId = setInterval(checkStatuses, 30000);

        return () => clearInterval(intervalId);
    }, [services]);

    return (
        <section className="md:max-w-5xl min-h-screen max-w-xl mx-auto mt-20 bg-background rounded-t-xl px-5 md:px-20">
            <div>
                <h1 className="font-extrabold md:text-3xl text-2xl">Docs</h1>
                <p className="text-muted-foreground mb-6">
                    Microservices documentation, feel free and just click in anchor to view.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map(([name, url]) => (
                        <div
                            key={name}
                            className="border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition duration-300 bg-card"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                    {getStatusIcon(name as keyof typeof microservices)}
                                    <h3 className="font-semibold text-lg capitalize">{name}</h3>
                                </div>
                                <Link href={url} target="_blank" rel="noopener noreferrer">
                                    <LinkIcon className="h-5 w-5 text-muted-foreground hover:text-blue-600" />
                                </Link>
                            </div>

                            <p className="text-sm text-muted-foreground">{descriptions[name as keyof typeof microservices]}</p>

                            <div
                                className={`mt-3 text-sm font-semibold ${serviceStatus[name as keyof typeof microservices] ? "text-green-600" : "text-red-600"
                                    }`}
                            >
                                {serviceStatus[name as keyof typeof microservices] ? "Online" : "Offline"}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
