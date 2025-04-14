import { EventHandler } from "../../application/events/event.handler";
import { EventBus } from "./bus";
import { Event } from "../../domain/events/event";
import client, { Connection, Channel, ConsumeMessage } from "amqplib";
import { EventDispatcher } from "../../application/events/dispatcher";

/**
 * Implements the `EventBus` interface to interact with RabbitMQ as a message bus.
 * Provides methods for publishing and consuming events.
 *
 * @class RabbitMQService
 */
export class RabbitMQService implements EventBus {
    private connection!: Connection;
    private channel!: Channel;
    private connected: boolean = false;
    private retryAttempts: number = 0;
    private maxRetryAttempts: number = 5;
    private retryDelay: number = 5000; // 5 seconds
    private dispatcher: EventDispatcher;

    constructor() {
        this.dispatcher = new EventDispatcher();
    }

    /**
     * Registers an event handler for a specific event type.
     * 
     * @param event - The name of the event to register the handler for.
     * @param handler - The handler to be invoked when the event is consumed.
     * 
     * @template T - The type of the event.
     */
    public registerHandler<T extends Event>(event: string, handler: EventHandler<T>): void {
        console.log('Registering ', event);
        this.dispatcher.register(event, handler);
    }

    /**
     * Establishes a connection to the RabbitMQ server.
     * 
     * Tries to connect to RabbitMQ and sets up the channel. In case of failure, 
     * it retries to connect based on a retry mechanism.
     */
    async connect(): Promise<void> {
        if (this.connected) return;

        try {
            console.log(`Connecting to RabbitMQ Server...`);

            const port = process.env.RABBITMQ_PORT || 5672;
            const pass = process.env.RABBITMQ_DEFAULT_PASS || "";
            const user = process.env.RABBITMQ_DEFAULT_USER || "";
            const host = process.env.RABBITMQ_HOST || "localhost";

            const rabbitmqURL = `amqp://${user}:${pass}@${host}:${port}`;

            const connection = await client.connect(rabbitmqURL);

            this.connection = connection.connection;
            this.channel = await connection.createChannel();
            this.connected = true;
            this.retryAttempts = 0;

            this.connection.on("close", () => {
                console.log("RabbitMQ connection closed, reconnecting...");
                this.connected = false;
                this.scheduleReconnect();
            });

            this.connection.on("error", (err) => {
                console.error("RabbitMQ connection error:", err.message);
                if (!this.connected) {
                    this.scheduleReconnect();
                }
            });

            console.log(`Connected to RabbitMQ`);
        } catch (error) {
            console.error(`Failed to connect to RabbitMQ: ${error}`);
            this.scheduleReconnect();
        }
    }

    /**
     * Schedules a reconnection to RabbitMQ in case the connection is lost.
     * The reconnection is attempted with a delay and a maximum number of attempts.
     */
    private scheduleReconnect(): void {
        if (this.retryAttempts >= this.maxRetryAttempts) {
            console.error(`Max reconnection attempts (${this.maxRetryAttempts}) reached`);
            return;
        }

        this.retryAttempts++;
        const delay = this.retryAttempts * this.retryDelay;

        console.log(`Retrying connection in ${delay / 1000} seconds (attempt ${this.retryAttempts}/${this.maxRetryAttempts})`);

        setTimeout(() => {
            this.connect().catch(console.error);
        }, delay);
    }

    /**
     * Closes the connection and the channel to RabbitMQ.
     * 
     * This method attempts to gracefully close the channel and connection.
     * If there is an error during the process, it will throw an error.
     */
    async close(): Promise<void> {
        try {
            if (this.channel) {
                await this.channel.close();
                console.log("RabbitMQ channel closed");
            }
            this.connected = false;
        } catch (error) {
            console.error("Error closing RabbitMQ connection:", error);
            throw error;
        }
    }

    /**
     * Publishes an event to a specified queue in RabbitMQ.
     * 
     * @param queueName - The name of the queue to which the event will be published.
     * @param event - The event to be published.
     * @returns A promise that resolves to `true` if the event is successfully published, 
     *          and `false` otherwise.
     */
    async publish(queueName: string, event: Event): Promise<boolean> {
        if (!this.connected) {
            throw new Error("Not connected to RabbitMQ");
        }

        try {
            await this.channel.assertQueue(queueName, {
                durable: true,
            });

            const messageBuffer = Buffer.from(JSON.stringify(event));
            const success = this.channel.sendToQueue(
                queueName,
                messageBuffer,
                { persistent: true }
            );

            if (!success) {
                console.warn(`Message was not delivered to queue ${queueName}`);
                return false;
            }

            console.log(`Event published to ${queueName}:`, event);
            return true;
        } catch (error) {
            console.error(`Failed to publish event to ${queueName}:`, error);
            throw error;
        }
    }

    /**
     * Consumes events from a specified queue and processes them using registered handlers.
     * 
     * @param queueName - The name of the queue from which events will be consumed.
     * @template T - The type of the event.
     */
    async consume<T extends Event>(queueName: string): Promise<void> {
        if (!this.connected) {
            throw new Error("Not connected to RabbitMQ");
        }

        try {
            await this.channel.assertQueue(queueName, { durable: true });

            console.log(`[x] Waiting for messages in ${queueName}`);

            this.channel.consume(queueName, async (msg: ConsumeMessage | null) => {
                if (!msg) {
                    console.log("Consumer cancelled by server");
                    return;
                }

                try {
                    const event = JSON.parse(msg.content.toString()) as T;
                    console.log(`[x] Received event from ${queueName}:`, event);

                    await this.dispatcher.dispatch(event, queueName);
                    this.channel.ack(msg);
                } catch (error) {
                    console.error(`Error processing message from ${queueName}:`, error);
                    this.channel.nack(msg, false, false);
                }
            }, { noAck: false });

        } catch (error) {
            console.error(`Failed to consume from ${queueName}:`, error);
            throw error;
        }
    }
}
