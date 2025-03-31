import { IConversation } from "../../domain/models/conversation.model";
import { IMessage } from "../../domain/models/message.model";
import { IChatRepository } from "../../domain/repository/chat.repository";
import { Collection, MongoClient } from "mongodb";

export class MongoService implements IChatRepository {
    private readonly MESSAGE_COLLECTION = "messages";
    private readonly CONVERSATION_COLLECTION = "conversations";
    private client: MongoClient;
    private messages: Collection<IMessage>;
    private conversations: Collection<IConversation>;


    constructor(private readonly uri: string = process.env.MONGO_URI || "") {
        if (!uri) throw new Error("MongoDB URI is required");
    }

    async connect(): Promise<void> {
        try {
            this.client = new MongoClient(this.uri);

            await this.client.connect()

            const dbName = process.env.MONGO_DB_NAME

            if (!dbName) {
                throw Error("Please provide MONGO_DB_NAME")
            }

            const db = this.client.db(dbName)

            this.messages = db.collection<IMessage>(this.MESSAGE_COLLECTION);
            this.conversations = db.collection<IConversation>(this.CONVERSATION_COLLECTION);

            await this.createIndexes()
        } catch (error) {
            throw Error(error)
        }

    }

    private async createIndexes(): Promise<void> {
        await this.conversations.createIndex({ participants: 1 });
        await this.messages.createIndex({ conversationId: 1, timestamp: -1 });
    }

    async close(): Promise<void> {
        try {
            await this.client?.close();
            console.log("MongoDB connection closed");
        } catch (error) {
            console.error("Disconnection error:", error);
            throw error;
        }
    }

    async createConversation(chat: IConversation): Promise<IConversation | null> {
        const result = await this.conversations.insertOne(chat)
        if (result.acknowledged) {
            return null;
        }
        // TODO: fix it
        return chat;
    }
    updateConversation(chatID: string, updateData: Partial<IConversation>): Promise<IConversation | null> {
        throw new Error("Method not implemented.");
    }
    appendMessage(chatID: string, message: IMessage): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getConversationForMember(memberID: string, page?: number, limit?: number): Promise<IConversation[]> {
        throw new Error("Method not implemented.");
    }
    getConversationById(chatID: string): Promise<IConversation | null> {
        throw new Error("Method not implemented.");
    }
    deleteConversation(chatID: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

}