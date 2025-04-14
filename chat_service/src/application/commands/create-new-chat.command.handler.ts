import { CreateNewChatCommand } from "../../domain/command/create-new-chat.command";
import { ConversationDTO } from "../../domain/dto/conversation.dto";
import { IChatRepository } from "../../domain/repository/chat.repository";
import { CommandHandler } from "./command.handler";

// Command handler for creating a new chat (conversation)
export class CreateNewChatCommandHandler implements CommandHandler<CreateNewChatCommand> {

    // Constructor that injects the repository for handling chat data
    constructor(private readonly repo: IChatRepository) { }

    /**
     * Executes the command to create a new conversation.
     * 
     * @param c The command containing the members to be added to the new conversation.
     * @returns A Promise that resolves to the created conversation or null if there is an error.
     */
    async execute(c: CreateNewChatCommand): Promise<ConversationDTO | null> {
        // Call the repository to create a new conversation with the provided members
        return await this.repo.createConversation(c.members);
    }

}
