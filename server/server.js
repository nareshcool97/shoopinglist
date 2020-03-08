const path = require('path')
const dbPath = path.resolve(__dirname, '../db/database.sqlite')
const prodDbPath = path.resolve(__dirname, '../db/database_prod.sqlite')
// const db = new sqlite3.Database(dbPath)
module.exports = {
    knex : require('knex')({
        
            client: 'sqlite3',
            connection: {
              filename: dbPath
            },
            migrations: {
              tableName: 'knex_migrations',
              directory: './migrations'
            },
            useNullAsDefault: true
          
    })
}