import { GotNewMessageEvent } from "../../domain/events/got-new-message.event";
import { MessageCreatedEvent } from "../../domain/events/message-created.event";
import { EventBus } from "../../infrastructure/rabbitmq/bus";
import { IWebSocketService } from "../../infrastructure/ws/websocket.interface";
import { EventHandler } from "./event.handler";

// EventHandler for processing the MessageCreatedEvent
export class MessageCreatedEventHandler implements EventHandler<MessageCreatedEvent> {
    constructor(
        private readonly rabbitmq: EventBus,
        private readonly ws: IWebSocketService
    ) { }

    /**
     * Handles the event of a newly created message.
     * 
     * @param event The event that contains the message information to process.
     * @returns A Promise that resolves once the message is either sent via WebSocket or published to RabbitMQ.
     */
    async handle(event: MessageCreatedEvent): Promise<void> {
        const { lastMessage } = event.message;

        if (!lastMessage) {
            console.warn('No message in chat, skipping event.');
            return;
        }

        const receiverID = lastMessage.receiverID;

        const isOnline = await this.ws.isonline(receiverID);

        if (isOnline) {
            console.log('User is online, sending by ws');
            await this.ws.send(lastMessage);
        } else {
            console.log('event', event);
            const sender = event.message.members.find(m => m.userID !== receiverID);
            const username = sender?.username ?? 'anon';

            const nofi = new GotNewMessageEvent(receiverID, username, lastMessage.content);
            console.log('Creating ', GotNewMessageEvent.name, nofi);

            await this.rabbitmq.publish(GotNewMessageEvent.name, nofi);
        }
    }
}
