import { Event } from "../../domain/events/event";

/**
 * Interface for the Event Bus that handles publishing and consuming events.
 * 
 * The Event Bus is responsible for delivering events to the appropriate consumers
 * and allowing publishers to broadcast events to a specified queue.
 */
export interface EventBus {
  /**
   * Publishes an event to a specific queue.
   * 
   * @param queueName - The name of the queue where the event will be published.
   * @param event - The event to be published. It must implement the Event interface.
   * @returns A Promise resolving to a boolean indicating the success of the operation.
   */
  publish(queueName: string, event: Event): Promise<boolean>;

  /**
   * Consumes events from a specific queue and processes them using a handler function.
   * 
   * @param queueName - The name of the queue from which events will be consumed.
   * @param handler - A function that handles the event when consumed. This function will be
   * executed asynchronously and should return a Promise.
   * 
   * @returns A Promise that resolves when the consumer is successfully set up to handle events.
   */
  consume(
    queueName: string,
    handler: (event: Event) => Promise<void>
  ): Promise<void>;
}
