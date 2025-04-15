"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Loading from "@/components/indicator";

export default function AuthCallbackPage() {
    const params = useSearchParams();

    useEffect(() => {
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");

        if (accessToken && refreshToken) {
            window.opener.postMessage(
                {
                    access_token: accessToken,
                    refresh_token: refreshToken,
                },
                window.origin
            );
            window.close();
        }
    }, []);

    return <Loading />
}
