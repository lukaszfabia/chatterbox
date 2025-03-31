import { Event } from "../../domain/events/event"

export interface EventBus {
    publish(queueName: string, event: Event): Promise<boolean>
    consume(queueName: string, handler: (event: Event) => Promise<void>): Promise<void>
}