import { UserLoggedOutEvent } from "../../domain/events/user-logged-out.event";
import { UserStatus } from "../../domain/models/status";
import { IStatusRepository } from "../../domain/repository/status.repository";
import { EventHandler } from "./event.handler";

/**
 * UserLoggedOutEventHandler is responsible for handling the UserLoggedOutEvent.
 * When a user logs out, this handler updates the user's status to offline.
 */
export class UserLoggedOutEventHandler implements EventHandler<UserLoggedOutEvent> {
    /**
     * Constructs a new UserLoggedOutEventHandler with the given status repository.
     * 
     * @param repo - The status repository used to update the user's status.
     */
    constructor(
        private readonly repo: IStatusRepository
    ) { }

    /**
     * Handles the UserLoggedOutEvent by updating the user's status to offline.
     * 
     * @param event - The event to handle, which contains the user ID of the logged-out user.
     */
    async handle(event: UserLoggedOutEvent): Promise<void> {
        console.log('[x] Handling ', UserLoggedOutEvent.name);

        const userStatus = new UserStatus(event.userID, false);

        await this.repo.setUserStatus(userStatus);
    }
}
