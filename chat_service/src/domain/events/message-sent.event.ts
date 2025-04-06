import { Event } from "./event";
import { ConversationDTO } from "../dto/conversation.dto";

export class MessageCreatedEvent implements Event {
    constructor(public readonly message: ConversationDTO) { }
}