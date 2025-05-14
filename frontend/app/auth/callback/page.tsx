"use client";

import { Suspense } from "react";
import Loading from "@/components/indicator";
import { useSearchParams } from "next/navigation";

function AuthCallback() {
    const params = useSearchParams();

    if (typeof window !== "undefined") {
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
    }

    return <Loading />;
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={<Loading />}>
            <AuthCallback />
        </Suspense>
    );
}