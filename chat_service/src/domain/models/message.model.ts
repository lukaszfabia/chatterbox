import { Document, ObjectId } from "mongodb";

/**
 * Message delivery status
 */
export type Status = "delivered" | "read" | "sent";

/**
 * Interface representing a message sent between users.
 */
export interface IMessage extends Document {
    /** Unique identifier for the message */
    _id?: ObjectId;

    /** ID of the sender */
    senderID: string;

    /** ID of the receiver */
    receiverID: string;

    /** Text content of the message */
    content: string;

    /** Timestamp when the message was sent (in milliseconds) */
    sentAt: number;

    /** ID of the chat this message belongs to */
    chatID: string;

    /** Delivery status of the message */
    status: Status;
}
