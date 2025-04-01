import { Socket } from "socket.io";

export interface IWebSocketService {
    updateStatus(client: Socket, data: { userID: string; isOnline: boolean }): Promise<void>
    disconnect(userID: string): void
    ping(client: Socket, data: { userID: string }): Promise<void>
}