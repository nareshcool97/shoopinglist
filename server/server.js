var knexfile = require('../knexfile');
module.exports = {
    knex : require('knex')(knexfile[process.env.NODE_ENV])
}