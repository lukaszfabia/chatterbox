import { Command } from "../../domain/command/command";

/**
 * CommandHandler is responsible for executing commands of a specific type.
 * It defines an interface for handling commands and performing the corresponding actions.
 * 
 * @template T - The type of command to be handled, which extends the Command class.
 */
export interface CommandHandler<T extends Command> {

    /**
     * Executes the provided command and returns a promise indicating the success of the operation.
     * 
     * @param command - The command to execute. It must be of type T, which extends Command.
     * @returns A promise that resolves to a boolean indicating whether the command was successfully executed.
     */
    execute(command: T): Promise<boolean>;
}
