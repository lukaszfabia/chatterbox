import { UserLoggedOutEvent } from "../../domain/events/user-logged-in.event";
import { UserStatus } from "../../domain/models/status";
import { IStatusRepository } from "../../domain/repository/status.repository";
import { EventHandler } from "./event.handler";


export class UserLoggedOutEventHandler implements EventHandler<UserLoggedOutEvent> {
    constructor(
        private readonly repo: IStatusRepository
    ) { }

    async handle(event: UserLoggedOutEvent): Promise<void> {
        console.log('Handling ', UserLoggedOutEvent.name)
        await this.repo.setUserStatus(new UserStatus(event.userID, false));
    }
}