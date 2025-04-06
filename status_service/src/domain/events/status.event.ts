import { Event } from "./event";

export class StatusEvent extends Event {
    constructor(public messageID: string, public userID: string, public isOnline: boolean) { super() }
}