import { Document } from "mongodb";
import { IMessage } from "./message.model";

export class User {
    constructor(public userID: string, public username: string, public avatarURL: string) { }
}

export interface IConversation extends Document {
    members: User[];
    lastMessage: IMessage;
}