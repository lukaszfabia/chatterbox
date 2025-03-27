export type User = {
    ID: string,
    email: string,
    username: string,
    firstName: string | undefined | null,
    lastName: string | undefined | null,
    createdAt: Date,
    avatarURL: string | undefined | null,
    backgroundURL: string | undefined | null,
    bio: string | undefined | null,
}


export function initials(placeholder: string, lhs?: string | null, rhs?: string | null): string {
    if (lhs && rhs) {
        return lhs.charAt(0) + rhs.charAt(0)
    }

    return placeholder.charAt(0)
}



// dummy values 


export function GetDummyUser(): User {
    return {
        ID: "asas",
        email: "joe.doe@exmaple.com",
        firstName: "Joe",
        lastName: "Doe",
        createdAt: new Date(2023, 5, 15),
        avatarURL: "/dummy/avatar.png",
        backgroundURL: "/dummy/example_background.jpg",
        bio: "lorem ipsum",
        username: "joey"
    }
}

export function GetDummyUsers(): User[] {
    return [
        {
            ID: "asas",
            email: "joe.doe@exmaple.com",
            firstName: "Joe",
            lastName: "Doe",
            createdAt: new Date(2023, 5, 15),
            avatarURL: "",
            backgroundURL: "/dummy/example_background.jpg",
            bio: "lorem ipsum",
            username: "joey"
        },
        {
            ID: "asas",
            email: "jankow@exmaple.com",
            firstName: "Jan",
            lastName: "Kowalski",
            createdAt: new Date(2023, 5, 15),
            avatarURL: "",
            backgroundURL: "/dummy/example_background.jpg",
            bio: "lorem ipsum",
            username: "janek"
        },
        {
            ID: "asas",
            email: "maryjane@exmaple.com",
            firstName: "Mary",
            lastName: "Jane",
            createdAt: new Date(2023, 5, 15),
            avatarURL: "/dummy/avatar.png",
            backgroundURL: "/dummy/example_background.jpg",
            bio: "lorem ipsum",
            username: "mjane"
        },
    ]
}