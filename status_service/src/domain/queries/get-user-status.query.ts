import { Query } from "./query";

/**
 * Represents a query to retrieve the status of a user.
 * 
 * This class is used to fetch the status (online/offline) of a specific user based on their userID.
 */
export class GetUserStatusQuery implements Query {
    /**
     * Creates an instance of GetUserStatusQuery.
     * 
     * @param userID - The unique identifier of the user whose status is being queried.
     */
    constructor(public readonly userID: string) { }
}
