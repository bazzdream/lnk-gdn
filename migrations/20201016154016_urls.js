
exports.up = function(knex) {
  return knex.schema.createTable("urls", table => {
    table.increments()
    table.string('url')
    table.string('slug')
    table.unique('slug')
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("urls")
};
