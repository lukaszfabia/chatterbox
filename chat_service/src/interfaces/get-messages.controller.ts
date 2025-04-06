import { Response } from "express";
import asyncHandler from "express-async-handler";
import { AuthRequest } from "../infrastructure/jwt/jwt.middleware";
import { GetMessagesQuery } from "../domain/queries/get-messages.query";
import { GetMessagesQueryHandler } from "../application/queries/get-messages.query.handler";

export class GetMessagesController {
    constructor(private readonly handler: GetMessagesQueryHandler) {
    }

    getMessages = asyncHandler(async (req: AuthRequest, res: Response) => {

        const { chatID } = req.params;

        if (!chatID) {
            res.status(400);
            return
        }

        console.log("Retriving messages for ", chatID)
        const query: GetMessagesQuery = {
            chatID: chatID
        }

        const result = await this.handler.execute(query);
        res.status(200).json(result);
    });
}
