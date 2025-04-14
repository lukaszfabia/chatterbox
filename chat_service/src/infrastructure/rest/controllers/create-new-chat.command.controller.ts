import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { InvalidBody } from "./errors";
import { CreateNewChatCommandHandler } from "../../../application/commands/create-new-chat.command.handler";
import { CreateNewChatCommand } from "../../../domain/command/create-new-chat.command";

/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: API for handling messages and chat functionality.
 */

/**
 * @swagger
 * /api/v1/chat/new/chat:
 *   post:
 *     summary: Create a new chat with specified members
 *     description: Creates a new chat and adds specified members to it.
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
 *               members:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     userID:
 *                       type: string
 *                       description: ID of the user in the conversation
 *                       example: "user123"
 *                     username:
 *                       type: string
 *                       description: Username of the user
 *                       example: "john_doe"
 *                     avatarURL:
 *                       type: string
 *                       description: User's avatar URL
 *                       example: "/api/v1/media/avatars/avatar.png"
 *     responses:
 *       201:
 *         description: Chat created successfully
 *       400:
 *         description: Invalid request body or data
 *       401:
 *         description: Unauthorized, no valid token provided
 *       500:
 *         description: Internal server error
 */
export class CreateChatController {

    constructor(private readonly handler: CreateNewChatCommandHandler) {
    }

    /**
    * Creates a new chat.
    * 
    * @param req - The HTTP request object.
    * @param res - The HTTP response object.
    * @returns A response with the status code and the created chat or an error message.
    */
    createChat = asyncHandler(async (req: Request, res: Response) => {
        const command = req.body as CreateNewChatCommand;

        if (!command) {
            res.status(400).json(InvalidBody);
            return;
        }

        const result = await this.handler.execute(command);
        res.status(201).json(result);
    });
}
