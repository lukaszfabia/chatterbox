const MAX = 20;

export default function trim(s: string): string {
    if (s.length < MAX) {
        return s
    }
    return s.substring(0, MAX)
}