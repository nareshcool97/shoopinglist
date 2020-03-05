
exports.up = function(knex) {
    return knex.schema.createTableIfNotExists('bills', (t) => {
        t.increments('id').primary().unsigned();
        t.string('billNumber').unique().notNull().defaultTo("SV"+knex.fn.now());
		t.dateTime('createdAt').notNull().defaultTo(knex.fn.now());
		t.dateTime('updatedAt').nullable();
        t.integer('userID').notNull();
        t.string('shopName').nullable();
        t.string('address').nullable();
        t.dateTime('billDate').notNull().defaultTo(knex.fn.now());;
        t.string('customerName').nullable();
        t.string('customerAddress').notNull();
        t.string('customerPhone').notNull();
        t.json('billItems').notNull()
        t.float('billTotal').notNull()
        t.float('discountOnTotal').nullable()
        t.float('amountPaid').notNull()
        t.float('discountOnBill').nullable()
        t.float('balanceAmount').nullable()
    }); 
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('IF EXISTS bills');
};
