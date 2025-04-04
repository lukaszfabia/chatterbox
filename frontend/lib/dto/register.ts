import { DTO } from "./model";

export interface RegisterDTO extends DTO {
    email: string,
    username: string,
    password: string
}