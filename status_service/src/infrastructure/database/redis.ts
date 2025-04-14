import { RedisClientType, createClient } from 'redis';
import { IStatusRepository } from '../../domain/repository/status.repository';
import { UserStatus } from '../../domain/models/status';

/**
 * Implements IStatusRepository using Redis as the backend for storing and retrieving user statuses.
 * 
 * This service connects to Redis, handles the setting and getting of user statuses, and manages 
 * the connection lifecycle.
 */
export class RedisService implements IStatusRepository {
    private redisClient: RedisClientType;
    private isConnected = false;
    private readonly RECONNECT_DELAY = 5000;
    private readonly MAX_RETRIES = 3;

    constructor() {
        this.initializeConnection();
    }

    /**
     * Initializes the Redis connection with retry logic.
     * 
     * Tries to establish a connection with Redis, retrying a specified number of times before failing.
     * 
     * @param retryCount - The number of attempts already made to connect.
     */
    private async initializeConnection(retryCount = 0): Promise<void> {
        try {
            this.redisClient = this.createClient();
            await this.connect();
            this.isConnected = true;
        } catch (error) {
            if (retryCount < this.MAX_RETRIES - 1) {
                await new Promise(resolve => setTimeout(resolve, this.RECONNECT_DELAY));
                return this.initializeConnection(retryCount + 1);
            }

            throw new Error(`Failed to connect to Redis after ${this.MAX_RETRIES} attempts`);
        }
    }

    /**
     * Creates a Redis client.
     * 
     * @returns The created Redis client.
     */
    private createClient(): RedisClientType {
        const host = process.env.REDIS_HOST ?? 'localhost';
        const port = process.env.REDIS_PORT ?? '6379';
        const pass = process.env.REDIS_PASS ?? 'lukasz';
        const url = `redis://${host}:${port}`;

        const client = createClient({
            url,
            password: pass || undefined,
            socket: {
                reconnectStrategy: (retries) => {
                    return Math.min(retries * 100, 5000);
                },
            },
        });

        client.on('connect', () => {
            console.log('Connecting to Redis');
        });

        client.on('ready', () => {
            console.log('Redis is ready to work');
        });

        client.on('error', (err) => {
            console.log('error', err);
            this.isConnected = false;
        });

        client.on('end', () => {
            this.isConnected = false;
        });

        return client as RedisClientType;
    }

    /**
     * Connects to the Redis client.
     */
    private async connect(): Promise<void> {
        if (!this.redisClient) {
            throw new Error('Redis client not initialized');
        }
        await this.redisClient.connect();
    }

    /**
     * Checks whether the Redis client is connected.
     * 
     * @throws Error if the client is not connected.
     */
    private checkConnection(): void {
        if (!this.isConnected) {
            throw new Error('Redis client is not connected');
        }
    }

    /**
     * Sets the status of a user in Redis.
     * 
     * @param user - The UserStatus object representing the user's current status.
     */
    async setUserStatus(user: UserStatus): Promise<boolean> {
        this.checkConnection();

        try {
            await this.redisClient.set(`user:${user.userID}:status`, JSON.stringify(user), {
                EX: 3600,
            });
        } catch (error) {
            return false;
        }

        return false;
    }

    /**
     * Retrieves the status of a user from Redis.
     * 
     * @param userID - The unique identifier of the user whose status is being retrieved.
     * @returns A Promise resolving to the UserStatus object of the user, or a default offline status if not found.
     */
    async getUserStatus(userID: string): Promise<UserStatus | null> {
        this.checkConnection();

        try {
            const userStatus = await this.redisClient.get(`user:${userID}:status`);
            return userStatus ? JSON.parse(userStatus) : new UserStatus(userID, false);
        } catch (error) {
            return null;
        }
    }

    /**
     * Retrieves all online users' statuses.
     * 
     * @returns An empty array, as this feature is not implemented in RedisService.
     */
    async getOnlineUsers(): Promise<UserStatus[]> {
        return [];
    }

    /**
     * Closes the Redis connection when the module is destroyed.
     */
    async onModuleDestroy() {
        if (this.redisClient) {
            await this.redisClient.quit();
        }
    }
}
