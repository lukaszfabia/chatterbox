import { Event } from "../../domain/events/event";

export interface EventHandler<T extends Event> {
    handle(event: T): Promise<void>;
}