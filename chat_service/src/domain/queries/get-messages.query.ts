import { Query } from "./query";

export class GetMessagesQuery implements Query {
    constructor(public chatID: string) {
    }
}