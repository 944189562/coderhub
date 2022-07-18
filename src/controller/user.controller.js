const fs = require("fs");

const userService = require("../service/user.service");
const fileService = require("../service/file.service");
const { AVATAR_PATH } = require("../constants/file-path");

class UserController {
  async create(ctx, next) {
    // 获取请求参数
    const user = ctx.request.body;
    // 查询数据
    const result = await userService.create(user);
    console.log(result);
    // 返回数据
    ctx.body = result;
  }

  async avatarInfo(ctx, next) {
    const { userId } = ctx.params;
    const { filename, mimetype } = await fileService.getAvatarByUserId(userId);
    ctx.type =  mimetype;
    ctx.body = fs.createReadStream(`${AVATAR_PATH}/${filename}`);
  }
}

module.exports = new UserController();
