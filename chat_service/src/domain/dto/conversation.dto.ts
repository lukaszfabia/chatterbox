import { MessageDTO } from "./message.dto";
import { IConversation, User } from "../../domain/models/conversation.model";

export class ConversationDTO {
    constructor(
        public readonly id: string,
        public readonly members: User[],
        public readonly lastMessage?: MessageDTO,
        public readonly updatedAt?: Date,
    ) { }

    static fromMongoDocument(doc: IConversation): ConversationDTO {
        return new ConversationDTO(
            doc._id?.toString() || "",
            doc.members.map((member: any) => new User(member.userID, member.username, member.avatarURL)),
            doc.lastMessage ? MessageDTO.fromMongoDocument(doc.lastMessage) : undefined,
            doc.updatedAt
        );
    }
}
