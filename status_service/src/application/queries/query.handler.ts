import { Query } from "../../domain/queries/query";

export interface QuertyHandler<T extends Query> {
    execute(q: Query)
}