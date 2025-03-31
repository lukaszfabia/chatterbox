import { EventHandler } from "./event.handler";
import { Event } from "../../domain/events/event";
export class EventDispatcher {
    private handlers: Record<string, EventHandler<Event>> = {};

    register(event: Event, handler: EventHandler<Event>) {
        this.handlers[event.constructor.name] = handler;
    }

    async dispatch(event: Event, message: Buffer) {
        const handler = this.handlers[event.constructor.name];
        if (handler) {
            await handler.handle(message);
        }
    }
}
