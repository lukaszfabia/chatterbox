import express from 'express';
import { RabbitMQService } from '../rabbitmq/rabbitmq';
import { UserStatusUpdatedEvent } from '../../domain/events/user-status-updated.event';
import { UserLoggedInEvent } from '../../domain/events/user-logged-out.event';
import { UserStatusUpdatedEventHandler } from '../../application/events/user-status-updated.handler';
import { RedisService } from '../database/redis';
import { UserLoggedInEventHandler } from '../../application/events/user-logged-in.handler';
import { UserLoggedOutEvent } from '../../domain/events/user-logged-in-event';
import { UserLoggedOutEventHandler } from '../../application/events/user-logged-out.handler';
import { Router } from './routes';
import http from 'http';
import { Server } from 'socket.io';
import { WebSocketService } from '../ws/websocket';



export default async function startServer() {
    const app = express();
    const port = process.env.PORT || 8005;


    const repo = new RedisService()
    const rabbitMQService = new RabbitMQService();
    await rabbitMQService.connect();

    rabbitMQService.registerHandler(UserStatusUpdatedEvent.name, new UserStatusUpdatedEventHandler(repo));
    rabbitMQService.registerHandler(UserLoggedInEvent.name, new UserLoggedInEventHandler(repo));
    rabbitMQService.registerHandler(UserLoggedOutEvent.name, new UserLoggedOutEventHandler(repo));

    await Promise.all([
        rabbitMQService.consume<UserStatusUpdatedEvent>(UserStatusUpdatedEvent.name),
        rabbitMQService.consume<UserLoggedInEvent>(UserLoggedInEvent.name),
        rabbitMQService.consume<UserLoggedOutEvent>(UserLoggedOutEvent.name),
    ]);

    const server = http.createServer(app);
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:3000", // change it later
            methods: ["GET", "POST"],
        },
    });


    const websocketService = new WebSocketService(io, rabbitMQService);
    websocketService.init();

    const router = new Router(repo);

    app.use(express.json());

    app.use('/api/v1', router.config());

    app.get('/', (_, res) => {
        res.json({ status: 'ok' });
    });

    server.listen(port, () => {
        console.log(`Server running on port :${port}`);
    });
}