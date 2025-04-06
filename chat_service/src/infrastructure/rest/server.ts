import http from 'http';
import { Server } from 'socket.io';
import express from 'express';
import { MongoService } from '../database/mongo';
import { RabbitMQService } from '../rabbitmq/rabbitmq';
import { WebSocketService } from '../ws/websocket';
import { jwtMiddleware } from '../jwt/jwt.middleware';
import { CreateMessageCommandHandler } from '../../application/commands/create-message.command.handler';
import { CreateMessageController } from '../../interfaces/create-message.command.controller';
import { CreateChatController } from '../../interfaces/create-new-chat.command.controller';
import { CreateNewChatCommandHandler } from '../../application/commands/create-new-chat.command.handler';
import { GetConversationsController } from '../../interfaces/get-conversations.query.controller';
import { GetConversationsQueryHandler } from '../../application/queries/get-conversations.query.handler';
import { MemberUpdatedInfoEvent } from '../../domain/events/member-updated-info.event';
import cors from 'cors';
import { MessageCreatedEvent } from '../../domain/events/message-sent.event';
import { MemberUpdatedInfoEventHandler } from '../../application/events/member-updated-info.event.handler';
import { MessageCreatedEventHandler } from '../../application/events/message-created.event.handler';
import { GetMessagesController } from '../../interfaces/get-messages.controller';
import { GetMessagesQueryHandler } from '../../application/queries/get-messages.query.handler';


const corsConfig = {
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    credentials: true,
};

export default async function startServer() {
    const app = express();
    const port = process.env.PORT || 8005;


    const repo = new MongoService();
    repo.connect();
    const rabbitMQService = new RabbitMQService();
    await rabbitMQService.connect();


    const server = http.createServer(app);
    const io = new Server(server, {
        cors: corsConfig,
        transports: ["websocket", "polling"],
        connectionStateRecovery: {
            maxDisconnectionDuration: 2 * 60 * 1000,
            skipMiddlewares: true,
        }
    });


    const websocketService = new WebSocketService(io);
    websocketService.init();

    app.use(express.json(), cors(corsConfig));

    rabbitMQService.registerHandler(MemberUpdatedInfoEvent.name, new MemberUpdatedInfoEventHandler(repo))

    rabbitMQService.registerHandler(MessageCreatedEvent.name, new MessageCreatedEventHandler(rabbitMQService, websocketService))

    const createMessageController = new CreateMessageController(new CreateMessageCommandHandler(repo, rabbitMQService));
    const chatController = new CreateChatController(new CreateNewChatCommandHandler(repo))
    const convController = new GetConversationsController(new GetConversationsQueryHandler(repo))
    const getMessagesController = new GetMessagesController(new GetMessagesQueryHandler(repo))

    await Promise.all([
        rabbitMQService.consume<MemberUpdatedInfoEvent>(MemberUpdatedInfoEvent.name),
        rabbitMQService.consume<MessageCreatedEvent>(MessageCreatedEvent.name)
    ]);

    app.use('/api/v1/chat', jwtMiddleware);

    app.post('/api/v1/chat/new/message', createMessageController.createMessage);
    app.post('/api/v1/chat/new/chat', chatController.createChat);
    app.get('/api/v1/chat/conversations', convController.getConversations);
    app.get('/api/v1/chat/:chatID/messages', getMessagesController.getMessages)

    app.get('/', (_, res) => {
        res.json({ status: 'ok' });
    });

    console.log('Registerd routes:', app._router.stack.map((r: any) => r.route?.path).filter(Boolean));


    server.listen(port, () => {
        console.log(`Server running on port :${port}`);
    });
}