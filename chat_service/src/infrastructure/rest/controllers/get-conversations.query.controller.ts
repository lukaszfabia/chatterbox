import { Response } from "express";
import asyncHandler from "express-async-handler";
import { GetConversationsQueryHandler } from "../../../application/queries/get-conversations.query.handler";
import { AuthRequest } from "../../jwt/jwt.middleware";
import { GetConversationsQuery } from "../../../domain/queries/get-conversations.query";

/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: API for handling messages and chat functionality.
 */

/**
 * @swagger
 * /api/v1/chat/conversations:
 *   get:
 *     summary: Retrieve all conversations for the authenticated user
 *     description: Returns a list of conversations for the currently authenticated user.
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of conversations for the authenticated user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The unique ID of the conversation
 *                     example: "chat123"
 *                   members:
 *                     type: array
 *                     description: List of members in the conversation
 *                     items:
 *                       type: object
 *                       properties:
 *                         userID:
 *                           type: string
 *                           description: The ID of the user
 *                           example: "user123"
 *                         username:
 *                           type: string
 *                           description: The username of the user
 *                           example: "john_doe"
 *                         avatarURL:
 *                           type: string
 *                           description: The avatar URL of the user
 *                           example: "https://example.com/avatar.jpg"
 *                   lastMessage:
 *                     type: object
 *                     description: The last message sent in the conversation
 *                     properties:
 *                       content:
 *                         type: string
 *                         description: The content of the message
 *                         example: "Hey, let's catch up!"
 *                       sentAt:
 *                         type: string
 *                         description: Timestamp when the message was sent
 *                         example: "2025-04-14T10:15:00Z"
 *                   updatedAt:
 *                     type: string
 *                     description: The timestamp of the last update to the conversation
 *                     example: "2025-04-14T10:15:00Z"
 *       401:
 *         description: Unauthorized, no valid token provided
 *       500:
 *         description: Internal server error
 */
export class GetConversationsController {
    constructor(private readonly handler: GetConversationsQueryHandler) {
    }

    /**
     * Retrieves all conversations for the authenticated user.
     * 
     * @param req - The HTTP request object with user information in `req.userID`.
     * @param res - The HTTP response object.
     * @returns A response with the list of conversations or an error message.
     */
    getConversations = asyncHandler(async (req: AuthRequest, res: Response) => {
        const query = new GetConversationsQuery(req.userID!);
        const result = await this.handler.execute(query);
        res.status(200).json(result);
    });
}
