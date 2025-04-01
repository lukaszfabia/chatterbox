import { User } from "../models/conversation.model";
import { Command } from "./command";

export class CreateNewChatCommand implements Command {
    members: User[]
}