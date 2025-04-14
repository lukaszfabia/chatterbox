import { CreateMessageCommand } from "../../domain/command/create-message.command";
import { MessageDTO } from "../../domain/dto/message.dto";
import { MessageCreatedEvent } from "../../domain/events/message-created.event";
import { IChatRepository } from "../../domain/repository/chat.repository";
import { EventBus } from "../../infrastructure/rabbitmq/bus";
import { CommandHandler } from "./command.handler";

// Command handler for creating a message
export class CreateMessageCommandHandler implements CommandHandler<CreateMessageCommand> {

    // Constructor that injects the repository and event bus for handling the message creation
    constructor(
        private readonly repo: IChatRepository, // The repository for interacting with the chat data
        private readonly rabbitmq: EventBus,    // The event bus to publish events
    ) { }

    /**
     * Executes the command to create a new message in a chat.
     * 
     * @param c The command containing the details of the message to be created.
     * @returns A Promise that resolves to the created message or null if there is an error.
     */
    async execute(c: CreateMessageCommand): Promise<MessageDTO | null> {
        // Attempt to append the message to the chat
        const chat = await this.repo.appendMessage(
            c.receiverID,
            c.senderID,
            c.content,
            c.chatID,
            c.sentAt
        );

        // If the chat was not found, log the error and return null
        if (!chat) {
            console.log('Chat not found');
            return null;
        }

        // Ensure that the sender is part of the chat (authorization check)
        if (!chat.members.some(m => m.userID === c.senderID)) {
            console.log('Unauthorized');
            return null;
        }

        // Publish an event that the message was created successfully
        await this.rabbitmq.publish(MessageCreatedEvent.name, new MessageCreatedEvent(chat));

        // Return the last message in the chat after creation
        return chat.lastMessage!;
    }
}
