import { UserStatus } from "../models/status";

export interface IStatusRepository {
    setUserStatus(user: UserStatus): Promise<void>;
    getUserStatus(userID: string): Promise<UserStatus | null>;
    getOnlineUsers(): Promise<UserStatus[]>;
}