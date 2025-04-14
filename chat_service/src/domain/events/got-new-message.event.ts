import { Event } from "./event";

// Event triggered when a new message is received by a user
export class GotNewMessageEvent implements Event {
    constructor(
        public userID: string,   // ID of the user receiving the new message
        public sender: string,   // Username of the sender
        public message: string   // Content of the new message
    ) { }
}
