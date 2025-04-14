import { Event } from "../../domain/events/event";

/**
 * Interface defining the contract for an Event Bus, used for 
 * publishing and consuming events within the system.
 *
 * The Event Bus provides methods to publish events to a specified 
 * queue and consume events from a queue using a handler function.
 */
export interface EventBus {

    /**
     * Publishes an event to the specified queue.
     * 
     * This method will send an event to the message broker or 
     * event stream for processing by other services or components.
     * 
     * @param queueName - The name of the queue to which the event will be published.
     * @param event - The event to be published, which should conform to the `Event` interface.
     * @returns A promise that resolves to `true` if the event was successfully published, 
     *          and `false` otherwise.
     */
    publish(queueName: string, event: Event): Promise<boolean>;

    /**
     * Consumes events from the specified queue and processes them using the provided handler.
     * 
     * This method listens for events on the specified queue and passes them 
     * to the given handler function when they are received.
     * 
     * @param queueName - The name of the queue from which events will be consumed.
     * @param handler - The function that will handle each event. It receives an event 
     *                  of type `Event` and returns a promise.
     * 
     * @returns A promise that resolves when the consumer has been successfully set up.
     */
    consume(queueName: string, handler: (event: Event) => Promise<void>): Promise<void>;
}
