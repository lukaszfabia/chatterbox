"use client";

import { microservices } from "@/config/config";
import { api } from "@/lib/api";
import { LoginDTO } from "@/lib/dto/login";
import { RegisterDTO } from "@/lib/dto/register";
import { TokenDTO } from "@/lib/dto/tokens";
import { UpdateUserDTO } from "@/lib/dto/update";
import getUserID from "@/lib/jwt";
import getToken, { ACCESS, REFRESH } from "@/lib/token";
import { useRouter } from "next/navigation";
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
    userID: string | null;

    /* Methods */
    logout: () => void;
    authenticate: (data: LoginDTO | RegisterDTO, type: "login" | "register") => void;
    deleteAcc: () => void;
    updateAcc: (data: UpdateUserDTO) => Promise<string | null>;
    continueWith: (ssoProvider: string) => Promise<void>;
}

const AuthCtx = createContext<AuthCtxProps>({
    isAuth: false,
    isLoading: false,
    error: null,
    userID: null,
    logout: async () => { },
    authenticate: async () => { },
    deleteAcc: async () => { },
    updateAcc: async (data: UpdateUserDTO) => "",
    continueWith: async (ssoProvider: string) => { },
})


export function AuthProvider({ children }: { children: ReactNode }) {
    const [userID, setUserID] = useState<string | null>(() => getUserID());
    const [isAuth, setIsAuth] = useState<boolean>(() => !!getToken(ACCESS));
    const router = useRouter();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const continueWith = async (ssoProvider: string) => {
        const url = `http://${microservices.auth}/api/v1/auth/${ssoProvider}/login`

        console.log('url', url)
        const miniPage = window.open(url, "_blank", "width=500,height=600")


        const receiveMessage = (event: MessageEvent) => {
            if (event.origin !== window.location.origin) return;

            const { access_token, refresh_token } = event.data;
            if (access_token && refresh_token) {
                localStorage.setItem(ACCESS, access_token);
                localStorage.setItem(REFRESH, refresh_token);
                setIsAuth(true);
                setUserID(getUserID());
                miniPage?.close();
                window.removeEventListener("message", receiveMessage);
            }
        };

        window.addEventListener("message", receiveMessage);
    }


    const updateAcc = useCallback(async (data: UpdateUserDTO) => {
        if (userID) {
            try {
                await api<string>({
                    body: data,
                    service: "auth",
                    method: "PUT",
                    apiVersion: "api/v1",
                    endpoint: `/auth/me/`,
                })

                return "Success, account has been updated."
            } catch (error) {
                setError("Failed to Update Account");
                return null;
            }
        }

        return null;
    }, [])


    const deleteAcc = useCallback(async () => {
        if (userID) {
            try {
                await api<any>({
                    service: "auth",
                    method: "DELETE",
                    apiVersion: "api/v1",
                    endpoint: `/auth/me/`,
                })

                clearStorage();
                setUserID(null);
                setIsAuth(false);
                router.push("/login")

            } catch (error) {
                console.log('errror', error)
            }
        }
    }, [])

    const logout = useCallback(async () => {
        try {
            await api<any>({
                service: "auth",
                method: "GET",
                apiVersion: "api/v1",
                endpoint: `/auth/logout/`,
            })

            clearStorage();
            setUserID(null);
            setIsAuth(false);
            router.push("/login")
        } catch (error) {
            console.log('error', error)
        }
    }, []);

    const authenticate = useCallback(async (data: LoginDTO | RegisterDTO, type: "login" | "register") => {
        setIsLoading(true);
        console.log('Authing')

        setError(null);
        const tokens = await api<TokenDTO>({
            body: data,
            service: "auth",
            method: "POST",
            apiVersion: "api/v1",
            endpoint: `/auth/${type}/`,
        });

        if (tokens) {
            localStorage.setItem(ACCESS, tokens.access_token);
            localStorage.setItem(REFRESH, tokens.refresh_token);
            setIsAuth(true);
            setUserID(getUserID());
        } else {
            setError("Username or Email is invalid or password is incorrect.");
        }

        setIsLoading(false);

    }, []);


    return (
        <AuthCtx.Provider value={{ continueWith, isAuth, isLoading, error, userID, authenticate, logout, deleteAcc, updateAcc }}>
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