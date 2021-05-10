const RepliesService = {

  getAllReplies(knex) {
    return knex.select('*').from('replies')
  },

  insertReplies(knex, replies) {
    return knex
      .insert(replies)
      .into('replies')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },

  getById(knex, id) {
    return knex
      .from('replies')
      .select('*')
      .where('id', id)
      .first()
  },

  updateReplies(knex, id, content, postid) {
    return knex('replies')
      .where({ id, postid })
      .update({ content })
  },

  deleteReplies(knex, id) {
    return knex('replies')
      .where({ id })
      .delete()
  },

}

module.exports = RepliesService;