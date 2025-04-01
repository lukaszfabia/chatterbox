import { MessageDTO } from "./message.dto";
import { User } from "../../domain/models/conversation.model";

export class ConversationDTO {
    constructor(
        public readonly id: string,
        public readonly members: User[],
        public readonly lastMessage?: MessageDTO,
        public readonly updatedAt?: Date,
    ) { }

    static fromMongoDocument(doc: any): ConversationDTO {
        return new ConversationDTO(
            doc._id?.toString() || "",
            doc.members,
            doc.lastMessage ? MessageDTO.fromMongoDocument(doc.lastMessage) : undefined,
            doc.updatedAt
        );
    }
}
