import { Query } from "../../domain/queries/query";

// Interface for handling queries, which defines the contract for handling specific types of queries.
export interface QueryHandler<T extends Query> {

    /**
     * Executes the given query.
     * 
     * @param q The query object that contains the parameters for the query execution.
     * @returns A Promise that resolves with the result of the query execution.
     */
    execute(q: T): Promise<any>;
}
