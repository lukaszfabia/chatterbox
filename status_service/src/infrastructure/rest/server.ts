import express from 'express';
import { RabbitMQService } from '../rabbitmq/rabbitmq';
import { UserStatusUpdatedEvent } from '../../domain/events/user-status-updated.event';
import { UserLoggedInEvent } from '../../domain/events/user-logged-out.event';
import { UserStatusUpdatedEventHandler } from '../../application/events/user-status-updated.handler';
import { RedisService } from '../database/redis';
import { UserLoggedInEventHandler } from '../../application/events/user-logged-in.handler';
import { UserLoggedOutEvent } from '../../domain/events/user-logged-in.event';
import { UserLoggedOutEventHandler } from '../../application/events/user-logged-out.handler';
import { Router } from './routes';
import http from 'http';
import { Server } from 'socket.io';
import { WebSocketService } from '../ws/websocket';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '../../../docs/swagger';
import { hostname } from 'os';

const corsConfig = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
};

export default async function startServer() {
    const app = express();
    const port = process.env.PORT || 8004;


    const repo = new RedisService()

    const rabbitMQService = new RabbitMQService();
    await rabbitMQService.connect()

    rabbitMQService.registerHandler<UserStatusUpdatedEvent>(UserStatusUpdatedEvent.name, new UserStatusUpdatedEventHandler(repo));
    rabbitMQService.registerHandler<UserLoggedInEvent>(UserLoggedInEvent.name, new UserLoggedInEventHandler(repo));
    rabbitMQService.registerHandler<UserLoggedOutEvent>(UserLoggedOutEvent.name, new UserLoggedOutEventHandler(repo));

    await Promise.all([
        rabbitMQService.consume<UserStatusUpdatedEvent>(UserStatusUpdatedEvent.name),
        rabbitMQService.consume<UserLoggedInEvent>(UserLoggedInEvent.name),
        rabbitMQService.consume<UserLoggedOutEvent>(UserLoggedOutEvent.name),
    ]);

    const server = http.createServer(app);
    const io = new Server(server, {
        cors: corsConfig
    });


    const websocketService = new WebSocketService(io, rabbitMQService);
    websocketService.init();

    const router = new Router(repo);

    app.use(express.json(), cors(corsConfig));

    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

    app.use('/api/v1/status', router.config());

    server.listen(port, () => {
        console.log(`Server running on port :${port}`);
    });
}