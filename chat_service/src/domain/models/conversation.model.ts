import { Document, ObjectId } from "mongodb";
import { IMessage } from "./message.model";

/**
 * Represents a user in the conversation.
 */
export class User {
    /**
     * @param userID - Unique identifier for the user
     * @param username - Username of the user
     * @param avatarURL - URL to the user's avatar image
     */
    constructor(
        public userID: string,
        public username: string,
        public avatarURL: string
    ) { }
}

/**
 * Interface representing a conversation between users.
 */
export interface IConversation extends Document {
    /** Unique identifier for the conversation */
    _id?: ObjectId;

    /** Array of users participating in the conversation */
    members: User[];

    /** Last message sent in the conversation */
    lastMessage?: IMessage;

    /** Timestamp of the last update to the conversation */
    updatedAt: Date;
}
