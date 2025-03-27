// "use client";

// import { api } from "@/lib/api";
// import { Tokens, User } from "@/lib/models"
// import getToken, { ACCESS, REFRESH } from "@/lib/token";
// import { redirect } from "next/navigation";
// import { createContext, FC, ReactNode, useCallback, useContext, useEffect, useState } from "react";


// function clearStorage() {
//     localStorage.removeItem(ACCESS);
//     localStorage.removeItem(REFRESH);
//     sessionStorage.removeItem(ACCESS);
//     sessionStorage.removeItem(REFRESH);
// }

// export interface AuthProps {
//     email: string,
//     password: string
//     remember_me: boolean

//     // is login or sign up form 
//     on_create: boolean
// }

// type AuthCtxProps = {
//     /* Attrs */
//     user?: User | null;
//     isLoading: boolean;
//     error?: string | null,

//     /* Methods */
//     logout: () => void;
//     auth: (data: AuthProps) => void;
//     refresh: () => void;
//     update: (body: Record<string, any>) => void;
//     addRfid: () => void;
//     rfidAuth: () => void;
// }

// const AuthCtx = createContext<AuthCtxProps>({
//     user: null,
//     isLoading: false,
//     error: null,
//     logout: () => { },
//     auth: async () => { },
//     update: async () => { },
//     refresh: async () => { },
//     addRfid: async () => { },
//     rfidAuth: async () => { },
// })


// export interface AuthProviderProps {
//     children: ReactNode;
// }

// export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
//     const [user, setUser] = useState<User | null>(null);
//     const [isLoading, setIsLoading] = useState<boolean>(false);
//     const [error, setError] = useState<string | null | undefined>(null);

//     useEffect(() => {
//         if (!user && getToken(ACCESS)) {
//             refresh();
//         }
//     }, [user])

//     const auth = useCallback(async (data: AuthProps) => {
//         setIsLoading(true);

//         try {
//             const result = await api<Tokens>({
//                 method: "POST",
//                 endpoint: data.on_create ? "/sign-up/" : "/sign-in/",
//                 body: data,
//             })

//             if (result.data) {
//                 setUser(result.data.user)

//                 // save tokens 
//                 const storage = data.remember_me ? localStorage : sessionStorage;
//                 clearStorage();

//                 storage.setItem(ACCESS, result.data.access_token)
//                 storage.setItem(REFRESH, result.data.refresh_token)

//             } else if (result.detail) {
//                 console.log("error: ", result.detail)
//                 setError(result.detail)
//             }


//         } catch (err) {
//             setError("Unknown error")
//         } finally {
//             setIsLoading(false);
//         }

//     }, []);


//     const logout = useCallback(() => {
//         setIsLoading(true);
//         setUser(null);
//         clearStorage();
//         setIsLoading(false);
//         redirect("/login")
//     }, []);


//     const refresh = useCallback(async () => {
//         setIsLoading(true);

//         try {
//             const result = await api<User>({
//                 endpoint: "/user/me/",
//             })

//             if (result.data) {
//                 setUser(result.data)
//             } else if (result.detail) {
//                 setError(result.detail)
//             } else {
//                 setError("Unknown error")
//             }


//         } catch (err) {
//             setError("Unknown error")
//         } finally {
//             setIsLoading(false);
//         }
//     }, []);

//     const update = useCallback((async (body: Record<string, any>) => {
//         setIsLoading(true);

//         try {
//             const res = await api<User>({
//                 method: "PUT",
//                 apiVersion: "/api/v1",
//                 endpoint: "/user/me/",
//                 body: body
//             });

//             if (res.data) {
//                 setUser(res.data)
//             } else if (res.detail) {
//                 setError(res.detail);
//             } else {
//                 setError("Unknown error");
//             }
//         } catch (error) {
//             setError("Unknown error")
//         } finally {
//             setIsLoading(false);
//         }
//     }), []);

//     const addRfid = useCallback((async () => {
//         setIsLoading(true);

//         try {
//             const res = await api<User>({
//                 apiVersion: "/api/v1",
//                 endpoint: "/user/rfid",
//             });

//             if (res.data) {
//                 setUser(res.data)
//             } else if (res.detail) {
//                 setError(res.detail);
//             } else {
//                 setError("Unknown error");
//             }
//         } catch (error) {
//             setError("Unknown error")
//         } finally {
//             setIsLoading(false);
//         }
//     }), []);

//     const rfidAuth = async () => {
//         setIsLoading(true)
//         try {
//             const result = await api<Tokens>({
//                 endpoint: "/rfid-auth",
//                 apiVersion: "/api/v1"
//             })

//             if (result.data) {
//                 setUser(result.data.user)

//             } else if (result.detail) {
//                 console.log("error: ", result.detail)
//                 setError(result.detail)
//             }

//         } catch (error) {

//         } finally {
//             setIsLoading(false)
//         }
//     }

//     return (
//         <AuthCtx.Provider value={{
//             user,
//             isLoading,
//             error,
//             logout,
//             auth,
//             refresh,
//             update,
//             addRfid,
//             rfidAuth
//         }}>
//             {children}
//         </AuthCtx.Provider>
//     )

// }

// export const useAuth = () => {
//     const context = useContext(AuthCtx);
//     if (!context) {
//         throw new Error("useAuth must be used within an AuthProvider");
//     }
//     return context;
// };