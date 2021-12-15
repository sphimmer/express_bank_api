import { Account } from "../db_entities/Account";
import { HttpStatusCodes } from "../helpers/HttpStatusCodes";
import { errorResponse } from "../helpers/responseHelper";
import { IResponse } from "../interfaces/IResponse";
import { ITransferRequestBody } from "../interfaces/ITransfer";
import AccountRepository from "../repositories/AccountRepository";
import TransferRepository from "../repositories/TransferRepository";
import { CreateTransfer } from "../requests/CreateTransfer";

export default class TransferController {
    private acctRepository: AccountRepository
    private transferRepository: TransferRepository

    constructor(transferRepo: TransferRepository, acctRepo: AccountRepository){
        this.acctRepository = acctRepo
        this.transferRepository = transferRepo
    }

    async createTransfer(customerId: string, fromAccountId: string, body: ITransferRequestBody): Promise<IResponse> {
        try {
            const fromAccountIdParsed = parseInt(fromAccountId)
            // verify customer owns from account and it exists
            const fromAccount = await this.acctRepository.findById(fromAccountIdParsed, parseInt(customerId))
            if(!fromAccount){
                return errorResponse(HttpStatusCodes.NOT_FOUND, "Account not found")
            }
            const toAccount = new Account()
            toAccount.id = body.toAccountId

            const transfer = new CreateTransfer(fromAccount, toAccount, body.amount)
            const savedTransfer = await this.transferRepository.save(transfer)
            const updateResultFromAccount = this.acctRepository.updateBalance(savedTransfer.fromAccount, -Math.abs(savedTransfer.amount))
            const updateResultToAccount = this.acctRepository.updateBalance(savedTransfer.toAccount, Math.abs(savedTransfer.amount))
            const results = await Promise.all([updateResultFromAccount, updateResultToAccount])
            return {status: HttpStatusCodes.OK, body: JSON.stringify(results)}
        } catch (error) {
            return errorResponse(HttpStatusCodes.INTERNAL_SERVER_ERROR, error)
        }
    }

    async getTransfers(accountId: string):Promise<IResponse>{
        try {
            const accountIdParsed = parseInt(accountId)
            // verify customer owns from account and it exists
            const transfers = await this.transferRepository.allTransfersForAccount(accountIdParsed)
            if(!transfers){
                return errorResponse(HttpStatusCodes.NOT_FOUND, "Account not found")
            }
            return {status: HttpStatusCodes.OK, body: JSON.stringify(transfers)}
        } catch (error) {
            return errorResponse(HttpStatusCodes.INTERNAL_SERVER_ERROR, error)
        }
    }
}