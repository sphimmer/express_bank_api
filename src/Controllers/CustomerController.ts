import { validate } from 'class-validator'
import 'reflect-metadata'
import { HttpStatusCodes } from '../helpers/HttpStatusCodes'
import { errorResponse } from '../helpers/responseHelper'
import { ICustomerWritable } from '../interfaces/ICustomer'
import { IResponse } from '../interfaces/IResponse'
import CustomerRepository from '../repositories/CustomerRepository'
import { CreateCustomer } from '../requests/CreateCustomer'
import { UpdateCustomer } from '../requests/UpdateCustomer'

export default class CustomerController{
    private repository: CustomerRepository
    constructor(repo: CustomerRepository) {
        this.repository = repo
    }
    async createCustomer(body: ICustomerWritable): Promise<IResponse> {
        try {
            const newCustomer = new CreateCustomer(body)

            const errors = await validate(newCustomer)
            if (errors.length > 0) {
                return errorResponse(HttpStatusCodes.BAD_REQUEST, errors)
            }
            const savedCustomer = await this.repository.save(newCustomer)
            return { status: HttpStatusCodes.OK, body: JSON.stringify(savedCustomer) }
        } catch (error) {
            return errorResponse(HttpStatusCodes.INTERNAL_SERVER_ERROR, error)
        }
    }

    async getCustomer(id: string): Promise<IResponse> {
        try {
            const numId = parseInt(id)
            const customer = await this.repository.findById(numId)
            if (customer) {
                return { status: HttpStatusCodes.OK, body: JSON.stringify(customer) }
            } else {
                return errorResponse(HttpStatusCodes.NOT_FOUND, `Customer with id ${id} not found`)
            }
        } catch (error) {
            return errorResponse(HttpStatusCodes.INTERNAL_SERVER_ERROR, error)
        }
    }

    async updateCustomer(id: string, body: Partial<ICustomerWritable>): Promise<IResponse> {
        try {
            const updateCustomer = new UpdateCustomer(parseInt(id), body)

            const errors = await validate(updateCustomer)
            if (errors.length > 0) {
                return errorResponse(HttpStatusCodes.BAD_REQUEST, errors)
            }
            const savedCustomer = await this.repository.update(updateCustomer)
            return { status: HttpStatusCodes.OK, body: JSON.stringify(savedCustomer) }
        } catch (error) {
            return errorResponse(HttpStatusCodes.INTERNAL_SERVER_ERROR, error)

        }
    }
}