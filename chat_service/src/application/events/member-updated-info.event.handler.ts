import { MemberUpdatedInfoEvent } from "../../domain/events/member-updated-info.event";
import { IChatRepository } from "../../domain/repository/chat.repository";
import { EventHandler } from "./event.handler";

// EventHandler for processing the MemberUpdatedInfoEvent
export class MemberUpdatedInfoEventHandler implements EventHandler<MemberUpdatedInfoEvent> {
    // Constructor injecting the repository that will be used to update member info
    constructor(private readonly repo: IChatRepository) { }

    /**
     * Handles the event of updating member information.
     * 
     * @param event The event that contains the information to update for the member.
     * @returns A Promise that resolves when the member info update process is complete.
     */
    async handle(event: MemberUpdatedInfoEvent): Promise<void> {
        // Call the repository to update the member's information (avatar and username)
        const modified = await this.repo.updateMember(event.userID, event.avatarURL, event.username);

        // Log how many records were modified (updated)
        console.log('Modified count:', modified);
    }
}
