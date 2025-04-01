import { IMessage } from "../models/message.model";
import { Command } from "./command";

export class CreateMessageCommand implements Command {
    receiverID: string
    senderID: string
    content: string
    chatID: string
    sentAt: number
} 