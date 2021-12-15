import Container from "typedi"
import { DeleteResult, UpdateResult } from "typeorm"
import { Account } from "../src/db_entities/Account"

const mockDB: Account[] = []

export const mockSaveAccount = jest.fn((acc: Partial<Account>): Account => {
    
    const account = new Account()
    account.balance = acc.balance
    account.customer = acc.customer
   
    account.id = mockDB.length
    mockDB.push(account)
  
    return account
})

export const mockFindAccount = jest.fn((accountId: number, _?: any): Account => {
    return mockDB[accountId]
})

export const mockFindAccounts = jest.fn((customerId: number): Account[] => {
    const accounts = mockDB.filter(acct => {
        return acct.customer.id == customerId
    })
    return accounts
})

export const mockDeleteAccount = jest.fn((id: number): DeleteResult => {
    mockDB[id] = null
    return { affected: 1, raw: null }
})

export const updateBalance = jest.fn((accountId: Partial<Account>, updateAcct: Partial<Account>): UpdateResult => {
    mockDB[accountId.id].balance = updateAcct.balance
    return {affected: 1, raw: null, generatedMaps: []}
})

export const mockAccountConnection = () => {
    Container.set('connection', {
        getRepository: jest.fn(() => {
            return {
                save: mockSaveAccount,
                findOne: mockFindAccount,
                find: mockFindAccounts,
                delete: mockDeleteAccount,
                update: updateBalance
            }
        })
    })
}