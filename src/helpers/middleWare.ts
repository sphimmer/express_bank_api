import { NextFunction, Request, Response } from "express"
import Container from "typedi"
import CustomerRepository from "../repositories/CustomerRepository"
import { HttpStatusCodes } from "./HttpStatusCodes"

export const validateCustomer = async (req: Request, res: Response, next: NextFunction)=> {
    const customerId = parseInt(req.params.id)
    const custRepo = Container.get(CustomerRepository)
    const customer = await custRepo.findById(customerId)
    if(customer){
        next()
    } else {
        res.status(HttpStatusCodes.NOT_FOUND).send({errors: ['Customer Not Found']})
    }
}