import { Event } from "./event";

/**
 * Represents an event triggered when a user's status changes.
 * 
 * This event is triggered when the online/offline status of a user changes.
 * It includes the message ID (for tracking purposes) and the user ID
 * along with their updated status (online or offline).
 */
export class StatusEvent implements Event {
    constructor(
        /** Unique identifier for the message associated with the status change */
        public messageID: string,

        /** ID of the user whose status has changed */
        public userID: string,

        /** User's new online/offline status */
        public isOnline: boolean
    ) { }
}
