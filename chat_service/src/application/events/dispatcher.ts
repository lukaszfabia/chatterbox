import { EventHandler } from "./event.handler";
import { Event } from "../../domain/events/event";

// EventDispatcher is responsible for dispatching events to their respective handlers
export class EventDispatcher {
    // A record to store event handlers mapped by event type
    private handlers: Record<string, EventHandler<Event>> = {};

    /**
     * Registers an event handler for a specific event type.
     * 
     * @param event The event type (string) that the handler is associated with.
     * @param handler The handler that will process the event.
     */
    register(event: string, handler: EventHandler<Event>) {
        this.handlers[event] = handler;
    }

    /**
     * Dispatches an event to the appropriate handler for the specified event type.
     * 
     * @param event The event to be dispatched.
     * @param q The event type as a string that corresponds to a handler.
     */
    async dispatch<T extends Event>(event: T, q: string) {
        const handler = this.handlers[q];
        if (handler) {
            await handler.handle(event);
        }
    }
}
