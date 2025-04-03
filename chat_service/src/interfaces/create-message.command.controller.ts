import { Request, Response, Router } from "express";
import { CreateMessageCommandHandler } from "../application/commands/create-message.command.handler";
import { CreateMessageCommand } from "../domain/command/create-message.command";
import asyncHandler from "express-async-handler";
import { InvalidBody } from "./errors";

export class CreateMessageController {
    constructor(
        private readonly handler: CreateMessageCommandHandler
    ) {
    }

    createMessage = asyncHandler(async (req: Request, res: Response) => {
        const command = req.body as CreateMessageCommand;

        if (!command) {
            res.status(400).json(InvalidBody);
            return;
        }

        const result = await this.handler.execute(command);
        if (!result) {
            res.status(400).json(InvalidBody);
            return;
        }

        res.status(201).json(result);
    });

}
