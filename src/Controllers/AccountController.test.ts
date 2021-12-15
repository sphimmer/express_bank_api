import Container from "typedi";
import { Account } from "../db_entities/Account";
import { Customer } from "../db_entities/Customer";
import { mockAccountConnection, mockSaveAccount } from "../../mocks/accountTestMocks";
import { generateCustomer, mockSave } from "../../mocks/customerTestMocks";
import { HttpStatusCodes } from "../helpers/HttpStatusCodes";
import AccountRepository from "../repositories/AccountRepository";
import AccountController from "./AccountController";

describe("Account Controller", () => {
    let repo: AccountRepository;
    let controller: AccountController
    let customer: Customer
    beforeAll(() => {
        mockAccountConnection()
        repo = Container.get(AccountRepository)
        controller = new AccountController(repo)
        customer = mockSave(generateCustomer())
    })
    afterEach(() => {
        jest.restoreAllMocks()
    })
    describe("Create Account", () => {
        it("creates an account", async () => {

            const response = await controller.createAccount(customer.id.toString(), { balance: 500.24 });
            expect(response.status).toBe(HttpStatusCodes.OK)
            const account = JSON.parse(response.body)
            expect(account.balance).toBe(500.24)
            expect(account.customer.id).toBe(customer.id)
        })

        it("return 400 bad request when initial balance is not enough", async () => {

            const response = await controller.createAccount(customer.id.toString(), { balance: 3 });
            expect(response.status).toBe(HttpStatusCodes.BAD_REQUEST)
            const errors = JSON.parse(response.body)
            expect(errors[0].property).toBe("balance")
            expect(errors[0].constraints.min).toBeDefined()
        })
    })

    describe("when account exists", () => {
        let account: Account
        beforeEach(() => {
            account = mockSaveAccount({ balance: 50, customer: customer })
        })
        it("gets an account by its id when exists", async () => {
            const response = await controller.getAccount(customer.id.toString(), account.id.toString())
            expect(response.status).toBe(HttpStatusCodes.OK)
            const repsonseAccount = JSON.parse(response.body) as Account
            expect(repsonseAccount.balance).toBeDefined()
            expect(repsonseAccount.id).toBe(account.id)
        })

        it("gets all accounts by customer id when exists", async () => {
            const response = await controller.getAccounts(customer.id.toString())
            expect(response.status).toBe(HttpStatusCodes.OK)
            const repsonseAccount = JSON.parse(response.body) as Account[]
            repsonseAccount.map(acct => {
                expect(acct.balance).toBeDefined()
            })
        })
    })
})