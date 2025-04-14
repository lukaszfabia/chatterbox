import { Event } from "../../domain/events/event";

/**
 * Interface that defines an event handler for handling specific types of events.
 * It ensures that event handlers are type-safe by restricting the event type to a specific subtype of `Event`.
 *
 * @template T - A specific type of event that extends the `Event` base class.
 */
export interface EventHandler<T extends Event> {
    /**
     * Handles the provided event.
     *
     * @param event - The event that needs to be handled. It is a specific type that extends `Event`.
     * @returns A promise that resolves once the event is processed.
     * 
     * The `handle` method is expected to contain logic to process the event.
     * It may perform actions like updating state, triggering side-effects, or interacting with external systems.
     */
    handle(event: T): Promise<void>;
}
