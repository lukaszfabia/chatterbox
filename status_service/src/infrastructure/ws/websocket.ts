import { Server, Socket } from "socket.io";
import { UpdateStatusCommand } from "../../domain/command/update-status.command";
import { CommandHandler } from "../../application/commands/command.handler";

type ClientData = {
    socket: Socket;  // The WebSocket connection for the client.
    lastPing: number;  // The timestamp (in milliseconds) of the client's last ping.
};


/**
 * WebSocketService manages WebSocket connections, user registrations, status updates, and disconnections.
 * It also monitors user activity and ensures that inactive users are logged out after a timeout period.
 */
export class WebSocketService {
    private clients: Map<string, ClientData> = new Map();

    constructor(
        private readonly server: Server,  // The Socket.IO server
        private readonly handler: CommandHandler<UpdateStatusCommand>  // Command handler for updating user status
    ) { }

    /**
     * Initializes the WebSocket service, handling connection, registration, pings, status updates, and disconnections.
     */
    init() {
        this.server.on("connection", (client: Socket) => {
            console.log(`User connected: ${client.id}`);

            client.on("register", async (userID: string) => {
                this.registerUser(client, userID);
            });

            client.on("ping", (data: { userID: string }) => this.handlePing(client, data));

            client.on("updateStatus", async (data: { userID: string; isOnline: boolean }) => {
                await this.handleStatusUpdate(client, data);
            });

            client.on("disconnect", async () => {
                await this.handleDisconnect(client);
            });
        });

        this.startStatusWatcher();
    }

    /**
     * Registers a user by associating their user ID with a WebSocket client.
     * The user's status is set to online upon registration.
     * 
     * @param client - The WebSocket client representing the user.
     * @param userID - The ID of the user.
     */
    private async registerUser(client: Socket, userID: string) {

        const existing = this.clients.get(userID);
        if (existing) {
            existing.socket.disconnect();
        }


        this.clients.set(userID, {
            socket: client,
            lastPing: Date.now(),
        });
        console.log(`User ${userID} registered`);

        const command = new UpdateStatusCommand(userID, true);
        await this.handler.execute(command);
    }

    /**
     * Starts a status watcher that checks for user inactivity every 30 seconds.
     * Users who have been inactive for more than 30 seconds will be logged out and their status will be updated to offline.
     */
    private startStatusWatcher() {
        setInterval(async () => {
            const now = Date.now();
            for (const [userID, clientData] of this.clients.entries()) {
                if (now - clientData.lastPing > 30_000) {
                    console.log(`User ${userID} timed out due to inactivity`);

                    const command = new UpdateStatusCommand(userID, false);
                    await this.handler.execute(command);

                    clientData.socket.disconnect();
                    this.clients.delete(userID);
                }
            }
        }, 30_000);
    }

    /**
     * Handles incoming ping events from clients, updating the user's last activity time.
     * The server responds with a "pong" message if the ping was successfully processed.
     * 
     * @param client - The WebSocket client sending the ping.
     * @param data - The data associated with the ping event, including the user ID.
     */
    private async handlePing(client: Socket, data: { userID: string }) {
        try {
            const user = this.clients.get(data.userID);
            if (user) {
                user.lastPing = Date.now();
            }

            const command = new UpdateStatusCommand(data.userID, true);
            const success = await this.handler.execute(command);

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

    /**
     * Handles incoming status update events from clients.
     * The user's status (online or offline) is updated accordingly.
     * 
     * @param client - The WebSocket client sending the status update.
     * @param data - The data associated with the status update event, including the user ID and status.
     */
    private async handleStatusUpdate(client: Socket, data: { userID: string; isOnline: boolean }) {
        try {
            const command = new UpdateStatusCommand(data.userID, data.isOnline);
            const success = await this.handler.execute(command);

            if (!success) {
                console.error("Failed to publish updateStatus event");
                client.emit("error", { message: "Failed to publish event" });
            }
        } catch (error) {
            console.error(`Error handling status update: ${error.message}`);
            client.emit("error", { message: "Error handling status update" });
        }
    }

    /**
     * Handles user disconnection, updating the user's status to offline and removing them from the active clients list.
     * 
     * @param client - The WebSocket client that has disconnected.
     */
    private async handleDisconnect(client: Socket) {
        console.log(`User disconnected: ${client.id}`);

        let disconnectedUserID: string | null = null;

        this.clients.forEach((value, key) => {
            if (value.socket === client) {
                disconnectedUserID = key;
                this.clients.delete(key);
            }
        });

        if (disconnectedUserID) {
            const command = new UpdateStatusCommand(disconnectedUserID, false);
            await this.handler.execute(command);
        }
    }

    /**
     * Forcefully disconnects a user and updates their status to offline.
     * 
     * @param userID - The ID of the user to be disconnected.
     */
    async disconnect(userID: string) {
        const clientData = this.clients.get(userID);
        if (clientData) {
            const command = new UpdateStatusCommand(userID, false);
            await this.handler.execute(command);
            clientData.socket.disconnect();
            this.clients.delete(userID);

            console.log(`User ${userID} forcefully disconnected`);
        }
    }
}
