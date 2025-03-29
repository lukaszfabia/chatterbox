import { Event } from "./event";

export class UserLoggedInEvent implements Event {
    constructor(public readonly userID: string) { }
}