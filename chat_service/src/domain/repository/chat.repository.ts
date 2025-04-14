import { ConversationDTO } from "../dto/conversation.dto";
import { MessageDTO } from "../dto/message.dto";
import { User } from "../models/conversation.model";

/**
 * Interface for chat repository handling conversations and messages.
 */
export interface IChatRepository {
    /**
     * Creates a new conversation with the given members.
     * 
     * @param members - Array of users participating in the conversation
     * @returns A promise resolving to the created ConversationDTO or null
     */
    createConversation(members: User[]): Promise<ConversationDTO | null>;

    /**
     * Appends a new message to the given conversation.
     * 
     * @param receiverID - ID of the user receiving the message
     * @param senderID - ID of the user sending the message
     * @param content - Content of the message
     * @param chatID - ID of the conversation
     * @param sentAt - Timestamp (ms) when the message was sent
     * @returns A promise resolving to the updated ConversationDTO or null
     */
    appendMessage(
        receiverID: string,
        senderID: string,
        content: string,
        chatID: string,
        sentAt: number
    ): Promise<ConversationDTO | null>;

    /**
     * Retrieves all conversations for a specific member.
     * 
     * @param memberID - ID of the member
     * @param page - Optional page number for pagination
     * @param limit - Optional limit for pagination
     * @returns A promise resolving to an array of ConversationDTOs
     */
    getConversationForMember(
        memberID: string,
        page?: number,
        limit?: number
    ): Promise<ConversationDTO[]>;

    /**
     * Retrieves messages for a specific conversation.
     * 
     * @param chatID - ID of the conversation
     * @param limit - Number of messages to retrieve
     * @returns A promise resolving to an array of MessageDTOs
     */
    getMessages(chatID: string, limit: number): Promise<MessageDTO[]>;

    /**
     * Retrieves a conversation by its ID.
     * 
     * @param chatID - ID of the conversation
     * @returns A promise resolving to the ConversationDTO or null
     */
    getConversationById(chatID: string): Promise<ConversationDTO | null>;

    /**
     * Deletes a conversation by its ID.
     * 
     * @param chatID - ID of the conversation to delete
     * @returns A promise resolving to the deleted ConversationDTO or null
     */
    deleteConversation(chatID: string): Promise<ConversationDTO | null>;

    /**
     * Updates a member's username and/or avatar URL in all related conversations.
     * 
     * @param userID - ID of the user to update
     * @param avatarURL - Optional new avatar URL
     * @param username - Optional new username
     * @returns A promise resolving to the number of updated conversations
     */
    updateMember(
        userID: string,
        avatarURL?: string | null,
        username?: string | null
    ): Promise<number>;
}
