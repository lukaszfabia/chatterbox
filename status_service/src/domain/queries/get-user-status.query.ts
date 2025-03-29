import { Query } from "./query";

export class GetUserStatusQuery implements Query {
    constructor(public readonly userID: string) { }
}