import { DTO } from "./model";

export interface UpdateUserDTO extends DTO {
    email: string,
    password: string,
    username: string,
}


export interface UpdateProfileDTO extends DTO {
    firstName?: string | null;
    lastName?: string | null;
    bio?: string | null;
    avatarFile?: File | null;
    backgroundFile?: File | null;
}