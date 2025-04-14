import { UserStatusUpdatedEvent } from '../../domain/events/user-status-updated.event';
import { UserStatus } from '../../domain/models/status';
import { IStatusRepository } from '../../domain/repository/status.repository';
import { EventHandler } from './event.handler';

/**
 * UserStatusUpdatedEventHandler handles the UserStatusUpdatedEvent.
 * It updates the status of a user when their status (online/offline) changes.
 */
export class UserStatusUpdatedEventHandler implements EventHandler<UserStatusUpdatedEvent> {
    /**
     * Constructs a new UserStatusUpdatedEventHandler with the given status repository.
     * 
     * @param repo - The status repository used to update the user's status.
     */
    constructor(
        private readonly repo: IStatusRepository
    ) { }

    /**
     * Handles the UserStatusUpdatedEvent by updating the user's status to either online or offline.
     * 
     * @param event - The event to handle, which contains the user ID and the updated online status.
     */
    async handle(event: UserStatusUpdatedEvent): Promise<void> {
        console.log('[x] Handling ', UserStatusUpdatedEvent.name);

        const userStatus = new UserStatus(event.userID, event.isOnline);

        await this.repo.setUserStatus(userStatus);
    }
}
