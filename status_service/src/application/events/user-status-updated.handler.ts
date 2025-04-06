import { UserStatusUpdatedEvent } from '../../domain/events/user-status-updated.event';
import { UserStatus } from '../../domain/models/status';
import { IStatusRepository } from '../../domain/repository/status.repository';
import { EventHandler } from './event.handler';

export class UserStatusUpdatedEventHandler implements EventHandler<UserStatusUpdatedEvent> {
    constructor(
        private readonly repo: IStatusRepository
    ) { }

    async handle(event: UserStatusUpdatedEvent): Promise<void> {
        console.log('[x] Handling ', UserStatusUpdatedEvent.name)
        await this.repo.setUserStatus(new UserStatus(event.userID, event.isOnline));
    }
}