import Container from "typedi";
import TransferRepository from "./TransferRepository";
import { mockTransferConnection } from "../../mocks/transferTestMocks"
import { Account } from "../db_entities/Account";
import { Customer } from "../db_entities/Customer";
import { generateCustomer } from "../../mocks/customerTestMocks";
import { CreateTransfer } from "../requests/CreateTransfer";

describe("Transfer Repository Tests", () => {
    let repo: TransferRepository;
    let customer: Customer
    let acct, acct2: Account
    const initAmount = 50
    beforeAll(() => {
        mockTransferConnection()
        repo = Container.get(TransferRepository)
        customer = generateCustomer()
        customer.id = 1

        acct = new Account()
        acct.customer = customer
        acct.balance = initAmount
        acct.id = 1

        acct2 = new Account()
        acct2.customer = customer
        acct2.balance = initAmount
        acct2.id = 2
    })

    it("saves a new transfer", async () => {
        const transfer = new CreateTransfer(acct, acct2, 5)
        const result = await repo.save(transfer)
        expect(result.amount).toBe(5)
        expect(result.fromAccount).toMatchObject(acct)
        expect(result.toAccount).toMatchObject(acct2)
        expect(result.id).toBeDefined
    })

    it("gets all transfer for the account", async () => {
        const transfer = new CreateTransfer(acct2, acct, 25)
        await repo.save(transfer)
        await repo.save(transfer)
        const result = await repo.allTransfersForAccount(acct2.id)
        expect(result.length).toBeGreaterThanOrEqual(2)
        result.map(t => {
            expect(t.amount).toBe(25)
            expect(t.fromAccount).toMatchObject(acct2)
            expect(t.toAccount).toMatchObject(acct)
        })
    })
})