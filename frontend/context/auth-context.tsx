"use client";

import { LoginDTO } from "@/lib/dto/login";
import { RegisterDTO } from "@/lib/dto/register";
import getToken, { ACCESS, REFRESH } from "@/lib/token";
import { createContext, ReactNode, useCallback, useContext, useState } from "react";

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

    /* Methods */
    logout: () => void;
    login: (data: LoginDTO) => void;
    register: (data: RegisterDTO) => void;
}

const AuthCtx = createContext<AuthCtxProps>({
    isAuth: false,
    isLoading: false,
    error: null,
    logout: () => { },
    login: async () => { },
    register: async () => { },
})


export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuth, setIsAuth] = useState<boolean>(!!getToken(ACCESS))
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const logout = useCallback(() => {
        clearStorage();
        setIsAuth(false);
    }, []);

    const login = useCallback(async (data: LoginDTO) => {

    }, []);


    const register = useCallback(async (data: RegisterDTO) => {

    }, []);


    return (
        <AuthCtx.Provider value={{ isAuth, isLoading, error, login, register, logout }}>
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