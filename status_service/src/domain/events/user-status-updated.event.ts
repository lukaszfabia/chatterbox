import { Event } from "./event";

export class UserStatusUpdatedEvent implements Event {
    constructor(public readonly userID: string, public readonly isOnline: boolean) { }
}