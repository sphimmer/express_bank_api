import Container from "typedi"
import { Customer } from "../db_entities/Customer"
import { generateCustomer, generateNewCustomerWritable, mockCustomerConnection, mockSave } from "../../mocks/customerTestMocks"
import { HttpStatusCodes } from "../helpers/HttpStatusCodes"
import CustomerRepository from "../repositories/CustomerRepository"
import { CreateCustomer } from "../requests/CreateCustomer"
import CustomerController from "./CustomerController"


describe("Customer Controller", () => {
    describe("Create Customer", () => {
        let repo;
        beforeAll(() => {
            mockCustomerConnection()
            repo = Container.get(CustomerRepository)

            jest.spyOn(repo, 'save').mockImplementation(async (nc: CreateCustomer): Promise<Customer> => {
                return mockSave(nc)
            })
        })

        afterEach(() => {
            jest.restoreAllMocks()

        })

        it("creates a new customer", async () => {
            const controller = new CustomerController(repo)
            const customer = generateNewCustomerWritable()
            const response = await controller.createCustomer(customer)
            expect(response.status).toBe(200)
            const newCustomer = JSON.parse(response.body) as Customer
            expect(newCustomer.firstName).toBe(customer.firstName)
            expect(newCustomer.id).toBeDefined()
            expect(repo.save).toBeCalledTimes(1)
        })

        it("returns 400 bad request when data is invalid", async () => {
            const controller = new CustomerController(repo)
            const customer = generateNewCustomerWritable()
            customer.firstName = undefined
            const response = await controller.createCustomer(customer)
            expect(response.status).toBe(400)
            const errors = JSON.parse(response.body)
            expect(errors[0].property).toBe("firstName")
            expect(errors[0].constraints.isAlpha).toBeDefined()
        })
    })

    describe("Get Customer", () => {
        let repo: CustomerRepository
        let customer: Customer
        let controller: CustomerController
        beforeAll(() => {
            mockCustomerConnection()
            repo = Container.get(CustomerRepository)
            customer = mockSave(generateCustomer())
            controller = new CustomerController(repo)
        })

        it("finds customer by id", async () => {
            const c = await controller.getCustomer(customer.id.toString())
            expect(c.status).toBe(HttpStatusCodes.OK)
            expect(JSON.parse(c.body)).toMatchObject(customer)
        })

        it("give 404 not found status when customer not found", async () => {
            const c = await controller.getCustomer("10")
            expect(c.status).toBe(HttpStatusCodes.NOT_FOUND)
            const errorBody = JSON.parse(c.body)
            expect(errorBody.errors).toHaveLength(1)

        })
    })

})