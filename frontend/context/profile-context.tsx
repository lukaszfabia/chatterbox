"use client";

import { api } from "@/lib/api";
import { User } from "@/lib/models/user";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "./auth-context";

export interface ProfileProps {

}

type ProfileCtxProps = {
    currUserProfile: User | null;
    isLoading: boolean;
    error?: string | null;

    fetchByID: (id: string) => Promise<User | null>;
    fetchProfiles: (limit: number) => Promise<User[]>;
}

const ProfileCtx = createContext<ProfileCtxProps>({
    currUserProfile: null,
    isLoading: false,
    error: null,
    fetchByID: async () => null,
    fetchProfiles: async () => [],
})


export function ProfileProvider({ children }: { children: ReactNode }) {
    const [currUserProfile, setCurrUserProfile] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { isAuth } = useAuth();


    useEffect(() => {
        const fetch = async () => {
            console.log('Fetching user...')
            setIsLoading(true);
            const user = await api<User>({
                service: "profile",
                endpoint: "/auth/me",
                apiVersion: "api/v1",
                method: "GET",
            });

            if (user) {
                console.log(user);
                setCurrUserProfile(user);
            }

            setIsLoading(false);
        }

        if (!currUserProfile) {
            fetch();
        }
    }, [isAuth]);

    const fetchByID = useCallback(async (id: string): Promise<User | null> => {
        return null;
    }, [])

    const fetchProfiles = useCallback(async (): Promise<User[]> => {
        setIsLoading(true);
        const users = await api<User[]>({
            service: "profile",
            endpoint: "/many",
            apiVersion: "api/v1",
            method: "GET",
        })


        if (!users) {
            setError('Failed to fetch users');
        }
        setIsLoading(false);
        return users ?? [];
    }, [])

    return (
        <ProfileCtx.Provider value={{ currUserProfile, isLoading, error, fetchByID, fetchProfiles }}>
            {children}
        </ProfileCtx.Provider>
    )
}


export const useProfile = () => {
    const context = useContext(ProfileCtx);
    if (!context) {
        throw new Error("useAuth must be used within an ProfileProvider");
    }
    return context;
};