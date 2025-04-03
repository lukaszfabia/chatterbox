export type User = {
    id: string,
    createdAt: string,
    updatedAt: string,
    deletedAt: string,
    firstName: string | undefined | null,
    lastName: string | undefined | null,
    username: string,
    email: string,
    bio: string | undefined | null,
    avatarURL: string | undefined | null,
    backgroundURL: string | undefined | null,
}



export function initials(placeholder: string, lhs?: string | null, rhs?: string | null): string {
    if (lhs && rhs) {
        return lhs.charAt(0) + rhs.charAt(0)
    }

    return placeholder.charAt(0)
}
