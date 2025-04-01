import { Request, Response, Router } from "express";
import asyncHandler from "express-async-handler";
import { CreateNewChatCommandHandler } from "../application/commands/create-new-chat.command.handler";
import { CreateNewChatCommand } from "../domain/command/create-new-chat.command";
import { InvalidBody } from "./errors";

export class CreateChatController {
    private readonly router: Router;

    constructor(private readonly handler: CreateNewChatCommandHandler) {
        this.router = Router();
        this.initializeRoutes();
    }

    createChat = asyncHandler(async (req: Request, res: Response) => {
        const command = req.body as CreateNewChatCommand;

        if (!command) {
            res.status(400).json(InvalidBody);
            return;
        }

        const result = await this.handler.execute(command);
        res.status(201).json({ result });
    });

    private initializeRoutes() {
        this.router.post("/chat", this.createChat);
    }

    getRoutes() {
        return this.router;
    }
}
