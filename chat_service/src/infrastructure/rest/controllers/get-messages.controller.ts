import { Response } from "express";
import asyncHandler from "express-async-handler";
import { GetMessagesQueryHandler } from "../../../application/queries/get-messages.query.handler";
import { GetMessagesQuery } from "../../../domain/queries/get-messages.query";
import { AuthRequest } from "../../jwt/jwt.middleware";

/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: API for handling messages and chat functionality.
 */

/**
 * @swagger
 * /api/v1/chat/{chatID}/messages:
 *   get:
 *     summary: Retrieve all messages for a specific chat
 *     description: Returns a list of messages for the specified chat.
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: chatID
 *         required: true
 *         description: The ID of the chat to retrieve messages for.
 *         schema:
 *           type: string
 *           example: "chat123"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of messages for the specified chat
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The unique ID of the message
 *                     example: "msg123"
 *                   senderID:
 *                     type: string
 *                     description: The ID of the user who sent the message
 *                     example: "user123"
 *                   receiverID:
 *                     type: string
 *                     description: The ID of the user who received the message
 *                     example: "user456"
 *                   content:
 *                     type: string
 *                     description: The content of the message
 *                     example: "Hello, how are you?"
 *                   sentAt:
 *                     type: string
 *                     description: Timestamp when the message was sent
 *                     example: "2025-04-14T10:15:00Z"
 *                   chatID:
 *                     type: string
 *                     description: The ID of the chat the message belongs to
 *                     example: "chat123"
 *                   status:
 *                     type: string
 *                     description: The status of the message (sent, delivered, read)
 *                     example: "sent"
 *       400:
 *         description: Bad request, chatID is missing or invalid
 *       401:
 *         description: Unauthorized, no valid token provided
 *       500:
 *         description: Internal server error
 */
export class GetMessagesController {
    constructor(private readonly handler: GetMessagesQueryHandler) { }

    /**
     * Retrieves messages for a specific chat.
     * 
     * @param req - The HTTP request object containing chatID as a parameter.
     * @param res - The HTTP response object.
     * @returns A response with the list of messages or an error message.
     */
    getMessages = asyncHandler(async (req: AuthRequest, res: Response) => {
        const { chatID } = req.params;

        if (!chatID) {
            res.status(400).json({ message: "chatID is required" });
            return;
        }

        console.log("Retrieving messages for chat:", chatID);

        const query: GetMessagesQuery = {
            chatID: chatID
        };

        const result = await this.handler.execute(query);
        res.status(200).json(result);
    });
}
