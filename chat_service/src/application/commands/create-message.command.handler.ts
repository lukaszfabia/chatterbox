import { CreateMessageCommand } from "../../domain/command/create-message.command";
import { MessageDTO } from "../../domain/dto/message.dto";
import { MessageCreatedEvent } from "../../domain/events/message-sent.event";
import { IChatRepository } from "../../domain/repository/chat.repository";
import { EventBus } from "../../infrastructure/rabbitmq/bus";
import { CommandHanlder } from "./command.handler";

export class CreateMessageCommandHandler implements CommandHanlder<CreateMessageCommand> {

    constructor(
        private readonly repo: IChatRepository,
        private readonly rabbitmq: EventBus,
    ) { }


    async execute(c: CreateMessageCommand): Promise<MessageDTO | null> {
        const chat = await this.repo.appendMessage(
            c.receiverID,
            c.senderID,
            c.content,
            c.chatID,
            c.sentAt
        )

        if (!chat) {
            console.log('Chat not found')
            return null
        }

        if (!chat.members.some(m => m.userID === c.senderID)) {
            console.log('Unauthorized')
            return null;
        }

        await this.rabbitmq.publish(MessageCreatedEvent.name, new MessageCreatedEvent(chat))

        return chat.lastMessage!
    }
}