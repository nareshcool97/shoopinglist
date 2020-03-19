const path = require('path')
const dbPath = path.resolve(__dirname, '../db/database.sqlite')
const prodDbPath = path.resolve(__dirname, '../db/database_prod.sqlite')
const autoDb = path.resolve(__dirname, '../database.sqlite').replace('app.asar','')
const migrations = path.resolve(__dirname, '../migrations').replace('app.asar','')
// const db = new sqlite3.Database(dbPath)
const knex = module.exports = {
    knex : require('knex')({
        
            client: 'sqlite3',
            connection: {
              filename: autoDb
            },
            migrations: {
              tableName: 'knex_migrations',
              directory: migrations
            },
            useNullAsDefault: true
          
    })
}

knex.knex.migrate.latest()
