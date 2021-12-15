import { IAccount } from "./IAccount";

export interface ICustomer extends ICustomerWritable{
    id: number
    accounts: IAccount[]
}

export interface ICustomerWritable {
    firstName: string
    lastName: string
    SSN: string
    email: string
}