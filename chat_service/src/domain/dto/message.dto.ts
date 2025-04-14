import { IMessage } from "../models/message.model";

// Data Transfer Object for representing a message
export class MessageDTO {
    constructor(
        public readonly id: string,         // Unique identifier for the message
        public readonly senderID: string,   // ID of the user who sent the message
        public readonly receiverID: string, // ID of the user who received the message
        public readonly content: string,    // Content of the message
        public readonly sentAt: number,     // Timestamp when the message was sent
        public readonly chatID: string,     // ID of the chat where the message belongs
        public readonly status: string      // Status of the message (e.g., sent, delivered, read)
    ) { }

    /**
     * Static method to convert a MongoDB document to a MessageDTO.
     * 
     * @param doc The MongoDB document to convert.
     * @returns A new instance of MessageDTO.
     */
    static fromMongoDocument(doc: IMessage): MessageDTO {
        return new MessageDTO(
            doc._id?.toString() || "",
            doc.senderID,
            doc.receiverID,
            doc.content,
            doc.sentAt,
            doc.chatID,
            doc.status,
        );
    }
}
