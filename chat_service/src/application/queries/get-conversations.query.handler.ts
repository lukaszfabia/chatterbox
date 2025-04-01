import { GetConversationsQuery } from "../../domain/queries/get-conversations.query";
import { IChatRepository } from "../../domain/repository/chat.repository";
import { QueryHandler } from "./query.handler";

export class GetConversationsQueryHandler implements QueryHandler<GetConversationsQuery> {

    constructor(private repo: IChatRepository) { }

    execute(_: GetConversationsQuery): Promise<void> {
        throw new Error("Method not implemented.");
    }
}