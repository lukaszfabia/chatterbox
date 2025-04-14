import { Command } from "../../domain/command/command";

// CommandHandler interface for executing a command
export interface CommandHandler<T extends Command> {
    /**
     * Executes a command and returns a promise of any type.
     * 
     * @param c The command to be executed, which is of type T that extends Command.
     * @returns A Promise that resolves to any type, allowing asynchronous execution.
     */
    execute(c: T): Promise<any>;
}
