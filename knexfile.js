// Update with your config settings.

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './database.sqlite'
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations'
    },
    useNullAsDefault: true
  },

  staging: {
    client: 'sqlite3',
    connection: {
      filename: './database_stg.sqlite'
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations'
    },
    useNullAsDefault: true
  },

  production: {
    client: 'sqlite3',
    connection: {
      filename: './database_prod.sqlite'
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations'
    },
    useNullAsDefault: true
  },
};
