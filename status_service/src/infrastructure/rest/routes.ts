import express from 'express';
import { GetUserStatusController } from '../../interfaces/get-user-status.controller';
import { GetUserStatusQueryHandler } from '../../application/queries/get-user-status-query.handler';
import { IStatusRepository } from '../../domain/repository/status.repository';

export class Router {
    private repo: IStatusRepository
    constructor(repo: IStatusRepository) {
        this.repo = repo
    }

    config() {
        const router = express.Router();
        const handler = new GetUserStatusQueryHandler(this.repo)
        const userStatusController = new GetUserStatusController(handler)
        router.get("/status", userStatusController.getStatus.bind(userStatusController))


        return router
    }

}