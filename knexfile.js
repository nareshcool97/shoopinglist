// Update with your config settings.
const path = require('path')
const autoDb = path.resolve(__dirname, './database.sqlite').replace('app.asar','')
const migrationsPath =  path.resolve(__dirname, './migrations').replace('app.asar','')

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: autoDb
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: migrationsPath
    },
    useNullAsDefault: true
  },

  staging: {
    client: 'sqlite3',
    connection: {
      filename: autoDb
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: migrationsPath
    },
    useNullAsDefault: true
  },

  production: {
    client: 'sqlite3',
    connection: {
      filename: autoDb
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: migrationsPath
    },
    useNullAsDefault: true
  },
};
