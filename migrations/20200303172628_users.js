
exports.up = async knex => {
	return knex.schema.createTableIfNotExists('users', (t) => {
        t.increments('id').primary().unsigned();
		t.dateTime('createdAt').notNull().defaultTo(knex.fn.now());
		t.dateTime('updatedAt').nullable();
		t.string('userName').unique().notNull();
		t.string('email').unique().notNull();
		t.string('password').notNull();
		t.string('shortKey').nullable();
		t.integer('sessionCount').nullable();
        t.boolean('isExpired').nullable().defaultTo(false);
	});
};

exports.down = async knex => {
    return knex.schema.dropTableIfExists('IF EXISTS users');
};
