import { ConversationDTO } from "../../domain/dto/conversation.dto";
import { MessageDTO } from "../../domain/dto/message.dto";
import { IConversation, User } from "../../domain/models/conversation.model";
import { IMessage } from "../../domain/models/message.model";
import { IChatRepository } from "../../domain/repository/chat.repository";
import { Collection, MongoClient, ObjectId } from "mongodb";

export class MongoService implements IChatRepository {
  private readonly MESSAGE_COLLECTION = "messages";
  private readonly CONVERSATION_COLLECTION = "conversations";
  private client: MongoClient;
  private messages: Collection<IMessage>;
  private conversations: Collection<IConversation>;

  constructor(
    private readonly uri: string = `mongodb://${encodeURIComponent(
      process.env.MONGO_USER || ""
    )}:${encodeURIComponent(process.env.MONGO_PASS || "")}@${process.env.MONGO_HOST || "localhost"
      }:${process.env.MONGO_PORT || "27017"}`
  ) {
    if (!this.uri) throw new Error("MongoDB URI is required");
  }

  async connect(): Promise<void> {
    try {
      this.client = new MongoClient(this.uri);

      await this.client.connect();

      console.log('Connected to MongoDB')

      const dbName = process.env.MONGO_DB_NAME;

      if (!dbName) {
        throw Error("Please provide MONGO_DB_NAME");
      }

      const db = this.client.db(dbName);

      this.messages = db.collection<IMessage>(this.MESSAGE_COLLECTION);
      this.conversations = db.collection<IConversation>(
        this.CONVERSATION_COLLECTION
      );

      await this.createIndexes();
    } catch (error) {
      throw Error(error);
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

  async getConversationById(chatID: string): Promise<ConversationDTO | null> {
    const chat = await this.conversations.findOne({ _id: new ObjectId(chatID) });
    return chat ? ConversationDTO.fromMongoDocument(chat) : null;
  }

  async getConversationForMember(
    memberID: string,
    page = 1,
    limit = 10
  ): Promise<ConversationDTO[]> {
    const chats = await this.conversations
      .find({ "members.userID": memberID })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    return chats.map(ConversationDTO.fromMongoDocument);
  }

  async appendMessage(
    receiverID: string,
    senderID: string,
    content: string,
    chatID: string,
    sentAt: number
  ): Promise<ConversationDTO | null> {
    const message: IMessage = {
      senderID: senderID,
      content: content,
      sentAt: sentAt,
      chatID: chatID,
      status: "sent",
      receiverID: receiverID,
    };

    const added = await this.messages.insertOne(message);

    if (!added.insertedId) {
      console.log("Failed to append message");
      return null;
    }

    const filter = { _id: new ObjectId(chatID) };

    const updatedConversation = await this.conversations.findOneAndUpdate(
      filter,
      {
        $set: {
          lastMessage: {
            ...message,
            _id: added.insertedId,
          },
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    );

    if (!updatedConversation) {
      console.log('No last message')
      return null;
    }

    return ConversationDTO.fromMongoDocument(updatedConversation);
  }

  async getMessages(chatID: string, limit: number): Promise<MessageDTO[]> {
    const messages = await this.messages.find({ chatID: chatID }).sort({ sentAt: 1 }).limit(limit).toArray();

    if (!messages || messages.length === 0) return [];

    const res = messages.map((message) => MessageDTO.fromMongoDocument(message))

    return res
  }


  async deleteConversation(chatID: string): Promise<ConversationDTO | null> {
    const deleted = await this.conversations.findOneAndDelete({ _id: new ObjectId(chatID) });
    return deleted ? ConversationDTO.fromMongoDocument(deleted) : null;
  }

  async createConversation(members: User[]): Promise<ConversationDTO | null> {
    const memberIDs = members.map((m) => m.userID).sort();

    const existingConversation = await this.conversations.findOne({
      $expr: {
        $and: [
          { $eq: [{ $size: "$members" }, memberIDs.length] },
          {
            $setIsSubset: [
              memberIDs,
              { $map: { input: "$members", as: "m", in: "$$m.userID" } }
            ]
          }
        ]
      }
    });

    if (existingConversation) {
      console.log('Conversation already exists');
      return ConversationDTO.fromMongoDocument(existingConversation);
    }

    const newConversation: IConversation = {
      updatedAt: new Date(),
      members: members,
    };

    const added = await this.conversations.insertOne(newConversation);

    if (added.insertedId) {
      newConversation._id = added.insertedId;
      return ConversationDTO.fromMongoDocument(newConversation);
    }

    return null;
  }


  async updateMember(
    userID: string,
    avatarURL?: string | null,
    username?: string | null
  ): Promise<number> {
    const filter = { "members.userID": userID };
    const update = {};

    if (avatarURL !== undefined || avatarURL !== null) {
      update["members.$[elem].avatarURL"] = avatarURL;
    }

    if (username !== undefined || username !== null) {
      update["members.$[elem].username"] = username;
    }

    const result = await this.conversations.updateMany(
      filter,
      { $set: update },
      { arrayFilters: [{ "elem.userID": userID }] }
    );

    return result.modifiedCount
  }
}
