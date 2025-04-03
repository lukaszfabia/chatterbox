// Keys to tokens in browser
export const REFRESH: string = "refresh"
export const ACCESS: string = "access"
export default function getToken(key: string) {
    if (typeof window !== "undefined") {
        return localStorage.getItem(key) || sessionStorage.getItem(key);
    }
    return null;
}