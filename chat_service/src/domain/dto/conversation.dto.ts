import { MessageDTO } from "./message.dto";
import { IConversation, User } from "../../domain/models/conversation.model";

// Data Transfer Object for representing a conversation
export class ConversationDTO {
    constructor(
        public readonly id: string,             // Unique identifier for the conversation
        public readonly members: User[],        // List of users (members) in the conversation
        public readonly lastMessage?: MessageDTO,  // Last message sent in the conversation (optional)
        public readonly updatedAt?: Date,       // Timestamp of the last update to the conversation (optional)
    ) { }

    /**
     * Static method to convert a MongoDB document to a ConversationDTO.
     * 
     * @param doc The MongoDB document to convert.
     * @returns A new instance of ConversationDTO.
     */
    static fromMongoDocument(doc: IConversation): ConversationDTO {
        return new ConversationDTO(
            doc._id?.toString() || "",
            doc.members.map((member: any) => new User(member.userID, member.username, member.avatarURL)),
            doc.lastMessage ? MessageDTO.fromMongoDocument(doc.lastMessage) : undefined,
            doc.updatedAt
        );
    }
}
