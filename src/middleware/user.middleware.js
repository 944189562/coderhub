const errorTypes = require("../constants/error-types");
const { getUserByName } = require("../service/user.service");
const md5Password = require("../utils/password-handle");

const verifyUser = async (ctx, next) => {
  // 1. 获取用户名和密码
  const { name, password } = ctx.request.body;

  // 2. 判断用户名和密码是否为空、长度、类型判断
  if (!name || !password) {
    const error = new Error(errorTypes.USERNAME_OR_PASSWORD_IS_NOT_EMPTY);
    return ctx.app.emit("error", error, ctx);
  }

  // 3. 判断用户名是否被注册
  const result = await getUserByName(name);
  if (result.length) {
    const error = new Error(errorTypes.USER_IS_EXIST);
    return ctx.app.emit("error", error, ctx);
  }

  await next();
};

const handlePassword = async (ctx, next) => {
  let { password } = ctx.request.body;
  // 加密之后的密码
  ctx.request.body.password = md5Password(password);
  await next();
};

module.exports = {
  verifyUser,
  handlePassword,
};
