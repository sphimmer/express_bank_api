import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ITransfer } from "../interfaces/ITransfer";
import { Account } from "./Account";
@Entity()
export class Transfer implements ITransfer {
    @PrimaryGeneratedColumn()
    id:number

    @ManyToOne(() => Account, (a) => a.transferOut)
    fromAccount: Account;
    @ManyToOne(() => Account, (a) => a.transferIn)
    toAccount: Account;
    @Column({type: "float"})
    amount: number;
}