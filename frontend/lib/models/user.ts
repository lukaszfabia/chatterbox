export class User {
    constructor(
        public id: string,
        public createdAt: string,
        public updatedAt: string,
        public deletedAt: string,
        public username: string,
        public email: string,
        public firstName?: string | null,
        public lastName?: string | null,
        public bio?: string | null,
        public avatarURL?: string | null,
        public backgroundURL?: string | null,
    ) { }

    get fullName(): string {
        return `${this.firstName ?? ""} ${this.lastName ?? ""}`.trim();
    }

    isDeleted(): boolean {
        return !!this.deletedAt;
    }

    get profile() {
        return {
            firstName: this.firstName ?? "",
            lastName: this.lastName ?? "",
            bio: this.bio ?? "",
        }
    }

    get auth() {
        return {
            username: this.username,
            email: this.email,
            password: "",
        }
    }
}



export function initials(placeholder: string, lhs?: string | null, rhs?: string | null): string {
    if (lhs && rhs) {
        return lhs.charAt(0) + rhs.charAt(0)
    }

    return placeholder.charAt(0)
}
