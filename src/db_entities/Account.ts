import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { IAccount } from "../interfaces/IAccount";
import { Customer } from "./Customer";
import { Transfer } from "./Transfer";


@Entity()
export class Account implements IAccount{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "float"})
    balance: number;

    @ManyToOne((type) => Customer, (customer) => customer.accounts)
    customer: Customer;
    
    @OneToMany(() => Transfer, (t) => t.fromAccount, {onDelete: "CASCADE"})
    transferOut?: Transfer[]
    @OneToMany(() => Transfer, (t) => t.toAccount, {onDelete: "CASCADE"})
    transferIn?: Transfer[]

}