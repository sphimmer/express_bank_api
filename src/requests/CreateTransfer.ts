import { IsNumber, Min } from "class-validator";
import { Account } from "../db_entities/Account";
import { ITransferWritable } from "../interfaces/ITransfer";

export class CreateTransfer implements ITransferWritable {
    
    fromAccount: Account;
    toAccount: Account;
    
    @IsNumber()
    @Min(0.01)
    amount: number;

    constructor(fromAccount: Account, toAccount: Account, amount: number){
        this.fromAccount = fromAccount
        this.toAccount = toAccount
        this.amount = amount

    }
}