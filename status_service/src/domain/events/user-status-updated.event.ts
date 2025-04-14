import { Event } from "./event";

/**
 * Represents an event triggered when a user's status is updated.
 * 
 * This event is triggered whenever there is a change in a user's online/offline status.
 * It contains the user ID and the updated status (online or offline).
 */
export class UserStatusUpdatedEvent implements Event {
    /**
     * Creates an instance of UserStatusUpdatedEvent.
     * 
     * @param userID - The ID of the user whose status is updated.
     * @param isOnline - A boolean indicating whether the user is online (true) or offline (false).
     */
    constructor(public readonly userID: string, public readonly isOnline: boolean) { }
}