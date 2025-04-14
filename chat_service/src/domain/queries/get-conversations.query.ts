import { Query } from "./query";

/**
 * Query to fetch all conversations for a given user.
 */
export class GetConversationsQuery implements Query {
    /**
     * @param userID - ID of the user whose conversations are to be fetched
     */
    constructor(public userID: string) {
        this.userID = userID;
    }
}
