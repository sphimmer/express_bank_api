import { Request, Response, Router } from "express";
import AccountController from "./Controllers/AccountController";
import CustomerController from "./Controllers/CustomerController";
import TransferController from "./Controllers/TransferController";
import { validateCustomer } from "./helpers/middleWare";


export default class Routes {
    router: Router
    private accounts: AccountController
    private customers: CustomerController
    private transfers: TransferController

    constructor(accounts: AccountController, customers: CustomerController, transfers: TransferController){
        this.router = Router()
        this.accounts = accounts
        this.customers = customers
        this.transfers = transfers
        this.configure() 
    }

    private configure() {
        // Customers
        this.router.post("/customers", async (req: Request, res: Response) => {
            const response = await this.customers.createCustomer(req.body)
            res.status(response.status).send(response.body)
        });
        this.router.get("/customers/:id", async (req: Request, res: Response) => {
            const response = await this.customers.getCustomer(req.params.id)
            res.status(response.status).send(response.body)
        })

        this.router.put("/customers/:id", validateCustomer, async (req: Request, res: Response) => {
            const response = await this.customers.updateCustomer(req.params.id, req.body)
            res.status(response.status).send(response.body)
        })
        // Accounts
        this.router.post("/customers/:id/accounts", validateCustomer, async (req: Request, res: Response) => {
            const response = await this.accounts.createAccount(req.params.id, req.body)
            res.status(response.status).send(response.body)
        });

        this.router.get("/customers/:id/accounts/:accountId", validateCustomer, async (req: Request, res: Response) => {
            const response = await this.accounts.getAccount(req.params.id, req.params.accountId)
            res.status(response.status).send(response.body)
        });
        this.router.get("/customers/:id/accounts", validateCustomer, async (req: Request, res: Response) => {
            const response = await this.accounts.getAccounts(req.params.id)
            res.status(response.status).send(response.body)
        });

        this.router.post("/customers/:id/accounts/:accountId/transfers", validateCustomer, async (req: Request, res: Response) => {
            const response = await this.transfers.createTransfer(req.params.id, req.params.accountId, req.body)
            res.status(response.status).send(response.body)
        })
        this.router.get("/customers/:id/accounts/:accountId/transfers", validateCustomer, async (req: Request, res: Response) => {
            const response = await this.transfers.getTransfers(req.params.accountId)
            res.status(response.status).send(response.body)
        })
    }
}