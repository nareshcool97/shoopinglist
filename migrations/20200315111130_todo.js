
exports.up = function(knex) {
    return knex.schema.createTableIfNotExists('todo', (t) => {
        t.increments('id').primary().unsigned();
        t.integer('toDoNumber').unique().notNull()
		t.dateTime('createdAt').notNull().defaultTo(knex.fn.now());
		t.dateTime('updatedAt').nullable();
        t.integer('userID').notNull();
        t.string('textTodo').nullable();
        t.boolean('done').nullable().defaultTo(false);
    })
  
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('todo');
};
