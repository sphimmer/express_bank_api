import { IsAlphanumeric, IsNumber, Min } from "class-validator";
import faker from "faker";
import { Customer } from "../db_entities/Customer";
import { IAccountWritable } from "../interfaces/IAccount";

export class CreateAccount implements IAccountWritable {

    @IsNumber()
    @Min(5)
    balance: number;

    customer: Customer

    constructor(customer: Customer, initialBalance: number){
        this.balance = initialBalance
        this.customer = customer
    }
    
}