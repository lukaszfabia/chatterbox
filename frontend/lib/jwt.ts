import { jwtDecode } from "jwt-decode";
import { ACCESS } from "./token";

export default function getUserID(): string | null {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem(ACCESS);
    if (!token) return null;

    try {
        const decoded = jwtDecode<{ sub: string, exp: number }>(token);
        if (decoded && decoded.sub) {
            return decoded.sub;
        }
        return null;
    } catch (error) {
        console.error("Invalid token", error);
        return null;
    }
}
