import { Event } from "./event";

export class UserLoggedOutEvent implements Event {
    constructor(public readonly userID: string) { }
}