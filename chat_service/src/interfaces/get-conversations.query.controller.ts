import { Response } from "express";
import asyncHandler from "express-async-handler";
import { GetConversationsQueryHandler } from "../application/queries/get-conversations.query.handler";
import { GetConversationsQuery } from "../domain/queries/get-conversations.query";
import { AuthRequest } from "../infrastructure/jwt/jwt.middleware";

export class GetConversationsController {
    constructor(private readonly handler: GetConversationsQueryHandler) {
    }

    getConversations = asyncHandler(async (req: AuthRequest, res: Response) => {
        const query = new GetConversationsQuery(req.userID!);
        const result = await this.handler.execute(query);
        res.status(200).json(result);
    });
}
