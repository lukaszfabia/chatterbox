import { Command } from "./command";

/**
 * Represents a command to update the status of a user (e.g., online or offline).
 * This command carries the user ID and their new online status, which is typically
 * executed by a handler to update the state in a repository or database.
 */
export class UpdateStatusCommand implements Command {
    /**
     * Creates an instance of the UpdateStatusCommand.
     * 
     * @param userID - The unique identifier of the user whose status is being updated.
     * @param isOnline - The new status of the user: true if online, false if offline.
     */
    constructor(
        public readonly userID: string,
        public readonly isOnline: boolean,
    ) { }
}