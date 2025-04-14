import { Server, Socket } from 'socket.io';
import { IWebSocketService } from './websocket.interface';
import { MessageDTO } from '../../domain/dto/message.dto';

/**
 * WebSocketService handles real-time WebSocket communication
 * between users using Socket.IO. It manages connected clients,
 * chat rooms, and events like message delivery and typing indicators.
 */
export class WebSocketService implements IWebSocketService {
    /** Maps user IDs to their active socket connections. */
    private clients: Map<string, Socket> = new Map();

    /** Maps chat IDs to sets of user IDs currently in the chat room. */
    private rooms: Map<string, Set<string>> = new Map();

    /**
     * @param server The Socket.IO server instance
     */
    constructor(private server: Server) { }

    /**
     * Initializes WebSocket event listeners for client connections,
     * registration, disconnection, typing notifications,
     * and joining/leaving rooms.
     */
    init() {
        this.server.on('connection', (client: Socket) => {
            console.log(`User connected: ${client.id}`);

            /**
             * Registers a client with a user ID.
             */
            client.on('register', (userID: string) => {
                this.clients.set(userID, client);
                console.log(`User ${userID} registered with socket ID ${client.id}`);
            });

            /**
             * Cleans up on disconnection by removing the client from the map.
             */
            client.on('disconnect', () => {
                console.log(`User disconnected: ${client.id}`);
                this.clients.forEach((socket, userID) => {
                    if (socket.id === client.id) {
                        this.clients.delete(userID);
                    }
                });
            });

            /**
             * Notifies other users in the same chat that a user is typing.
             */
            client.on('typing', ({ chatID, userID, username }: { chatID: string, userID: string, username: string }) => {
                if (!chatID || !username) {
                    console.warn('Invalid typing payload:', { chatID, username });
                    return;
                }

                console.log(`Typing: ${username} in chat ${chatID}`);

                const usersInRoom = this.rooms.get(chatID);

                if (usersInRoom) {
                    usersInRoom.forEach((user) => {
                        const userSocket = this.clients.get(user);
                        if (userSocket) {
                            userSocket.emit('typing', { username });
                        }
                    });
                }
            });

            /**
             * Adds a user to a chat room.
             */
            client.on('joinRoom', (chatID: string, userID: string) => {
                this.join(client, chatID, userID);
            });

            /**
             * Removes a user from a chat room.
             */
            client.on('leaveRoom', (chatID: string, userID: string) => {
                this.leave(client, chatID, userID);
            });
        });
    }

    /**
     * Sends a message to a user if they are online.
     * @param message The message to send
     * @returns `true` if message was sent; `false` if the user is offline
     */
    async send(message: MessageDTO): Promise<boolean> {
        const receiverSocket = this.clients.get(message.receiverID);
        if (receiverSocket) {
            receiverSocket.emit('newMessage', message);
            return true;
        }
        console.log(`User ${message.receiverID} is offline, sending push notification.`);
        return false;
    }

    /**
     * Checks whether a user is currently online.
     * @param userID The user's ID
     * @returns `true` if user is online; otherwise `false`
     */
    async isonline(userID: string): Promise<boolean> {
        return this.clients.has(userID);
    }

    /**
     * Associates a user ID with a socket connection.
     * @param client The socket connection
     * @param userID The user's ID
     */
    async connect(client: Socket, userID: string): Promise<void> {
        this.clients.set(userID, client);
    }

    /**
     * Disconnects a user and removes them from the client map.
     * @param userID The user's ID
     */
    async disconnect(userID: string): Promise<void> {
        this.clients.delete(userID);
    }

    /**
     * Handles message delivery to a recipient.
     * @param client The sender's socket
     * @param message The message to deliver
     */
    async handleIncomingMessage(client: Socket, message: MessageDTO): Promise<void> {
        const receiverSocket = this.clients.get(message.receiverID);
        if (receiverSocket) {
            receiverSocket.emit('newMessage', message);
        } else {
            console.log('User is offline, sending push notification');
        }
    }

    /**
     * Adds a user to a chat room and updates the room mapping.
     * @param client The user's socket
     * @param chatID The chat room ID
     * @param userID The user's ID
     */
    async join(client: Socket, chatID: string, userID: string): Promise<void> {
        client.join(chatID);
        console.log(`${client.id} joined chat ${chatID}`);

        if (!this.rooms.has(chatID)) {
            this.rooms.set(chatID, new Set());
        }
        this.rooms.get(chatID)?.add(userID);
    }

    /**
     * Removes a user from a chat room.
     * @param client The user's socket
     * @param chatID The chat room ID
     * @param userID The user's ID
     */
    async leave(client: Socket, chatID: string, userID: string): Promise<void> {
        client.leave(chatID);
        console.log(`${client.id} left chat ${chatID}`);

        this.rooms.get(chatID)?.delete(userID);
    }
}
