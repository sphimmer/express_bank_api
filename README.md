# Bank API

This toy API is to simulate a simple bank API with simple functionalities like creating customers, creating accounts, transfering funds from one account to another, viewing account balances, and viewing transfer history

## Setup
this repository uses Docker (docker-compose) and Nodejs. Have those installed to get started

*Run*
`npm install`
`cd db && docker-compose up -d`
`npm start`

This will start a local version of the API running with a postgresql Database as the datastore.
