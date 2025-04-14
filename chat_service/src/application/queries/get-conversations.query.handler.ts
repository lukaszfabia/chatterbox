import { ConversationDTO } from "../../domain/dto/conversation.dto";
import { GetConversationsQuery } from "../../domain/queries/get-conversations.query";
import { IChatRepository } from "../../domain/repository/chat.repository";
import { QueryHandler } from "./query.handler";

// QueryHandler for processing the GetConversationsQuery
export class GetConversationsQueryHandler implements QueryHandler<GetConversationsQuery> {

    constructor(private repo: IChatRepository) { }

    /**
     * Executes the query to fetch the conversations for a specific user.
     * 
     * @param q The query object containing the userID for which conversations are to be fetched.
     * @returns A Promise that resolves to a list of conversations (ConversationDTO) for the user.
     */
    async execute(q: GetConversationsQuery): Promise<ConversationDTO[]> {
        console.log('Getting messages for user with ', q.userID);

        return await this.repo.getConversationForMember(q.userID);
    }
}
