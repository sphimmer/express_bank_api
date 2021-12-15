import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ICustomer } from "../interfaces/ICustomer";
import { Account } from "./Account";

@Entity()
export class Customer implements ICustomer{
    @PrimaryGeneratedColumn()
    id: number
    
    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @OneToMany(type => Account, account => account.customer, {cascade: true, onDelete: "CASCADE"})
    accounts: Account[]

    @Column()
    SSN: string

    @Column()
    email: string;
}