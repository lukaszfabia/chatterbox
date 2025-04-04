"use client";
import { api } from "@/lib/api";
import { User } from "@/lib/models/user";
import { createContext, ReactNode, useCallback, useContext } from "react";
import { useAuth } from "./auth-context";
import useSWR from "swr";

type ProfileCtxProps = {
    currUserProfile: User | null;
    isLoading: boolean;
    error?: string | null;

    fetchByID: (id: string) => Promise<User | null>;
    fetchProfiles: () => Promise<User[]>;
};

const ProfileCtx = createContext<ProfileCtxProps>({
    currUserProfile: null,
    isLoading: false,
    error: null,
    fetchByID: async () => null,
    fetchProfiles: async () => [],
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

    const fetchByID = useCallback(async (id: string): Promise<User | null> => {
        try {
            const user = await api<User>({
                service: "profile",
                apiVersion: "api/v1",
                endpoint: `/profiles/${id}`,
                method: "GET",
            });

            if (!user) throw new Error("User not found");

            return user;
        } catch (err) {
            console.error("Failed to fetch user by ID:", err);
            return null;
        }
    }, []);

    const fetchProfiles = useCallback(async (): Promise<User[]> => {
        try {
            const users = await api<User[]>({
                service: "profile",
                apiVersion: "api/v1",
                endpoint: "/profiles",
                method: "GET",
            });

            if (!users) return [];

            return users.filter((v) => v.id !== userID) ?? [];
        } catch (err) {
            console.error("Error fetching profiles:", err);
            return [];
        }
    }, [userID]);

    return (
        <ProfileCtx.Provider
            value={{
                currUserProfile: currUserProfile ?? null,
                isLoading,
                error: error?.message ?? null,
                fetchByID,
                fetchProfiles,
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
