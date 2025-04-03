import { Query } from "./query";

export class GetConversationsQuery implements Query {
    constructor(public userID: string) {
        this.userID = userID
    }
}