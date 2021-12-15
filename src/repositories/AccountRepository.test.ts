import Container from "typedi";
import { Account } from "../db_entities/Account";
import { Customer } from "../db_entities/Customer";
import { mockAccountConnection, mockSaveAccount } from "../../mocks/accountTestMocks";
import { generateCustomer, mockSave } from "../../mocks/customerTestMocks";
import { CreateAccount } from "../requests/CreateAccount";
import AccountRepository from "./AccountRepository";

describe("Account Repository Tests", () => {
    let repo: AccountRepository;
    beforeAll(() => {
        mockAccountConnection()
        repo = Container.get(AccountRepository)
    })

    it("saves a new account", async () => {
        const customer = mockSave(generateCustomer())
        const account = new CreateAccount(customer, 500.55)
        const savedAccount = await repo.save(account)
        expect(savedAccount.balance).toEqual(500.55)
        expect(savedAccount.customer.id).toBe(customer.id)
        expect(mockSaveAccount).toBeCalledTimes(1)
    })

    describe("when account exists", () => {
        let id: number
        let customer: Customer
        let acct: Account
        const initAmount = 50
        beforeEach(() => {
            customer = mockSave(generateCustomer())
            acct = new Account()
            acct.customer = customer
            acct.balance = initAmount
            acct = mockSaveAccount(acct)
        })

        it("finds account by account id", async () => {
            const result = await repo.findById(acct.id, customer.id)
            expect(result.id).toBe(acct.id)
        })

        it("finds all accounts with the customer id", async () => {
            const result = await repo.findAccountsByCustomerId(customer.id)
            result.map(a => {
                expect(a.balance).toBeDefined()
                expect(a.id).toBeDefined()
            })
        })

        it("deletes account", async () => {
            const result = await repo.deleteAccount(acct.id)
            expect(result).toBeTruthy()
        })

        it("updates balance",async () => {
            const result = await repo.updateBalance(acct, 50)
            expect(result.balance).toBe(initAmount + 50)
        })

    })
})