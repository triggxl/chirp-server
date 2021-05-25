exports.up = function (knex) {
  return Promise.all(
    [knex.schema.createTable('posts', table => {
      table.string('id', 36)
      table.string('title', 70)
      table.string('content')
    }),
    knex.schema.createTable('replies', table => {
      table.string('id', 36)
      table.string('title')
      table.string('postid', 36)
    })]
  )
};
// alter statement ref knex documentation (only specify differences)

exports.down = function (knex) {
  knex.schem.dropTable('posts')
  knex.schema.dropTable('replies')
};

