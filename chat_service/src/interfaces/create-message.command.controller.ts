import { Request, Response } from "express";
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
