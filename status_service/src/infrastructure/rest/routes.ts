import express from 'express';
import { GetUserStatusController } from './controllers/get-user-status.controller';
import { IStatusRepository } from '../../domain/repository/status.repository';
import { GetUserStatusQueryHandler } from '../../application/queries/get-user-status.query.handler'


export class Router {
    constructor(private repo: IStatusRepository) { }

    /**
     * Configures the routes for the Express application.
     */
    config() {
        const router = express.Router();
        const handler = new GetUserStatusQueryHandler(this.repo);

        const userStatusController = new GetUserStatusController(handler);

        /**
         * @swagger
         * /api/v1/status/check/{id}:
         *   get:
         *     summary: Get users status by user id  
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: OK
         *       400:
         *         description: Bad Request 
         *       404:
         *         description: Not Found 
         */
        router.get("/check/:id", userStatusController.getStatus.bind(userStatusController));

        return router;
    }
}
