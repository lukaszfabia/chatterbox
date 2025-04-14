import { UserStatus } from "../../domain/models/status";
import { Query } from "../../domain/queries/query";

/**
 * QueryHandler is a generic interface for handling queries in the system.
 * Each query handler is responsible for executing a specific query and returning a result.
 */
export interface QueryHandler<T extends Query> {
    /**
     * Executes the given query and returns the result.
     * 
     * @param q - The query to be executed.
     * @returns A promise that resolves to the result of the query, or null if no result is found.
     */
    execute(q: T): Promise<UserStatus | null>;
}
