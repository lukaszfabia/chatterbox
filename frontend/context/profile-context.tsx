"use client";

import { User } from "@/lib/models/user";
import { createContext, ReactNode, useCallback, useContext, useState } from "react";

export interface ProfileProps {

}

type ProfileCtxProps = {
    currUserProfile: User | null;
    isLoading: boolean;
    error?: string | null;

    fetchCurrentUserProfile: () => Promise<User | null>;
    fetchByID: (id: string) => Promise<User | null>;
    fetchProfiles: (limit: number) => Promise<User[]>;
}

const ProfileCtx = createContext<ProfileCtxProps>({
    currUserProfile: null,
    isLoading: false,
    error: null,
    fetchCurrentUserProfile: async () => null,
    fetchByID: async () => null,
    fetchProfiles: async () => [],
})


export function ProfileProvider({ children }: { children: ReactNode }) {
    const [currUserProfile, setCurrUserProfile] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchByID = useCallback(async (id: string): Promise<User | null> => {
        return null;
    }, [])

    const fetchProfiles = useCallback(async (): Promise<User[]> => {
        return [];
    }, [])

    const fetchCurrentUserProfile = useCallback(async (): Promise<User | null> => {
        return null;
    }, [])

    return (
        <ProfileCtx.Provider value={{ currUserProfile, isLoading, error, fetchByID, fetchProfiles, fetchCurrentUserProfile }}>
            {children}
        </ProfileCtx.Provider>
    )
}


export const useProfile = () => {
    const context = useContext(ProfileCtx);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};