import { Server, Socket } from 'socket.io';
import { IWebSocketService } from './websocket.interface';
import { MessageDTO } from '../../domain/dto/message.dto';
import { RabbitMQService } from '../rabbitmq/rabbitmq';

export class WebSocketService implements IWebSocketService {
    private clients: Map<string, Socket> = new Map();

    constructor(private server: Server, private rabbitmq: RabbitMQService) { }


    init() {
        this.server.on('connection', (client: Socket) => {
            console.log(`User connected: ${client.id}`);

            client.on('register', (userID: string) => {
                this.clients.set(userID, client);
                console.log(`User ${userID} registered with socket ID ${client.id}`);
            });

            client.on('disconnect', () => {
                console.log(`User disconnected: ${client.id}`);
                this.clients.forEach((socket, userID) => {
                    if (socket.id === client.id) {
                        this.clients.delete(userID);
                    }
                });
            });
        });
    }

    async send(message: MessageDTO): Promise<boolean> {
        const receiverSocket = this.clients.get(message.receiverID);
        if (receiverSocket) {
            receiverSocket.emit('newMessage', message);
            return true;
        }
        console.log(`User ${message.receiverID} is offline, sending push notification.`);
        return false;
    }

    async isonline(userID: string): Promise<boolean> {
        return this.clients.has(userID);
    }

    async connect(client: Socket, userID: string): Promise<void> {
        this.clients.set(userID, client)
    }

    async disconnect(userID: string): Promise<void> {
        this.clients.delete(userID);
    }

    async handleIncomingMessage(client: Socket, message: MessageDTO): Promise<void> {
        const receiverSocket = this.clients.get(message.receiverID);
        if (receiverSocket) {
            receiverSocket.emit('newMessage', message);
        } else {
            console.log('User is offline, sending push notification');
        }
    }

    async join(client: Socket, chatID: string): Promise<void> {
        client.join(chatID);
        console.log(`${client.id} joined chat ${chatID}`);
    }

    async leave(client: Socket, chatID: string): Promise<void> {
        client.leave(chatID);
        console.log(`${client.id} left chat ${chatID}`);
    }

}