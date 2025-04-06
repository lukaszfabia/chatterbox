import { Event } from "./event";

export class UserLoggedOutEvent extends Event {
    constructor(public readonly userID: string) { super() }
}