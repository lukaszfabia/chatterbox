import { Event } from "./event";

export class MessageSentEvent implements Event {
    constructor(public readonly messageID: string, public readonly userID: string) { }
}