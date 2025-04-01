import { Event } from "./event";

export class StatusEvent implements Event {
    constructor(public messageID: string, public userID: string, public isOnline: boolean) { }
}