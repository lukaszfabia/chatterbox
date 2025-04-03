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


export default async function startServer() {
    const app = express();
    const port = process.env.PORT || 8005;


    const repo = new MongoService();
    repo.connect();
    const rabbitMQService = new RabbitMQService();
    await rabbitMQService.connect();


    // await Promise.all([
    //     rabbitMQService.consume<UserStatusUpdatedEvent>(UserStatusUpdatedEvent.name),
    //     rabbitMQService.consume<UserLoggedInEvent>(UserLoggedInEvent.name),
    //     rabbitMQService.consume<UserLoggedOutEvent>(UserLoggedOutEvent.name),
    // ]);

    const server = http.createServer(app);
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:3000", // change it later
            methods: ["GET", "POST"],
        },
    });


    const websocketService = new WebSocketService(io, rabbitMQService);
    websocketService.init();

    app.use(express.json());

    const messageController = new CreateMessageController(new CreateMessageCommandHandler(repo, rabbitMQService, websocketService));
    const chatController = new CreateChatController(new CreateNewChatCommandHandler(repo))
    const convController = new GetConversationsController(new GetConversationsQueryHandler(repo))

    app.use('/api/v1/chat', jwtMiddleware);

    app.post('/api/v1/chat/new/message', messageController.createMessage);
    app.post('/api/v1/chat/new/chat', chatController.createChat);
    app.get('/api/v1/chat/conversations', convController.getConversations);

    app.get('/', (_, res) => {
        res.json({ status: 'ok' });
    });

    console.log('Registerd routes:', app._router.stack.map((r: any) => r.route?.path).filter(Boolean));


    server.listen(port, () => {
        console.log(`Server running on port :${port}`);
    });
}