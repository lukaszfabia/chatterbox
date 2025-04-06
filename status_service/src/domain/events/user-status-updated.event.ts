import { Event } from "./event";

export class UserStatusUpdatedEvent extends Event {
    constructor(public readonly userID: string, public readonly isOnline: boolean) { super() }
}