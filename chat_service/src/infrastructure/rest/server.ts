import http from 'http';
import { Server } from 'socket.io';
import express from 'express';
import { MongoService } from '../database/mongo';
import { RabbitMQService } from '../rabbitmq/rabbitmq';
import { WebSocketService } from '../ws/websocket';
import { Router } from './routes';
import { jwtMiddleware } from '../jwt/jwt.middleware';


export default async function startServer() {
    const app = express();
    const port = process.env.PORT || 8005;


    const repo = new MongoService()
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

    const router = new Router(repo, rabbitMQService, websocketService);

    app.use(express.json());

    app.use('/api/v1', jwtMiddleware);

    app.use('/new/message', router.createMessage())
    app.use('/new/chat', router.createChat())
    app.use('/conversations', router.getConverations())

    app.get('/', (_, res) => {
        res.json({ status: 'ok' });
    });

    server.listen(port, () => {
        console.log(`Server running on port :${port}`);
    });
}