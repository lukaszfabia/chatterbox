import { Event } from "./event";

// Event triggered when a user's online status changes
export class StatusEvent implements Event {
    constructor(
        public messageID: string,  // ID of the message related to the status change
        public userID: string,     // ID of the user whose status is changing
        public isOnline: boolean   // The new online status (true for online, false for offline)
    ) { }
}
