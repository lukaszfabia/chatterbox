import { User } from "../models/conversation.model";
import { Command } from "./command";

// Command class for creating a new chat with specified members
export class CreateNewChatCommand implements Command {

    constructor(
        public readonly members: User[] // List of members (users) to be part of the chat
    ) { }
}
