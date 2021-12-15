import 'reflect-metadata';
import Container, { Service } from "typedi";
import { Connection, Repository } from "typeorm";
import { Customer } from "../db_entities/Customer";
import { CreateCustomer } from "../requests/CreateCustomer";
import { UpdateCustomer } from '../requests/UpdateCustomer';

@Service()
export default class CustomerRepository {
    private connection: Connection
    private repo: Repository<Customer>
    constructor() {
        this.connection = Container.get('connection');
        this.repo = this.connection.getRepository(Customer);
    }

    async save(customer: CreateCustomer):Promise<Customer>{
        try {
            return await this.repo.save(customer)    
        } catch (error) {
            throw error
        }
    }

    async findById(id: number): Promise<Customer>{
        try {
            return await this.repo.findOne(id)
        } catch (error) {
            console.error(error);
            throw new Error("Error finding customer")
        }
    }

    async update(customer: UpdateCustomer): Promise<Customer>{
        try {
            return await this.repo.save(customer)
        } catch (error) {
            console.error(error);
            throw new Error("Error updating customer")
        }
    }
}