exports.up = function (knex) {
  knex.schema.createTable('posts', table => {
    table.string('id', 36)
    table.string('title', 50)
    table.string('content')
  })
  knex.schema.createTable('replies', table => {
    table.string('id', 36)
    table.string('title', 50)
    table.string('postid', 36)
  })
};

exports.down = function (knex) {
  knex.schem.dropTable('posts')
  knex.schema.dropTable('replies')
};
