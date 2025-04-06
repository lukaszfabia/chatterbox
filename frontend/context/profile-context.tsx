"use client";
import { api } from "@/lib/api";
import { User } from "@/lib/dto/user";
import { createContext, ReactNode, useCallback, useContext } from "react";
import { useAuth } from "./auth-context";
import useSWR, { mutate } from "swr";

type ProfileCtxProps = {
    currUserProfile: User | null;
    isLoading: boolean;
    error?: string | null;

    fetchByID: (id: string) => Promise<User | null>;
    fetchProfiles: () => Promise<User[]>;
    updateProfile: (data: FormData) => Promise<User | null>;
};

const ProfileCtx = createContext<ProfileCtxProps>({
    currUserProfile: null,
    isLoading: false,
    error: null,
    fetchByID: async () => null,
    fetchProfiles: async () => [],
    updateProfile: async () => null,
});

const fetchCurrentProfile = async (): Promise<User | null> => {
    return await api<User>({
        service: "profile",
        apiVersion: "api/v1",
        endpoint: "/auth/me",
        method: "GET",
    });
};

export function ProfileProvider({ children }: { children: ReactNode }) {
    const { userID, isAuth } = useAuth();

    const {
        data: currUserProfile,
        error,
        isLoading,
    } = useSWR(isAuth && userID ? "profile/me" : null, fetchCurrentProfile);

    const updateProfile = useCallback(async (data: FormData): Promise<User | null> => {
        const user = await api<User>({
            body: data,
            service: "profile",
            apiVersion: "api/v1",
            endpoint: `/auth/me`,
            method: "PUT",
        });

        if (!user) return null;
        mutate("profile/me");
        return user;
    }, []);

    const fetchByID = useCallback(async (id: string): Promise<User | null> => {
        const user = await api<User>({
            service: "profile",
            apiVersion: "api/v1",
            endpoint: `/profiles/${id}`,
            method: "GET",
        });

        return user;
    }, []);

    const fetchProfiles = useCallback(async (): Promise<User[]> => {
        const users = await api<User[]>({
            service: "profile",
            apiVersion: "api/v1",
            endpoint: "/profiles",
            method: "GET",
        });

        if (!users) return [];

        return users.filter((v) => v.id !== userID) ?? [];
    }, [userID]);

    return (
        <ProfileCtx.Provider
            value={{
                currUserProfile: currUserProfile ?? null,
                isLoading,
                error: error?.message ?? null,
                fetchByID,
                fetchProfiles,
                updateProfile,
            }}
        >
            {children}
        </ProfileCtx.Provider>
    );
}

export const useProfile = () => {
    const context = useContext(ProfileCtx);
    if (!context) {
        throw new Error("useProfile must be used within a ProfileProvider");
    }
    return context;
};
