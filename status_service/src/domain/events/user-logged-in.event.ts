import { Event } from "./event";

/**
 * Represents an event triggered when a user logs in.
 * 
 * This event is triggered when a user successfully logs into the system. It includes
 * the user ID to track which user logged in.
 */
export class UserLoggedInEvent implements Event {
    constructor(
        /** ID of the user who logged in */
        public readonly userID: string
    ) { }
}
