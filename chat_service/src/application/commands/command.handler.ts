import { Command } from "../../domain/command/command";

export interface CommandHanlder<T extends Command> {
    execute(c: T): Promise<any>
}