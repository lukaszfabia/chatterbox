/**
 * Represents a base interface for all command objects in the system.
 * 
 * The `Command` interface serves as a marker for command classes that encapsulate
 * actions or requests to be executed within the application. Command classes should
 * implement this interface to signify that they are part of the command pattern.
 * 
 * Commands typically contain the data required to perform an operation and are handled
 * by command handlers, which implement the logic to execute the actions.
 */
export interface Command {
}
