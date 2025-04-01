import express from 'express';
import { GetUserStatusController } from '../../interfaces/get-user-status.controller';
import { IStatusRepository } from '../../domain/repository/status.repository';
import { GetUserStatusQueryHandler } from '../../application/queries/get-user-status.query.handler'

export class Router {
    constructor(private repo: IStatusRepository) {
    }

    config() {
        const router = express.Router();
        const handler = new GetUserStatusQueryHandler(this.repo)
        const userStatusController = new GetUserStatusController(handler)
        router.get("/status", userStatusController.getStatus.bind(userStatusController))


        return router
    }

}