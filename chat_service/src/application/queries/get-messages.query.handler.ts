import { MessageDTO } from "../../domain/dto/message.dto";
import { GetMessagesQuery } from "../../domain/queries/get-messages.query";
import { IChatRepository } from "../../domain/repository/chat.repository";
import { QueryHandler } from "./query.handler";

// QueryHandler for processing the GetMessagesQuery
export class GetMessagesQueryHandler implements QueryHandler<GetMessagesQuery> {

    // Constructor injecting the repository used to fetch messages
    constructor(private repo: IChatRepository) { }

    /**
     * Executes the query to fetch messages for a specific chat.
     * 
     * @param q The query object containing the chatID for which messages are to be fetched.
     * @returns A Promise that resolves to a list of messages (MessageDTO) for the specified chat.
     */
    async execute(q: GetMessagesQuery): Promise<MessageDTO[]> {
        console.log('Getting messages for chat with chatID: ', q.chatID);
        return await this.repo.getMessages(q.chatID, 500);
    }
}
