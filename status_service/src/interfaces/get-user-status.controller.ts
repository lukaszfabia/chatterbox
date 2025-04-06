import { GetUserStatusQueryHandler } from "../application/queries/get-user-status.query.handler";
import { GetUserStatusQuery } from "../domain/queries/get-user-status.query";
import { Request, Response } from "express";

export class GetUserStatusController {
    constructor(private readonly queryHandler: GetUserStatusQueryHandler) { }

    async getStatus(req: Request, res: Response): Promise<Response> {
        try {
            const id = req.params.id

            if (!id) {
                return res.status(400).json({ error: "Invalid body" });
            }

            const query: GetUserStatusQuery = { userID: id }
            const status = await this.queryHandler.execute(query);

            return res.status(200).json(status);
        } catch (error) {
            console.error("Error in getStatus:", error);
            return res.status(404).json({ error: "Not found" });
        }
    }

}