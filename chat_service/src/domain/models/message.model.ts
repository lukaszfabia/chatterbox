import { Document } from "mongodb";


export type Status = "delivered" | "read" | "sent"

export interface IMessage extends Document {
    _id?: string;
    senderID: string;
    receiverID: string;
    content: string;
    sentAt: number;
    chatID: string;
    status: Status;
}
