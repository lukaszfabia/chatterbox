"use client";

import { api } from "@/lib/api";
import { LoginDTO } from "@/lib/dto/login";
import { RegisterDTO } from "@/lib/dto/register";
import { TokenDTO } from "@/lib/dto/tokens";
import getUserID from "@/lib/jwt";
import getToken, { ACCESS, REFRESH } from "@/lib/token";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";

function clearStorage() {
    localStorage.removeItem(ACCESS);
    localStorage.removeItem(REFRESH);
    sessionStorage.removeItem(ACCESS);
    sessionStorage.removeItem(REFRESH);
}

type AuthCtxProps = {
    /* Attrs */
    isAuth: boolean;
    isLoading: boolean;
    error?: string | null;
    userID: string | null;

    /* Methods */
    logout: () => void;
    authenticate: (data: LoginDTO | RegisterDTO, type: "login" | "register") => void;
}

const AuthCtx = createContext<AuthCtxProps>({
    isAuth: false,
    isLoading: false,
    error: null,
    userID: null,
    logout: () => { },
    authenticate: async () => { },
})


export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuth, setIsAuth] = useState<boolean>(!!getToken(ACCESS))
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [userID, setUserID] = useState<string | null>(null);

    const logout = useCallback(() => {
        clearStorage();
        setUserID(null);
        setIsAuth(false);
    }, []);

    const authenticate = useCallback(async (data: LoginDTO | RegisterDTO, type: "login" | "register") => {
        setIsLoading(true);
        setError(null);
        try {
            const tokens = await api<TokenDTO>({
                body: data,
                service: "auth",
                method: "POST",
                endpoint: `/${type}/`,
                apiVersion: "api/v1",
            });

            if (tokens) {
                localStorage.setItem(ACCESS, tokens.access_token);
                localStorage.setItem(REFRESH, tokens.refresh_token);
                setIsAuth(true);
                setUserID(getUserID());
            }
        } catch (error) {
            setError("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }, []);


    return (
        <AuthCtx.Provider value={{ isAuth, isLoading, error, userID, authenticate, logout }}>
            {children}
        </AuthCtx.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthCtx);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};