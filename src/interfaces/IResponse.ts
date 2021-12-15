import { HttpStatusCodes } from "../helpers/HttpStatusCodes";

export interface IResponse {
    status: HttpStatusCodes
    body?: string
}