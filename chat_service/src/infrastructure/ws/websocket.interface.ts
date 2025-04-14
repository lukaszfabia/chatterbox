import { Socket } from 'socket.io';
import { MessageDTO } from "../../domain/dto/message.dto";


/**
 * IWebSocketService defines the contract for real-time WebSocket communication.
 * It handles connecting/disconnecting clients, message delivery,
 * room management, and user status.
 */
export interface IWebSocketService {
    /**
     * Sends a message to a user if they are online.
     * @param message The message object containing sender and receiver info
     * @returns Promise resolving to `true` if the message was sent, otherwise `false`
     */
    send(message: MessageDTO): Promise<boolean>;

    /**
     * Registers a user's socket connection.
     * @param client The socket connection
     * @param userID The unique user identifier
     */
    connect(client: Socket, userID: string): Promise<void>;

    /**
     * Disconnects a user and removes their socket reference.
     * @param userID The unique user identifier
     */
    disconnect(userID: string): Promise<void>;

    /**
     * Handles incoming message delivery logic.
     * @param client The sender's socket
     * @param message The message object to be processed
     */
    handleIncomingMessage(client: Socket, message: MessageDTO): Promise<void>;

    /**
     * Checks if a user is currently online (connected via socket).
     * @param userID The unique user identifier
     * @returns Promise resolving to `true` if user is online, otherwise `false`
     */
    isonline(userID: string): Promise<boolean>;

    /**
     * Adds a user to a specific chat room.
     * @param client The user's socket connection
     * @param chatID The chat room identifier
     * @param userID The user's identifier
     */
    join(client: Socket, chatID: string, userID: string): Promise<void>;

    /**
     * Removes a user from a specific chat room.
     * @param client The user's socket connection
     * @param chatID The chat room identifier
     * @param userID The user's identifier
     */
    leave(client: Socket, chatID: string, userID: string): Promise<void>;
}
