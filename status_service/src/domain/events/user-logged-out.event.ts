import { Event } from "./event";

/**
 * Represents an event triggered when a user logs out.
 * 
 * This event is triggered when a user successfully logs out of the system. It includes
 * the user ID to track which user logged out.
 */
export class UserLoggedOutEvent implements Event {
    constructor(
        /** ID of the user who logged out */
        public readonly userID: string
    ) { }
}
