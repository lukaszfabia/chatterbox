import { MessageDTO } from "../../domain/dto/message.dto";
import { GetMessagesQuery } from "../../domain/queries/get-messages.query";
import { IChatRepository } from "../../domain/repository/chat.repository";
import { QueryHandler } from "./query.handler";

export class GetMessagesQueryHandler implements QueryHandler<GetMessagesQuery> {

    constructor(private repo: IChatRepository) { }

    async execute(q: GetMessagesQuery): Promise<MessageDTO[]> {
        return await this.repo.getMessages(q.chatID, 10)
    }
}