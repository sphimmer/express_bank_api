import Container, { Service } from "typedi";
import { Connection, Repository } from "typeorm";
import { Transfer } from "../db_entities/Transfer";
import { CreateTransfer } from "../requests/CreateTransfer";

@Service()
export default class TransferRepository {
    private connection: Connection
    private repo: Repository<Transfer>
    constructor() {
        this.connection = Container.get('connection');
        this.repo = this.connection.getRepository(Transfer);
    }

    async save(transfer: CreateTransfer): Promise<Transfer> {
        try {
            return await this.repo.save(transfer)
        } catch (error) {
            console.error("Error saving transfer")
            throw new Error("Error saving transfer")
        }
    }

    async allTransfersForAccount(accountId: number): Promise<Transfer[]>{
        try {
            return await this.repo.find({where: {fromAccount: accountId}, relations: ['toAccount']})
        } catch (error) {
            console.error("Error finder transfers")
            throw new Error("Error finder transfers")
        }
    }
}