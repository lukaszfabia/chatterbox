import { UserStatus } from "../../domain/models/status";
import { GetUserStatusQuery } from "../../domain/queries/get-user-status.query";
import { IStatusRepository } from "../../domain/repository/status.repository";
import { QueryHandler } from "./query.handler";

export class GetUserStatusQueryHandler implements QueryHandler<GetUserStatusQuery> {

    constructor(private repo: IStatusRepository) { }

    async execute(q: GetUserStatusQuery): Promise<UserStatus | null> {
        return await this.repo.getUserStatus(q.userID)
    }

}