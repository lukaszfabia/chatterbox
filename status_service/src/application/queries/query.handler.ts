import { Query } from "../../domain/queries/query";

export interface QueryHandler<T extends Query> {
    execute(q: Query)
}