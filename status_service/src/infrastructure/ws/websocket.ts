import { Server, Socket } from "socket.io";
import { UserStatusUpdatedEvent } from "../../domain/events/user-status-updated.event";
import { RabbitMQService } from "../rabbitmq/rabbitmq";
import { IWebSocketService } from "./websocket.interface";

type ClientData = {
    socket: Socket;
    lastPing: number;
};

export class WebSocketService implements IWebSocketService {
    private clients: Map<string, ClientData> = new Map();

    constructor(private server: Server, private rabbitmq: RabbitMQService) { }

    init() {
        this.server.on("connection", (client: Socket) => {
            console.log(`User connected: ${client.id}`);

            client.on("register", async (userID: string) => {
                this.clients.set(userID, {
                    socket: client,
                    lastPing: Date.now(),
                });
                console.log(`User ${userID} registered`);
                const qname = UserStatusUpdatedEvent.name;
                const event = new UserStatusUpdatedEvent(userID!, true);
                await this.rabbitmq.publish(qname, event);
            });

            client.on("ping", (data: { userID: string }) => this.ping(client, data));

            client.on("updateStatus", async (data: { userID: string; isOnline: boolean }) => {
                await this.updateStatus(client, data);
            });

            client.on("disconnect", async () => {
                console.log(`User disconnected: ${client.id}`);

                let disconnectedUserID: string | null = null;

                this.clients.forEach((value, key) => {
                    if (value.socket === client) {
                        disconnectedUserID = key;
                        this.clients.delete(key);
                    }
                });

                if (disconnectedUserID) {
                    if (!this.clients.has(disconnectedUserID!)) {
                        const qname = UserStatusUpdatedEvent.name;
                        const event = new UserStatusUpdatedEvent(disconnectedUserID!, false);
                        await this.rabbitmq.publish(qname, event);
                    }
                }
            });
        });

        this.startStatusWatcher();
    }

    private startStatusWatcher() {
        setInterval(async () => {
            const now = Date.now();
            for (const [userID, clientData] of this.clients.entries()) {
                if (now - clientData.lastPing > 30_000) {
                    console.log(`User ${userID} timed out due to inactivity`);

                    const qname = UserStatusUpdatedEvent.name;
                    const event = new UserStatusUpdatedEvent(userID, false);
                    await this.rabbitmq.publish(qname, event);

                    clientData.socket.disconnect();
                    this.clients.delete(userID);
                }
            }
        }, 30_000);
    }

    async ping(client: Socket, data: { userID: string }) {
        try {
            const user = this.clients.get(data.userID);
            if (user) {
                user.lastPing = Date.now();
            }

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
        const clientData = this.clients.get(userID);
        if (clientData) {
            const qname = UserStatusUpdatedEvent.name;
            const event = new UserStatusUpdatedEvent(userID, false);
            await this.rabbitmq.publish(qname, event);
            clientData.socket.disconnect();
            this.clients.delete(userID);

            console.log(`User ${userID} forcefully disconnected`);
        }
    }
}
