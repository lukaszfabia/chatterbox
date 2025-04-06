import { Event } from "./event";


export class MessageSentEvent extends Event {
    constructor(public readonly messageID: string, public readonly userID: string) { super() }
}