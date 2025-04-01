import { Server, Socket } from "socket.io";
import { UserStatusUpdatedEvent } from "../../domain/events/user-status-updated.event";
import { RabbitMQService } from "../rabbitmq/rabbitmq";
import { IWebSocketService } from "./websocket.interface";

export class WebSocketService implements IWebSocketService {
    private clients: Map<string, Socket> = new Map();

    constructor(private server: Server, private rabbitmq: RabbitMQService) { }

    init() {
        this.server.on("connection", (client: Socket) => {
            console.log(`User connected: ${client.id}`);

            client.on("register", (userID: string) => {
                this.clients.set(userID, client);
                console.log(`User ${userID} registered`);
            });

            client.on("ping", (data: { userID: string }) => this.ping(client, data));

            client.on("updateStatus", async (data: { userID: string; isOnline: boolean }) => {
                await this.updateStatus(client, data);
            });

            client.on("disconnect", () => {
                console.log(`User disconnected: ${client.id}`);
                this.clients.forEach((value, key) => {
                    if (value === client) this.clients.delete(key);
                });
            });
        });
    }

    async ping(client: Socket, data: { userID: string }) {
        try {
            const qname = UserStatusUpdatedEvent.name;
            const event = new UserStatusUpdatedEvent(data.userID, true);
            const success = await this.rabbitmq.publish(qname, event);

            if (success) {
                client.emit("pong", { message: "Pong!", userID: data.userID });
            } else {
                console.error("Failed to publish ping event");
                client.emit("error", { message: "Failed to publish event" });
            }
        } catch (error) {
            console.error(`Error handling ping: ${error.message}`);
            client.emit("error", { message: "Error handling ping" });
        }
    }

    async updateStatus(client: Socket, data: { userID: string; isOnline: boolean }) {
        try {
            const qname = UserStatusUpdatedEvent.name;
            const event = new UserStatusUpdatedEvent(data.userID, data.isOnline);
            const success = await this.rabbitmq.publish(qname, event);

            if (!success) {
                console.error("Failed to publish updateStatus event");
                client.emit("error", { message: "Failed to publish event" });
            }
        } catch (error) {
            console.error(`Error handling status update: ${error.message}`);
            client.emit("error", { message: "Error handling status update" });
        }
    }

    async disconnect(userID: string) {
        const client = this.clients.get(userID);
        if (client) {
            const qname = UserStatusUpdatedEvent.name;
            const event = new UserStatusUpdatedEvent(userID, false);
            await this.rabbitmq.publish(qname, event);
            client.disconnect();
            this.clients.delete(userID);

            console.log(`User ${userID} forcefully disconnected`);
        }
    }
}
