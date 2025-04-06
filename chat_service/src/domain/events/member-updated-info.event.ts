import { Event } from "./event"

export class MemberUpdatedInfoEvent implements Event {
	constructor(
		public userID: string,
		public username?: string | null,
		public avatarURL?: string | null) { }
}