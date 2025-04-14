import { Command } from "./command";

// Command class for creating a new message in a chat
export class CreateMessageCommand implements Command {
    receiverID: string;  // ID of the user receiving the message
    senderID: string;    // ID of the user sending the message
    content: string;     // The actual content of the message
    chatID: string;      // ID of the chat where the message is being sent
    sentAt: number;      // Timestamp when the message is sent
}
