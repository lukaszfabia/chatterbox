import { DTO } from "./model";

export interface StatusDTO extends DTO {
    userID: string,
    isOnline: boolean,
}