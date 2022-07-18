const connection = require('../app/database')

class CommentService {
  async create(userId, content, momentId) {
    const statement = `INSERT INTO \`comment\` (user_id, content, moment_id) VALUES (?, ?, ?);`
    const [result] = await connection.execute(statement, [userId, content, momentId])
    return result
  }

  async reply(userId, content, momentId, commentId) {
    const statement = `INSERT INTO \`comment\` (user_id, content, moment_id, comment_id) VALUES (?, ?, ?, ?);`
    const [result] = await connection.execute(statement, [userId, content, momentId, commentId])
    return result
  }

  async update(commentId, content) {
    const statement = `UPDATE \`comment\` SET content = ? WHERE id = ?;`
    const [result] = await connection.execute(statement, [content, commentId])
    return result
  }

  async remove(commentId) {
    const statement = `DELETE FROM comment WHERE id = ?;`;
    const [result] = await connection.execute(statement, [commentId])
    return result
  }

  async getCommentsByCommentId(momentId) {
    const statement = `SELECT m.id, m.content, m.comment_id commentId, m.createAt createTime,
      \tJSON_OBJECT('id', u.id, 'name', u.name) user
      FROM comment m LEFT JOIN users u ON m.user_id = u.id
      WHERE moment_id = ?;`;
    const [result] = await connection.execute(statement, [momentId])
    return result
  }
}

module.exports = new CommentService()