import { Request, Response, Router } from "express";
import { CreateMessageCommandHandler } from "../application/commands/create-message.command.handler";
import { CreateMessageCommand } from "../domain/command/create-message.command";
import asyncHandler from "express-async-handler";
import { InvalidBody } from "./errors";

export class CreateMessageController {
    private readonly router: Router;

    constructor(
        private readonly handler: CreateMessageCommandHandler
    ) {
        this.router = Router();
        this.initializeRoutes();
    }

    createMessage = asyncHandler(async (req: Request, res: Response) => {
        const command = req.body as CreateMessageCommand;

        if (!command) {
            res.status(400).json(InvalidBody);
            return;
        }

        const result = await this.handler.execute(command);
        res.status(201).json({ result });
        return;
    });

    private initializeRoutes() {
        this.router.post("/message", this.createMessage);
    }

    getRoutes() {
        return this.router;
    }
}
