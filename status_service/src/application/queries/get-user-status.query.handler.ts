import { UserStatus } from "../../domain/models/status";
import { GetUserStatusQuery } from "../../domain/queries/get-user-status.query";
import { IStatusRepository } from "../../domain/repository/status.repository";
import { QueryHandler } from "./query.handler";

/**
 * GetUserStatusQueryHandler handles the GetUserStatusQuery.
 * It retrieves the status (online/offline) of a user from the repository.
 */
export class GetUserStatusQueryHandler implements QueryHandler<GetUserStatusQuery> {

    /**
     * Constructs a new GetUserStatusQueryHandler with the given status repository.
     * 
     * @param repo - The status repository used to retrieve the user's status.
     */
    constructor(private readonly repo: IStatusRepository) { }

    /**
     * Executes the GetUserStatusQuery to retrieve the status of a user.
     * 
     * @param q - The query containing the user ID for which to retrieve the status.
     * @returns The user's status if found, or null if the status does not exist.
     */
    async execute(q: GetUserStatusQuery): Promise<UserStatus | null> {
        return await this.repo.getUserStatus(q.userID);
    }
}
