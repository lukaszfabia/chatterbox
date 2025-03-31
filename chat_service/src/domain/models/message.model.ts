import { Document } from "mongodb";
export interface IMessage extends Document {
    senderID: string;
    content: string;
    sentAt: number;
    chatID: string;
}
