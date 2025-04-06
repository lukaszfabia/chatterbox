import { Event } from "./event";

export class GotNewMessageEvent implements Event {
    constructor(userID: string, sender: string, message: string) { }
}
