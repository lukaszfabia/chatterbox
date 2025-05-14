import "date-fns"
import { format, formatDistanceToNow, parseISO } from "date-fns";

export function transformTime(time: string): string {
    const t = new Date(time);

    return `${formatDistanceToNow(t)} ago`;
}

export function convertTime(t?: string | null | Date): string {
    if (!t) return "";
    if (t instanceof Date) {
        return format(t, "yyyy-MM-dd");
    } else {
        return format(parseISO(t), "yyyy-MM-dd");
    }
}