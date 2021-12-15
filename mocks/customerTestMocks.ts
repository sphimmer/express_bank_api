import faker from "faker"
import Container from "typedi"
import { DeleteResult } from "typeorm"
import { Customer } from "../src/db_entities/Customer"
import { ICustomerWritable } from "../src/interfaces/ICustomer"

export const mockSave = jest.fn((c: Partial<Customer>): Customer => {
    if(c.id >= 0){
        const customer = mockDB[c.id]
        customer.SSN = c.SSN ? c.SSN : customer.SSN
        customer.firstName = c.firstName ? c.firstName : customer.firstName
        customer.lastName = c.lastName ? c.lastName : customer.lastName
        customer.email = c.email ? c.email : customer.email
        mockDB[c.id] = customer
        return customer
    } else {
        const nc = new Customer()
        nc.SSN = c.SSN
        nc.email = c.email
        nc.firstName = c.firstName
        nc.lastName = c.lastName
        nc.id = mockDB.length
        mockDB.push(nc)
        return nc
    }
})

export const mockFind = jest.fn((id: number): Customer => {
    return mockDB[id]
})

export const generateCustomer = (options?: Partial<Customer>): Customer => {
    const customer = new Customer()
    customer.firstName = options?.firstName || faker.name.firstName()
    customer.lastName = options?.lastName || faker.name.lastName()
    customer.email = options?.email || faker.internet.email()
    customer.SSN = options?.SSN || faker.random.alphaNumeric(11)
    return customer
}

export const generateNewCustomerWritable = (): ICustomerWritable => {
    return {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        SSN: faker.random.alphaNumeric(11)
    }
}

export const mockCustomerConnection = () => {
    Container.set('connection', {
        getRepository: jest.fn(() => {
            return {
                save: mockSave,
                findOne: mockFind,
            }
        })
    })
}

const mockDB: Customer[] = []