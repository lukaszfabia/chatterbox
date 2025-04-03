import { ConversationDTO } from "../../domain/dto/conversation.dto";
import { GetConversationsQuery } from "../../domain/queries/get-conversations.query";
import { IChatRepository } from "../../domain/repository/chat.repository";
import { QueryHandler } from "./query.handler";

export class GetConversationsQueryHandler implements QueryHandler<GetConversationsQuery> {

    constructor(private repo: IChatRepository) { }

    async execute(q: GetConversationsQuery): Promise<ConversationDTO[]> {
        return await this.repo.getConversationForMember(q.userID)
    }
}