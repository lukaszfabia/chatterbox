import { DTO } from "./model";

export interface LoginDTO extends DTO {
    email_or_username: string,
    password: string
}