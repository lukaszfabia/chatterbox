import { Document, ObjectId } from "mongodb";


export type Status = "delivered" | "read" | "sent"

export interface IMessage extends Document {
    _id?: ObjectId;
    senderID: string;
    receiverID: string;
    content: string;
    sentAt: number;
    chatID: string;
    status: Status;
}
