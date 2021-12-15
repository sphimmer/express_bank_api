import { isArray } from "class-validator"
import { IResponse } from "../interfaces/IResponse"
import { HttpStatusCodes } from "./HttpStatusCodes"

export const errorResponse = (statusCode: HttpStatusCodes, error: any): IResponse => {
    let body: string
    if(isArray(error)){
        body = JSON.stringify(error)
    } else {
        body = JSON.stringify({ errors: [error] })
    }
    return { status: statusCode, body: body }
}
