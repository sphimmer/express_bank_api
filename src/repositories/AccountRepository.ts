import 'reflect-metadata';
import Container, { Service } from 'typedi';
import { Connection, Repository } from 'typeorm';
import { Account } from '../db_entities/Account';
import { CreateAccount } from '../requests/CreateAccount';

@Service()
export default class AccountRepository {
    private connection: Connection
    private repo: Repository<Account>
    constructor() {
        this.connection = Container.get('connection');
        this.repo = this.connection.getRepository(Account);
    }

    async save(account: CreateAccount) {
        try {
            return await this.repo.save(account)
        } catch (error) {
            console.error("Error saving account", error)
            throw error
        }
    }

    async findById(accountId: number, customerId: number): Promise<Account> {
        try {
            return await this.repo.findOne(accountId, { where: { customer: { id: customerId } } })
        } catch (error) {
            console.error("Error finding account", error)
            throw error
        }
    }

    async findAccountsByCustomerId(customerId: number): Promise<Account[]> {
        try {
            return await this.repo.find({ where: { customer: { id: customerId } } })
        } catch (error) {
            console.error("Error finding accounts", error)
            throw error
        }
    }

    async deleteAccount(accountId: number): Promise<boolean>{
        try {
            const result = await this.repo.delete(accountId)
            return result.affected > 0 ? true : false
        } catch (error) {
            console.error("Error deleting account", error)
            throw error
        }
    }

    async updateBalance(account: Account, amount: number): Promise<Account>{
        try {
            account = await this.repo.findOne(account.id)
            if(!account){
                throw new Error("Account Not Found")
            }
            const newBalance = account.balance + amount
            account.balance = Math.round(newBalance * 100) / 100
            
            const result = await this.repo.update({id: account.id}, {balance: account.balance})
            if (result.affected){
                return account
            } else {
                return null
            }

        } catch (error) {
            console.error("Error updating account balance", error)
            throw error
        }
    }
}