// Keys to tokens in browser
export const REFRESH: string = "refresh"
export const ACCESS: string = "access"

export default function getToken(key: string) {
    return localStorage.getItem(key) || sessionStorage.getItem(key);
}