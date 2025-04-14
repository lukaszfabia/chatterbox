import { Event } from "../../domain/events/event";

// EventHandler interface that processes events of type T
export interface EventHandler<T extends Event> {
    /**
     * Handles the event and processes it asynchronously.
     * 
     * @param event The event to be handled, which is of type T that extends Event.
     * @returns A Promise that resolves when the event has been processed.
     */
    handle(event: T): Promise<void>;
}
