import { Account } from "../db_entities/Account";

export interface ITransfer extends ITransferWritable{
    id: number
}
export interface ITransferWritable {
    fromAccount: Account
    toAccount: Account
    amount: number
}

export interface ITransferRequestBody{
    toAccountId: number
    amount: number
}