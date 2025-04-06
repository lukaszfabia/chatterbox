import { MemberUpdatedInfoEvent } from "../../domain/events/member-updated-info.event";
import { IChatRepository } from "../../domain/repository/chat.repository";
import { EventHandler } from "./event.handler";

export class MemberUpdatedInfoEventHandler implements EventHandler<MemberUpdatedInfoEvent> {
    constructor(private readonly repo: IChatRepository) { }

    async handle(event: MemberUpdatedInfoEvent): Promise<void> {
        const modified = await this.repo.updateMember(event.userID, event.avatarURL, event.username)
        console.log('modified count:', modified)
    }

}