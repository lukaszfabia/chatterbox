import { UserLoggedInEvent } from "../../domain/events/user-logged-out.event";
import { UserStatus } from "../../domain/models/status";
import { IStatusRepository } from "../../domain/repository/status.repository";
import { EventHandler } from "./event.handler";

export class UserLoggedInEventHandler implements EventHandler<UserLoggedInEvent> {
    constructor(
        private readonly repo: IStatusRepository
    ) { }

    async handle(event: UserLoggedInEvent): Promise<void> {
        await this.repo.setUserStatus(new UserStatus(event.userID, true));
    }
}