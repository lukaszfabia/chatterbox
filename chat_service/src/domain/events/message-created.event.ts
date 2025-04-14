import { Event } from "./event";
import { ConversationDTO } from "../dto/conversation.dto";

// Event triggered when a new message is created
export class MessageCreatedEvent implements Event {
    constructor(
        public readonly message: ConversationDTO // The newly created message (as a ConversationDTO)
    ) { }
}
