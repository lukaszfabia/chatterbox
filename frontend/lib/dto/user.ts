import { DenormalizedUser } from "./message";
import { DTO } from "./model";

export interface User extends DTO {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    username: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    bio?: string | null;
    avatarURL?: string | null;
    backgroundURL?: string | null;
}



export function initials(placeholder: string, lhs?: string | null, rhs?: string | null): string {
    if (lhs && rhs) {
        return lhs.charAt(0) + rhs.charAt(0)
    }

    return placeholder.charAt(0)
}


export function denormalizeUser(u: User): DenormalizedUser {
    return {
        userID: u.id,
        avatarURL: u.avatarURL,
        username: u.username
    }
}