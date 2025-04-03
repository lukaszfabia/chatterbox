"use client";

import { AuthProvider } from "@/context/auth-context";
import { ProfileProvider } from "@/context/profile-context";
import React from "react";

export default function Provider({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <ProfileProvider>
                {children}
            </ProfileProvider>
        </AuthProvider>
    )
}