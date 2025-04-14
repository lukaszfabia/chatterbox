import { UserStatus } from "../models/status";

/**
 * Interface for the repository responsible for managing user statuses.
 * 
 * The repository handles operations for setting, getting, and querying user status data.
 */
export interface IStatusRepository {
    /**
     * Sets the status of a user.
     * 
     * @param user - The UserStatus object representing the user's current status.
     */
    setUserStatus(user: UserStatus): Promise<boolean>;

    /**
     * Retrieves the status of a specific user.
     * 
     * @param userID - The unique identifier of the user whose status is being retrieved.
     * @returns A Promise resolving to the UserStatus of the user or null if no status is found.
     */
    getUserStatus(userID: string): Promise<UserStatus | null>;

    /**
     * Retrieves all online users' statuses.
     * 
     * @returns A Promise resolving to an array of UserStatus objects for all online users.
     */
    getOnlineUsers(): Promise<UserStatus[]>;
}
