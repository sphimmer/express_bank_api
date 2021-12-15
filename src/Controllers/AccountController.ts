import 'reflect-metadata'
import { validate } from "class-validator"
import { Customer } from "../db_entities/Customer"
import { HttpStatusCodes } from "../helpers/HttpStatusCodes"
import { errorResponse } from "../helpers/responseHelper"
import { IAccountWritable } from "../interfaces/IAccount"
import { IResponse } from "../interfaces/IResponse"
import AccountRepository from "../repositories/AccountRepository"
import { CreateAccount } from "../requests/CreateAccount"
import CustomerRepository from '../repositories/CustomerRepository'

export default class AccountController {
    private repository: AccountRepository

    constructor(repo: AccountRepository) {
        this.repository = repo
        
    }

    async createAccount(customerId: string, request: Partial<IAccountWritable>): Promise<IResponse> {
        try {
            const customer = new Customer()
            customer.id = parseInt(customerId)
            const newAccount = new CreateAccount(customer, request.balance)
            const errors = await validate(newAccount)
            if (errors.length > 0) {
                return errorResponse(HttpStatusCodes.BAD_REQUEST, errors)
            }
            const savedAccount = await this.repository.save(newAccount)
            return { status: HttpStatusCodes.OK, body: JSON.stringify(savedAccount) }
        } catch (error) {
            return errorResponse(HttpStatusCodes.INTERNAL_SERVER_ERROR, error)
        }
    }

    async getAccount(customerId: string, accountId: string): Promise<IResponse> {
        try {
            const custId = parseInt(customerId)
            const acctId = parseInt(accountId)
            const account = await this.repository.findById(acctId, custId)
            if (account) {
                return { status: HttpStatusCodes.OK, body: JSON.stringify(account) }
            } else {
                return errorResponse(HttpStatusCodes.NOT_FOUND, 'account not found')
            }
        } catch (error) {
            return errorResponse(HttpStatusCodes.INTERNAL_SERVER_ERROR, error)
        }
    }

    async getAccounts(customerId: string): Promise<IResponse> {
        try {
            const custId = parseInt(customerId)
            const accounts = await this.repository.findAccountsByCustomerId(custId)
            if (accounts) {
                return { status: HttpStatusCodes.OK, body: JSON.stringify(accounts) }
            } else {
                return errorResponse(HttpStatusCodes.NOT_FOUND, 'account not found')
            }
        } catch (error) {
            return errorResponse(HttpStatusCodes.INTERNAL_SERVER_ERROR, error)
        }
    }

    async deleteAccount(customerId: string, accountId: string): Promise<IResponse> {
        try {
            const custId = parseInt(customerId)
            const acctId = parseInt(accountId)
            const account = await this.repository.findById(acctId, custId)
            if (account) {
                const isDeleted = await this.repository.deleteAccount(acctId)
                if (isDeleted) {
                    return { status: HttpStatusCodes.OK }
                }
            } else {
                return errorResponse(HttpStatusCodes.NOT_FOUND, 'account not found')
            }
        } catch (error) {
            return errorResponse(HttpStatusCodes.INTERNAL_SERVER_ERROR, error)
        }
    }
}