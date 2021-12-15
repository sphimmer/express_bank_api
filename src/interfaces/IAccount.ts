import { Customer } from "../db_entities/Customer";

export interface IAccount extends IAccountWritable {
    id: number
}
export interface IAccountWritable {
    balance: number
    customer: Customer
}