import { DTO } from "./model";

export interface TokenDTO extends DTO {
    access_token: string,
    refresh_token: string
}