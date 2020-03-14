
exports.up = async knex => {
    return knex.schema.createTableIfNotExists('products', (t) => {
        t.increments('id').primary().unsigned();
        t.string('productCode').unique().notNull()
		t.dateTime('createdAt').notNull().defaultTo(knex.fn.now());
		t.dateTime('updatedAt').nullable();
		t.integer('userID').notNull();
        t.string('title').notNull();
        t.string('description').nullable();
        t.string('productType').nullable();
        t.float('salePrice').notNull();
        t.float('purchasePrice').nullable();
        t.float('discount').nullable()
        t.float('purchaseTax').nullable()
        t.float('saleTax').nullable()
        t.float('packingPrice').nullable()
        t.float('offerDiscount').nullable()
        t.float('runningStock').nullable()
        t.float('soldQuantity').nullable()
        t.float('availableQuantity').nullable()        
	});
};

exports.down = async knex => {
    return knex.schema.dropTableIfExists('IF EXISTS products');
};
