import { Server, Socket } from 'socket.io';
import { UserStatusUpdatedEvent } from '../../domain/events/user-status-updated.event';
import { RabbitMQService } from '../rabbitmq/rabbitmq';


export class WebSocketService {
    constructor(private server: Server, private rabbitmq: RabbitMQService) { }

    init() {
        this.server.on('connection', (client: Socket) => {
            console.log(`User connected: ${client.id}`);
            const qname = UserStatusUpdatedEvent.name;

            client.on('ping', async (data: { userId: string }) => {
                try {
                    const event = new UserStatusUpdatedEvent(data.userId, true);
                    const success = await this.rabbitmq.publish(qname, event);

                    if (success) {
                        client.emit('pong', { message: 'Pong!', userId: data.userId });
                    } else {
                        console.error('Failed to publish ping event');
                        client.emit('error', { message: 'Failed to publish event' });
                    }
                } catch (error) {
                    console.error(`Error handling ping: ${error.message}`);
                    client.emit('error', { message: 'Error handling ping' });
                }
            });

            client.on('updateStatus', async (data: { userId: string, isOnline: boolean }) => {
                try {
                    const event = new UserStatusUpdatedEvent(data.userId, data.isOnline);
                    const success = await this.rabbitmq.publish(qname, event);

                    if (!success) {
                        console.error('Failed to publish updateStatus event');
                        client.emit('error', { message: 'Failed to publish event' });
                    }
                } catch (error) {
                    console.error(`Error handling status update: ${error.message}`);
                    client.emit('error', { message: 'Error handling status update' });
                }
            });

            client.on('disconnect', () => {
                console.log(`User disconnected: ${client.id}`);
            });
        });
    }
}
