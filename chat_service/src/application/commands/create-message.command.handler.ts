import { CreateMessageCommand } from "../../domain/command/create-message.command";
import { MessageDTO } from "../../domain/dto/message.dto";
import { GotNewMessageEvent } from "../../domain/events/got-new-message.event";
import { IChatRepository } from "../../domain/repository/chat.repository";
import { RabbitMQService } from "../../infrastructure/rabbitmq/rabbitmq";
import { IWebSocketService } from "../../infrastructure/ws/websocket.interface";
import { CommandHanlder } from "./command.handler";

export class CreateMessageCommandHandler implements CommandHanlder<CreateMessageCommand> {

    constructor(
        private readonly repo: IChatRepository,
        private readonly rabbitmq: RabbitMQService,
        private readonly ws: IWebSocketService
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
            return null
        }

        if (await this.ws.isonline(c.receiverID)) {
            await this.ws.send(chat.lastMessage!)
        } else {
            const username = chat.members.find((e) => e.userID === c.receiverID)?.username || 'anon';


            const nofi = new GotNewMessageEvent(c.receiverID, username, c.content)

            await this.rabbitmq.publish(GotNewMessageEvent.name, nofi)
        }


        return chat.lastMessage!
    }
}