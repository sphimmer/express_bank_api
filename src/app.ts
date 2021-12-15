import bodyParser from "body-parser";
import express, { Application } from "express";
import Container from "typedi";
import { createConnection } from "typeorm";
import AccountController from "./Controllers/AccountController";
import CustomerController from "./Controllers/CustomerController";
import TransferController from "./Controllers/TransferController";
import AccountRepository from "./repositories/AccountRepository";
import CustomerRepository from "./repositories/CustomerRepository";
import TransferRepository from "./repositories/TransferRepository";
import Routes from "./Routes";


const configure = async (): Promise<Application> => {
    const connection = await createConnection()
    Container.set("connection", connection);
    try {
        await connection.runMigrations();

    } catch (error) {
        console.error(error);
    }

    const app = express();
    app.use(bodyParser.json());
    app.use((_, res, next) => {
        res.header("Content-Type", 'application/json');
        next();
    });
    // init controllers
    const acctController = new AccountController(Container.get(AccountRepository))
    const custController = new CustomerController(Container.get(CustomerRepository))
    const transferController = new TransferController(Container.get(TransferRepository), Container.get(AccountRepository))
    // add routes
    
    const routes = new Routes(acctController, custController, transferController)
    app.use('/', routes.router)
    return app
}

configure().then(app => {
    app.listen(process.env.PORT, () => {
        console.info('Express server listening on port ' + process.env.PORT)
    });
})