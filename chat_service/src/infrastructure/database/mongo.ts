import { ConversationDTO } from "../../domain/dto/conversation.dto";
import { MessageDTO } from "../../domain/dto/message.dto";
import { IConversation, User } from "../../domain/models/conversation.model";
import { IMessage } from "../../domain/models/message.model";
import { IChatRepository } from "../../domain/repository/chat.repository";
import { Collection, MongoClient, ObjectId } from "mongodb";


export class MongoService implements IChatRepository {
  private readonly MESSAGE_COLLECTION = "messages";
  private readonly CONVERSATION_COLLECTION = "conversations";
  private client!: MongoClient;
  private messages!: Collection<IMessage>;
  private conversations!: Collection<IConversation>;

  /**
   * Creates a new instance of MongoService.
   * @param uri Optional custom MongoDB URI. Defaults to env-based connection string.
   */
  constructor(
    private readonly uri: string = process.env.MONGO_URI || ""
  ) {
    if (this.uri.length < 1) throw new Error("MongoDB URI is required");
  }

  /**
   * Connects to MongoDB and initializes collections and indexes.
   */
  async connect(): Promise<void> {
    try {
      this.client = new MongoClient(this.uri);
      await this.client.connect();
      console.log('Connected to MongoDB');

      const dbName = process.env.MONGO_DB_NAME;
      if (!dbName) throw Error("Please provide MONGO_DB_NAME");

      const db = this.client.db(dbName);
      this.messages = db.collection<IMessage>(this.MESSAGE_COLLECTION);
      this.conversations = db.collection<IConversation>(this.CONVERSATION_COLLECTION);

      await this.createIndexes();
    } catch (error) {
      throw Error("Failed to conntect with mongo");
    }
  }

  /**
   * Creates necessary indexes for optimized queries.
   */
  private async createIndexes(): Promise<void> {
    await this.conversations.createIndex({ "members.userID": 1 });
    await this.messages.createIndex({ chatID: 1, sentAt: -1 });
  }

  /**
   * Closes the MongoDB connection.
   */
  async close(): Promise<void> {
    try {
      await this.client?.close();
      console.log("MongoDB connection closed");
    } catch (error) {
      console.error("Disconnection error:", error);
      throw error;
    }
  }

  /**
   * Fetches a conversation by its ID.
   * @param chatID ID of the conversation.
   * @returns A ConversationDTO or null if not found.
   */
  async getConversationById(chatID: string): Promise<ConversationDTO | null> {
    const chat = await this.conversations.findOne({ _id: new ObjectId(chatID) });
    return chat ? ConversationDTO.fromMongoDocument(chat) : null;
  }

  /**
   * Fetches paginated conversations for a given member.
   * @param memberID ID of the user.
   * @param page Page number (default 1).
   * @param limit Number of items per page (default 10).
   * @returns Array of ConversationDTOs.
   */
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

  /**
   * Appends a new message to a conversation and updates the last message info.
   * @param receiverID ID of the receiver.
   * @param senderID ID of the sender.
   * @param content Message content.
   * @param chatID ID of the conversation.
   * @param sentAt Timestamp of when the message was sent.
   * @returns Updated ConversationDTO or null if failed.
   */
  async appendMessage(
    receiverID: string,
    senderID: string,
    content: string,
    chatID: string,
    sentAt: number
  ): Promise<ConversationDTO | null> {
    const message: IMessage = {
      senderID,
      content,
      sentAt,
      chatID,
      status: "sent",
      receiverID,
    };

    const added = await this.messages.insertOne(message);
    if (!added.insertedId) return null;

    const updatedConversation = await this.conversations.findOneAndUpdate(
      { _id: new ObjectId(chatID) },
      {
        $set: {
          lastMessage: { ...message, _id: added.insertedId },
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    );

    return updatedConversation ? ConversationDTO.fromMongoDocument(updatedConversation) : null;
  }

  /**
   * Retrieves messages for a given chat.
   * @param chatID ID of the conversation.
   * @param limit Maximum number of messages to retrieve.
   * @returns Array of MessageDTOs.
   */
  async getMessages(chatID: string, limit: number): Promise<MessageDTO[]> {
    const messages = await this.messages.find({ chatID }).sort({ sentAt: 1 }).limit(limit).toArray();
    return messages.map((message) => MessageDTO.fromMongoDocument(message));
  }

  /**
   * Deletes a conversation by its ID.
   * @param chatID ID of the conversation.
   * @returns Deleted ConversationDTO or null.
   */
  async deleteConversation(chatID: string): Promise<ConversationDTO | null> {
    const deleted = await this.conversations.findOneAndDelete({ _id: new ObjectId(chatID) });
    return deleted ? ConversationDTO.fromMongoDocument(deleted) : null;
  }

  /**
   * Creates a new conversation with specified members.
   * If a conversation with the same members exists, it is returned instead.
   * @param members Array of users participating in the conversation.
   * @returns Created or existing ConversationDTO.
   */
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
      return ConversationDTO.fromMongoDocument(existingConversation);
    }

    const newConversation: IConversation = {
      updatedAt: new Date(),
      members,
    };

    const added = await this.conversations.insertOne(newConversation);
    if (added.insertedId) {
      newConversation._id = added.insertedId;
      return ConversationDTO.fromMongoDocument(newConversation);
    }

    return null;
  }

  /**
   * Updates a member’s avatar and/or username in all conversations.
   * @param userID ID of the user to update.
   * @param avatarURL Optional new avatar URL.
   * @param username Optional new username.
   * @returns Number of modified conversations.
   */
  async updateMember(
    userID: string,
    avatarURL?: string | null,
    username?: string | null
  ): Promise<number> {
    const filter = { "members.userID": userID };
    const update: any = {};

    if (avatarURL !== null) {
      update["members.$[elem].avatarURL"] = avatarURL;
    }

    if (username !== null) {
      update["members.$[elem].username"] = username;
    }

    const result = await this.conversations.updateMany(
      filter,
      { $set: update },
      { arrayFilters: [{ "elem.userID": userID }] }
    );

    return result.modifiedCount;
  }
}
