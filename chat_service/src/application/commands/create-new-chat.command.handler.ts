import { CreateNewChatCommand } from "../../domain/command/create-new-chat.command";
import { IChatRepository } from "../../domain/repository/chat.repository";
import { CommandHanlder } from "./command.handler";

export class CreateNewChatCommandHandler implements CommandHanlder<CreateNewChatCommand> {

    constructor(private repo: IChatRepository) { }

    execute(c: CreateNewChatCommand): Promise<CreateNewChatCommand | null> {
        throw new Error("Method not implemented.");
    }

}