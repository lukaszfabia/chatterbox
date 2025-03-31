import { IConversation } from "../models/conversation.model"
import { IMessage } from "../models/message.model"

export interface IChatRepository {
    createConversation(chat: IConversation): Promise<IConversation | null>;

    updateConversation(chatID: string, updateData: Partial<IConversation>): Promise<IConversation | null>;

    appendMessage(chatID: string, message: IMessage): Promise<void>;

    getConversationForMember(memberID: string, page?: number, limit?: number): Promise<IConversation[]>;

    getConversationById(chatID: string): Promise<IConversation | null>;

    deleteConversation(chatID: string): Promise<void>;
}