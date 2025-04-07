import { Event } from "./event";

export class GotNewMessageEvent implements Event {
    constructor(public userID: string, public sender: string, public message: string) { }
}
