import { Event } from "./event";

// Event triggered when a member's information (username or avatar) is updated
export class MemberUpdatedInfoEvent implements Event {
	constructor(
		public readonly userID: string,      // ID of the user whose info is being updated
		public readonly username?: string | null,  // New username (optional)
		public readonly avatarURL?: string | null // New avatar URL (optional)
	) { }
}
