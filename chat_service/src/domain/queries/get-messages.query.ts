import { Query } from "./query";

/**
 * Query to fetch all messages for a specific chat.
 */
export class GetMessagesQuery implements Query {
    /**
     * @param chatID - ID of the chat whose messages are to be fetched
     */
    constructor(public chatID: string) { }
}
