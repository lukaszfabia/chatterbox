import { Event } from "../../domain/events/event";
import { EventHandler } from "./event.handler";

export class EventDispatcher {
    private handlers: Record<string, EventHandler<Event>> = {};

    register(event: string, handler: EventHandler<Event>) {
        this.handlers[event] = handler;
    }

    async dispatch<T extends Event>(event: T, q: string) {
        const handler = this.handlers[q];

        if (handler) {
            await handler.handle(event);
        }
    }
}
