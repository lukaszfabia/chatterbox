import { Event } from "../../domain/events/event";
import { EventHandler } from "./event.handler";

/**
 * EventDispatcher is responsible for managing event handlers and dispatching events
 * to the appropriate handler based on the event type.
 */
export class EventDispatcher {
    // A record to store handlers for each event type
    private handlers: Record<string, EventHandler<Event>> = {};

    /**
     * Registers an event handler for a specific event type.
     * 
     * @param event - The event type (usually the event name as a string).
     * @param handler - The handler to be registered for the event type.
     */
    register(event: string, handler: EventHandler<Event>) {
        this.handlers[event] = handler;
    }

    /**
     * Dispatches an event to its appropriate handler.
     * 
     * @param event - The event to be dispatched, must extend the Event class.
     * @param q - The event type as a string, used to find the appropriate handler.
     * @returns A promise indicating whether the event was successfully handled.
     */
    async dispatch<T extends Event>(event: T, q: string) {
        const handler = this.handlers[q];

        if (handler) {
            await handler.handle(event);
        }
    }
}
