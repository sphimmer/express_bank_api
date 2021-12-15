import Container from "typedi";
import { mockAccountConnection, mockSaveAccount } from "../../mocks/accountTestMocks";
import { generateCustomer, mockSave } from "../../mocks/customerTestMocks";
import { mockTransferConnection } from "../../mocks/transferTestMocks";
import { Account } from "../db_entities/Account";
import { Customer } from "../db_entities/Customer";
import { Transfer } from "../db_entities/Transfer";
import { HttpStatusCodes } from "../helpers/HttpStatusCodes";
import AccountRepository from "../repositories/AccountRepository";
import TransferRepository from "../repositories/TransferRepository";
import TransferController from "./TransferController";


describe("Transfer Controller", () => {
    let repo: TransferRepository
    let acctRepo: AccountRepository
    let controller: TransferController
    let customer: Customer
    let acct, acct2: Account
    const initAmount = 50
    beforeAll(() => {
        mockAccountConnection()
        acctRepo = Container.get(AccountRepository)

        mockTransferConnection()
        repo = Container.get(TransferRepository)

        controller = new TransferController(repo, acctRepo)
        customer = mockSave(generateCustomer())

        acct = new Account()
        acct.customer = customer
        acct.balance = initAmount
        acct = mockSaveAccount(acct)

        acct2 = new Account()
        acct2.customer = customer
        acct2.balance = initAmount
        acct2 = mockSaveAccount(acct2)
    })

    it("creates a new transfer", async ()=>{
        const result = await controller.createTransfer(customer.id.toString(), acct.id.toString(), {amount: 25, toAccountId: acct2.id})
        expect(result.status).toBe(HttpStatusCodes.OK)
        const body = JSON.parse(result.body) as Account[]
        expect(body[0].balance).toBe(25)
        expect(body[1].balance).toBe(75)
    })

    it("gets all transfer for account", async ()=>{
        await controller.createTransfer(customer.id.toString(), acct2.id.toString(), {amount: 15, toAccountId: acct.id})
        const result = await controller.getTransfers(acct2.id.toString())
        expect(result.status).toBe(HttpStatusCodes.OK)
        const body = JSON.parse(result.body) as Transfer[]
        body.map(t => {
            expect(t.amount).toBe(15)
            expect(t.fromAccount.id).toBe(acct2.id)
            expect(t.toAccount.id).toBe(acct.id)
        })
    })
})