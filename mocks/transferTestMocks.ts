import Container from "typedi"
import { Transfer } from "../src/db_entities/Transfer"
import { CreateTransfer } from "../src/requests/CreateTransfer"
const mockDB: Transfer[] = []

export const mockSave = jest.fn((transfer: CreateTransfer)=>{
    const t = new Transfer()
    t.amount = transfer.amount
    t.fromAccount = transfer.fromAccount
    t.toAccount = transfer.toAccount
    t.id = mockDB.length
    mockDB.push(t)
    return t
})

interface whereClause {
    where: {fromAccount: number}
}

export const mockFind = jest.fn((where: whereClause)=>{
    const transfers = mockDB.filter(t => {
        return t.fromAccount.id == where.where.fromAccount
    })
    return transfers
})


export const mockTransferConnection = () => {
    Container.set('connection', {
        getRepository: jest.fn(() => {
            return {
                save: mockSave,
                find: mockFind,
            }
        })
    })
}