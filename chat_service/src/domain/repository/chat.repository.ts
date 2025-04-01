import { ConversationDTO } from "../dto/conversation.dto";
import { MessageDTO } from "../dto/message.dto";
import { User } from "../models/conversation.model"

export interface IChatRepository {
    createConversation(members: User[]): Promise<ConversationDTO | null>;

    updateConversation(chatID: string, updateData: Partial<ConversationDTO>): Promise<ConversationDTO | null>;

    appendMessage(receiverID: string,
        senderID: string,
        content: string,
        chatID: string,
        sentAt: number): Promise<ConversationDTO | null>;

    getConversationForMember(memberID: string, page?: number, limit?: number): Promise<ConversationDTO[]>;

    getMessages(chatID: string, limit: number): Promise<MessageDTO[]>;

    getConversationById(chatID: string): Promise<ConversationDTO | null>;

    deleteConversation(chatID: string): Promise<ConversationDTO | null>;
}
