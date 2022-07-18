const conneciton = require("../app/database");

class UserService {
  async create(user) {
    // 将user存储到数据库
    const { name, password } = user;
    // SQL语句
    const statement = `INSERT INTO \`users\` (name, password) VALUES (?,?)`;
    // 数据存储到数据库中
    const result = await conneciton.execute(statement, [name, password]);

    return result[0];
  }

  async getUserByName(name) {
    const statement = `SELECT * FROM \`users\` WHERE name = ?;`;
    const result = await conneciton.execute(statement, [name]);

    return result[0];
  }

  async updateUserAvatar(avatarUrl, id) {
    const statement = `UPDATE users SET avatar_url = ? WHERE id = ?;`;
    const [result] = await conneciton.execute(statement, [avatarUrl, id]);
    return result;
  }
}

module.exports = new UserService();
