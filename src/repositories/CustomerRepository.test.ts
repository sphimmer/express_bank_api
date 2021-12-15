import Container from "typedi";
import { Customer } from "../db_entities/Customer";
import { generateCustomer, mockCustomerConnection, mockFind, mockSave } from "../../mocks/customerTestMocks"
import { CreateCustomer } from "../requests/CreateCustomer";
import { UpdateCustomer } from "../requests/UpdateCustomer";
import CustomerRepository from "./CustomerRepository";

describe("Customer Repository Tests", () => {
    let repo: CustomerRepository;
    beforeAll(() => {
        mockCustomerConnection()
        repo = Container.get(CustomerRepository)
    })

    it("saves a new customer", async () => {
        const customer = new CreateCustomer({ firstName: "bob", lastName: "timmons", email: "bt@gmail.com", SSN: "123-45-6789" })
        const savedCustomer = await repo.save(customer)
        expect(savedCustomer.email).toEqual(customer.email)
        expect(savedCustomer.id).toBeDefined()
        expect(mockSave).toBeCalledTimes(1)
    })
    describe("when customer exists", () => {
        let id: number
        let customer: Customer;
        beforeEach(()=>{
            const c = generateCustomer()
            customer = mockSave(c)
            id = customer.id
            mockSave.mockClear()
        })
        it("finds an existing customer", async () => {
            const customer = await repo.findById(id)
            expect(customer.id).toBe(id)
            expect(mockFind).toBeCalledTimes(1)
        })

        it("updates an existing customer", async () => {
            const updateCustomer = new UpdateCustomer(id, { firstName: "bob" })
            const update = await repo.update(updateCustomer)
            expect(update.firstName).toEqual(updateCustomer.firstName)
            expect(update.email).toBe(customer.email)
            expect(update.id).toBe(id)
            expect(mockSave).toBeCalledTimes(1)
        })
    })
})