const MAX = 20;

export default function trim(s: string, max: number = MAX): string {
    if (s.length < max) {
        return s
    }
    return s.substring(0, max)
}