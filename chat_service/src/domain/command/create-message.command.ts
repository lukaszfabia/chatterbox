import { Command } from "./command"

// Command class for creating a new message in a chat
export class CreateMessageCommand implements Command {
    constructor(
        public readonly receiverID: string,  // ID of the user receiving the message
        public readonly senderID: string,    // ID of the user sending the message
        public readonly content: string,     // The actual content of the message
        public readonly chatID: string,      // ID of the chat where the message is being sent
        public readonly sentAt: number,      // Timestamp when the message is sent
    ) { }
}
