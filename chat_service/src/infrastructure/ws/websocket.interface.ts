import { Server, Socket } from 'socket.io';
import { MessageDTO } from "../../domain/dto/message.dto";

export interface IWebSocketService {
    send(message: MessageDTO): Promise<boolean>;
    connect(client: Socket, userID: string): Promise<void>;
    disconnect(userID: string): Promise<void>;
    handleIncomingMessage(client: Socket, message: MessageDTO): Promise<void>;
    isonline(userID: string): Promise<boolean>;
    join(client: Socket, chatID: string): Promise<void>;
    leave(client: Socket, chatID: string): Promise<void>;
}