import { Request, Response, Router } from "express";
import asyncHandler from "express-async-handler";
import { CreateNewChatCommandHandler } from "../application/commands/create-new-chat.command.handler";
import { CreateNewChatCommand } from "../domain/command/create-new-chat.command";
import { InvalidBody } from "./errors";

export class CreateChatController {

    constructor(private readonly handler: CreateNewChatCommandHandler) {
    }

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
