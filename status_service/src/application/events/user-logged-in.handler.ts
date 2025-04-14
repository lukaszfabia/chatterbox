import { UserLoggedInEvent } from "../../domain/events/user-logged-in.event";
import { UserStatus } from "../../domain/models/status";
import { IStatusRepository } from "../../domain/repository/status.repository";
import { EventHandler } from "./event.handler";

/**
 * Event handler that processes `UserLoggedInEvent` events.
 * It updates the user's status in the repository to `true` when they log in.
 */
export class UserLoggedInEventHandler implements EventHandler<UserLoggedInEvent> {
    constructor(
        private readonly repo: IStatusRepository
    ) { }

    /**
     * Handles the UserLoggedInEvent.
     * 
     * @param event - The `UserLoggedInEvent` to handle. This contains the user ID of the logged-in user.
     * @returns A promise that resolves when the user's status is updated in the repository.
     * 
     * This method updates the status of the user to `true` in the repository, indicating they are logged in.
     */
    async handle(event: UserLoggedInEvent): Promise<void> {
        console.log('[x] Handling', UserLoggedInEvent.name);
        await this.repo.setUserStatus(new UserStatus(event.userID, true));
    }
}
