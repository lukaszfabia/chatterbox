import { RedisClientType, createClient } from 'redis';
import { IStatusRepository } from '../../domain/repository/status.repository';
import { UserStatus } from '../../domain/models/status';

export class RedisService implements IStatusRepository {
    private redisClient: RedisClientType;
    private isConnected = false;
    private readonly RECONNECT_DELAY = 5000;
    private readonly MAX_RETRIES = 3;

    constructor() {
        this.initializeConnection();
    }
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
            console.log('Connecting to Redis')
        });

        client.on('ready', () => {
            console.log('Redis is ready to work')
        });

        client.on('error', (err) => {
            console.log('error', err)
            this.isConnected = false;
        });

        client.on('end', () => {
            this.isConnected = false;
        });

        return client as RedisClientType;
    }

    private async connect(): Promise<void> {
        if (!this.redisClient) {
            throw new Error('Redis client not initialized');
        }
        await this.redisClient.connect();
    }

    private checkConnection(): void {
        if (!this.isConnected) {
            throw new Error('Redis client is not connected');
        }
    }

    async setUserStatus(user: UserStatus): Promise<void> {
        this.checkConnection();

        try {
            await this.redisClient.set(`user:${user.userID}:status`, JSON.stringify(user), {
                EX: 3600,
            });
        } catch (error) {
            throw error;
        }
    }

    async getUserStatus(userID: string): Promise<UserStatus | null> {
        this.checkConnection();

        try {
            const userStatus = await this.redisClient.get(`user:${userID}:status`);
            return userStatus ? JSON.parse(userStatus) : null;
        } catch (error) {
            throw error;
        }
    }

    async getOnlineUsers(): Promise<UserStatus[]> {
        return [];
        // this.checkConnection();

        // try {
        //     const keys = await this.redisClient.keys('user:*:status');
        //     const pipeline = this.redisClient.pipeline();

        //     keys.forEach(key => pipeline.get(key));
        //     const results = await pipeline.exec();

        //     return results
        //         .filter(([err, res]) => !err && res)
        //         .map(([_, res]) => JSON.parse(res as string));
        // } catch (error) {
        //     this.logger.error('Error getting online users', error.stack);
        //     throw error;
        // }
    }

    async onModuleDestroy() {
        if (this.redisClient) {
            await this.redisClient.quit();
        }
    }
}