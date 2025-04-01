import { IChatRepository } from "../../domain/repository/chat.repository";
import { IWebSocketService } from "../ws/websocket.interface";
import { RabbitMQService } from "../rabbitmq/rabbitmq";
import { CreateMessageCommandHandler } from "../../application/commands/create-message.command.handler";
import { CreateMessageController } from "../../interfaces/create-message.command.controller";
import { GetConversationsQueryHandler } from "../../application/queries/get-conversations.query.handler";
import { GetConversationsController } from "../../interfaces/get-conversations.query.controller";
import { CreateNewChatCommandHandler } from "../../application/commands/create-new-chat.command.handler";
import { CreateChatController } from "../../interfaces/create-new-chat.command.controller";


export class Router {
    constructor(
        private readonly repo: IChatRepository,
        private readonly rabbitmq: RabbitMQService,
        private readonly ws: IWebSocketService,

    ) { }

    createMessage() {
        const handler = new CreateMessageCommandHandler(this.repo, this.rabbitmq, this.ws);
        const ctr = new CreateMessageController(handler);

        return ctr.getRoutes()
    }

    getConverations() {
        const handler = new GetConversationsQueryHandler(this.repo);
        const ctr = new GetConversationsController(handler);

        return ctr.getRoutes()
    }

    createChat() {
        const handler = new CreateNewChatCommandHandler(this.repo);
        const ctr = new CreateChatController(handler);

        return ctr.getRoutes()
    }


}