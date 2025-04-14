import { UpdateStatusCommand } from "../../domain/command/update-status.command";
import { UserStatus } from "../../domain/models/status";
import { IStatusRepository } from "../../domain/repository/status.repository";
import { CommandHandler } from "./command.handler";

/**
 * UpdateStatusCommandHandler handles the execution of an UpdateStatusCommand.
 * It publishes a UserStatusUpdatedEvent to the EventBus upon handling the command.
 */
export class UpdateStatusCommandHandler implements CommandHandler<UpdateStatusCommand> {

    /**
     * Constructs a new instance of UpdateStatusCommandHandler.
     * 
     * @param repo - The status repository used to retrieve the user's status.
     */
    constructor(private readonly repo: IStatusRepository) { }

    /**
     * Executes the given UpdateStatusCommand.
     * It creates a UserStatusUpdatedEvent and publishes it to the EventBus.
     * 
     * @param command - The UpdateStatusCommand to be executed, containing userID and status information.
     */
    async execute(command: UpdateStatusCommand): Promise<boolean> {
        console.log('User with', command.userID, 'goes into ', command.isOnline, 'mode');

        return await this.repo.setUserStatus(new UserStatus(command.userID, command.isOnline))
    }
}
