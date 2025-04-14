import { UpdateStatusCommand } from "../../domain/command/update-status.command";
import { UserStatusUpdatedEvent } from "../../domain/events/user-status-updated.event";
import { EventBus } from "../../infrastructure/rabbitmq/bus";
import { CommandHandler } from "./command.handler";

/**
 * UpdateStatusCommandHandler handles the execution of an UpdateStatusCommand.
 * It publishes a UserStatusUpdatedEvent to the EventBus upon handling the command.
 */
export class UpdateStatusCommandHandler implements CommandHandler<UpdateStatusCommand> {

    /**
     * Constructs a new instance of UpdateStatusCommandHandler.
     * 
     * @param rabbitmq - The EventBus used to publish events. 
     */
    constructor(private readonly rabbitmq: EventBus) { }

    /**
     * Executes the given UpdateStatusCommand.
     * It creates a UserStatusUpdatedEvent and publishes it to the EventBus.
     * 
     * @param command - The UpdateStatusCommand to be executed, containing userID and status information.
     * @returns A promise that resolves to a boolean indicating the success of event publishing.
     */
    async execute(command: UpdateStatusCommand): Promise<boolean> {
        console.log('Handling UpdateStatusCommand...');

        const event = new UserStatusUpdatedEvent(command.userID, command.isOnline);

        const res = await this.rabbitmq.publish(UserStatusUpdatedEvent.name, event);

        return res;
    }
}
