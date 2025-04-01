import { Request, Response, Router } from "express";
import asyncHandler from "express-async-handler";
import { GetConversationsQueryHandler } from "../application/queries/get-conversations.query.handler";
import { GetConversationsQuery } from "../domain/queries/get-conversations.query";

export class GetConversationsController {
    private readonly router: Router;

    constructor(private readonly handler: GetConversationsQueryHandler) {
        this.router = Router();
        this.initializeRoutes();
    }

    getConversations = asyncHandler(async (req: Request, res: Response) => {
        const query = new GetConversationsQuery();

        const result = await this.handler.execute(query);
        res.status(200).json({ result });
    });

    private initializeRoutes() {
        this.router.get("/", this.getConversations);
    }

    getRoutes() {
        return this.router;
    }
}
