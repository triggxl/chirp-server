const PostsService = {
  getAllPosts(knex) {
    return knex.select('*').from('posts')
  },

  insertPosts(knex, posts) {
    return knex
      .insert(posts)
      .into('posts')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },

  getById(knex, id) {
    return knex
      .from('posts')
      .select('*')
      .where('id', id)
      .first()
  },

  deletePosts(knex, id) {
    return knex('posts')
      .where({ id })
      .delete()
  },

  updatePosts(knex, id, postsFields) {
    return knex('posts')
      .where({ id })
      .update(postsFields)
  },
}

module.exports = PostsService;