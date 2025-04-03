const MAX_SECONDS = 60;
const MAX_MINUTES = 60 * MAX_SECONDS;
const MAX_HOURS = 24 * MAX_MINUTES;
const MAX_DAYS = 30 * MAX_HOURS;
const MAX_MONTHS = 12 * MAX_DAYS;
const MAX_YEARS = 100 * MAX_MONTHS;
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