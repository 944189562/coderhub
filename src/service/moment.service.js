const connection = require("../app/database");
const { APP_HOST, APP_PORT } = require("../app/config");

const sqlFragment = `
        `;

class MomentService {
  async create(userId, content) {
    const statement = `INSERT INTO \`moment\` (user_id, content) VALUES (?,?);`;
    const result = await connection.execute(statement, [userId, content]);
    return result[0];
  }

  async getMomentById(momentId) {
    // const statement = `SELECT
    //         m.id id, m.content content, m.createAt createTime, m.updateAt updateTime,
    //         JSON_OBJECT('id', u.id, 'name', u.name) author
    //     FROM \`moment\` m
    //     LEFT JOIN \`users\` u ON m.user_id = u.id WHERE m.id = ?;`
    // 查询评论相关信息
    // const statement = `SELECT m.id id, m.content content, m.createAt createTime, m.updateAt updateTime,
    //   \tJSON_OBJECT('id', u.id, 'name', u.name) author,
    //   \tJSON_ARRAYAGG(JSON_OBJECT('id', c.id, 'content', c.content, 'commentId', c.comment_id, 'createTime', c.createAt, 'user', JSON_OBJECT('id', cu.id, 'name', cu.name))) comments
    //   FROM \`moment\` m
    //   LEFT JOIN \`users\` u ON m.user_id = u.id
    //   LEFT JOIN comment c ON c.moment_id = m.id
    //   LEFT JOIN users cu ON c.user_id = cu.id
    //   WHERE m.id = ?;`;
    try {
      const statement = `
        SELECT m.id id, m.content content, m.createAt createTime, m.updateAt updateTime,
          JSON_OBJECT('id', u.id, 'name', u.name, 'avatarUrl', u.avatar_url) author,
          IF(COUNT(c.id), JSON_ARRAYAGG(
            JSON_OBJECT('id', c.id, 'content', c.content, 'commentId', c.comment_id, 'createTime', c.createAt, 'user', JSON_OBJECT('id', cu.id, 'name', cu.name, 'avatarUrl', cu.avatar_url))
            ), NULL) comments,
          (SELECT IF(COUNT(l.id), JSON_ARRAYAGG(
            JSON_OBJECT('id', l.id, 'name', l.name)
          ), NULL) FROM label l LEFT JOIN moment_label ml ON ml.label_id = l.id WHERE ml.moment_id = m.id) labels,
          (SELECT JSON_ARRAYAGG(CONCAT('${APP_HOST}:${APP_PORT}/upload/file/', f.filename)) FROM file f WHERE f.moment_id = m.id) images
        FROM \`moment\` m
        LEFT JOIN \`users\` u ON m.user_id = u.id
        LEFT JOIN comment c ON c.moment_id = m.id
        LEFT JOIN users cu ON c.user_id = cu.id
        WHERE m.id = 26
        GROUP BY m.id;
      `;
      const result = await connection.execute(statement, [momentId]);
      return result[0];
    } catch (error) {
      console.error(error);
    }
  }

  async getList(offset, size) {
    const statement = `
        SELECT m.id id, m.content content, m.createAt createTime, m.updateAt updateTime,
	      JSON_OBJECT('id', u.id, 'name', u.name) author,
	      (SELECT COUNT(*) FROM \`comment\` c WHERE c.moment_id = m.id) commentCount,
        (SELECT COUNT(*) FROM \`moment_label\` ml WHERE ml.moment_id = m.id) labelCount
        FROM \`moment\` m LEFT JOIN \`users\` u ON m.user_id = u.id LIMIT ?, ?;`;
    const result = await connection.execute(statement, [offset, size]);
    return result[0];
  }

  async update(momentId, content) {
    try {
      const statement = `UPDATE \`moment\` SET content = ? WHERE id = ?;`;
      const [result] = await connection.execute(statement, [content, momentId]);
      return result;
    } catch (err) {
      console.log(err);
    }
  }

  async deleteMomentById(momentId) {
    try {
      const statement = `DELETE FROM \`moment\` WHERE id = ?;`;
      const [result] = await connection.execute(statement, [momentId]);
      return result;
    } catch (err) {
      console.log(err);
    }
  }

  async hasLabel(momentId, labelId) {
    try {
      const statement = `SELECT * FROM moment_label WHERE moment_id = ? AND label_id = ?;`;
      const [result] = await connection.execute(statement, [momentId, labelId]);
      return result && result[0] ? true : false;
    } catch (err) {
      console.log(err);
    }
  }

  async addLabel(momentId, labelId) {
    try {
      const statement = `INSERT INTO moment_label (moment_id, label_id) VALUES (?,?);`;
      const [result] = await connection.execute(statement, [momentId, labelId]);
      return result;
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = new MomentService();
