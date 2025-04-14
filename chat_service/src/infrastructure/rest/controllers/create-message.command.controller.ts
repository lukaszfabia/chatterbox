import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { InvalidBody } from "./errors";
import { CreateMessageCommand } from "../../../domain/command/create-message.command";
import { CreateMessageCommandHandler } from "../../../application/commands/create-message.command.handler";

/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: API for handling messages and chat functionality.
 */

/**
 * @swagger
 * /api/v1/chat/new/message:
 *   post:
 *     summary: Create a new message in a chat
 *     description: Creates a new message in an existing chat.
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               receiverID:
 *                 type: string
 *                 description: ID of the user receiving the message
 *                 example: "user123"
 *               senderID:
 *                 type: string
 *                 description: ID of the user sending the message
 *                 example: "user456"
 *               content:
 *                 type: string
 *                 description: The actual content of the message
 *                 example: "Hello, how are you?"
 *               chatID:
 *                 type: string
 *                 description: ID of the chat where the message is being sent
 *                 example: "chat789"
 *               sentAt:
 *                 type: integer
 *                 description: Timestamp when the message is sent (Unix timestamp)
 *                 example: 1627672293
 *     responses:
 *       201:
 *         description: Message created successfully
 *       400:
 *         description: Invalid request body or data
 *       401:
 *         description: Unauthorized, no valid token provided
 *       500:
 *         description: Internal server error
 */
export class CreateMessageController {
    constructor(
        private readonly handler: CreateMessageCommandHandler
    ) {
    }

    /**
     * Creates a new message.
     * 
     * @param req - The HTTP request object.
     * @param res - The HTTP response object.
     * @returns A response with the status code and the created message or an error message.
     */
    createMessage = asyncHandler(async (req: Request, res: Response) => {
        console.log("Creating message...")
        const command = req.body as CreateMessageCommand;

        if (!command) {
            console.log("Invalid body")
            res.status(400).json(InvalidBody);
            return;
        }

        const result = await this.handler.execute(command);
        if (!result) {
            console.log("Failed to insert message")
            res.status(400).json(InvalidBody);
            return;
        }

        res.status(201).json(result);
    });

}
