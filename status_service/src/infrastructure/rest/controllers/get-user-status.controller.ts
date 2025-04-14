import { GetUserStatusQueryHandler } from "../../../application/queries/get-user-status.query.handler";
import { GetUserStatusQuery } from "../../../domain/queries/get-user-status.query";
import { Request, Response } from "express";

/**
 * Controller that handles the retrieval of a user's status.
 */
export class GetUserStatusController {
    constructor(private readonly queryHandler: GetUserStatusQueryHandler) { }

    /**
     * Handles the HTTP GET request to retrieve a user's status.
     * 
     * @param req - The Express request object, containing the parameters of the request.
     * @param res - The Express response object, used to send a response back to the client.
     * @returns A response containing the user's status or an error message.
     */
    async getStatus(req: Request, res: Response): Promise<Response> {
        try {
            const id = req.params.id; // Get the user ID from the request parameters

            // Validate the user ID
            if (!id) {
                return res.status(400).json({ error: "Invalid body" });
            }

            // Create the GetUserStatusQuery object
            const query: GetUserStatusQuery = { userID: id };

            // Execute the query using the query handler
            const status = await this.queryHandler.execute(query);

            // Return the user's status in the response
            return res.status(200).json(status);
        } catch (error) {
            // Handle any errors that occur during the execution
            console.error("Error in getStatus:", error);
            return res.status(404).json({ error: "Not found" });
        }
    }
}
