require('dotenv').config()
var parse = require('pg-connection-string').parse;
var config = parse(process.env.DATABASE_URL)


module.exports = {
    "type": "postgres",
    "host": config.host,
    "port": config.port,
    "username": config.user,
    "password": config.password,
    "database": config.database,
    "synchronize": true,
    "logging": false,
    "entities": [
       "dist/src/db_entities/Account.js",
       "dist/src/db_entities/Customer.js",
       "dist/src/db_entities/Transfer.js"
    ],
    "migrations": [
       "dist/migration/**/*.js"
    ],
    "subscribers": [
       "dist/subscriber/**/*.js"
    ],
    "cli": {
       "entitiesDir": "src/entity",
       "migrationsDir": "src/migration",
       "subscribersDir": "src/subscriber"
    }
}