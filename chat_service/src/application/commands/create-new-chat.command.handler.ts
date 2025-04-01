import { CreateNewChatCommand } from "../../domain/command/create-new-chat.command";
import { ConversationDTO } from "../../domain/dto/conversation.dto";
import { IConversation } from "../../domain/models/conversation.model";
import { IChatRepository } from "../../domain/repository/chat.repository";
import { CommandHanlder } from "./command.handler";

export class CreateNewChatCommandHandler implements CommandHanlder<CreateNewChatCommand> {

    constructor(private repo: IChatRepository) { }

    async execute(c: CreateNewChatCommand): Promise<ConversationDTO | null> {
        return await this.repo.createConversation(c.members)
    }

}