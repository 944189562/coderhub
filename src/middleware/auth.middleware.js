const jwt = require("jsonwebtoken");
const { PRIVATE_KEY, PUBLIC_KEY } = require("../app/config");
const errorTypes = require("../constants/error-types");
const { getUserByName } = require("../service/user.service");
const { checkResource } = require("../service/auth.service");
const md5Password = require("../utils/password-handle");

const verifyLogin = async (ctx, next) => {
  // 1. 获取用户名和密码
  const { name, password } = ctx.request.body;

  // 2. 判断用户名和密码是否为空、长度、类型判断
  if (!name || !password) {
    const error = new Error(errorTypes.USERNAME_OR_PASSWORD_IS_NOT_EMPTY);
    return ctx.app.emit("error", error, ctx);
  }

  // 3. 判断用户是否存在
  const result = await getUserByName(name);
  if (!result.length) {
    const error = new Error(errorTypes.USER_IS_NOT_EXIST);
    return ctx.app.emit("error", error, ctx);
  }

  // 4. 判断密码是否相等
  const user = result[0];
  if (md5Password(password) !== user.password) {
    const error = new Error(errorTypes.PASSWORD_IS_INCORRECT);
    return ctx.app.emit("error", error, ctx);
  }

  ctx.user = user;
  await next();
};

const jwtSign = async (ctx, next) => {
  const { id, name } = ctx.user;
  const token = jwt.sign({ id, name }, PRIVATE_KEY, {
    expiresIn: 24 * 60 * 60,
    algorithm: "RS256",
  });

  ctx.user.token = token;
  await next();
};

const verifyAuth = async (ctx, next) => {
  const authorization = ctx.headers.authorization;
  if (!authorization) {
    const error = new Error(errorTypes.UNAUTHORIZED);
    return ctx.app.emit("error", error, ctx);
  }
  const token = authorization.replace("Bearer ", "");
  // 验证token
  try {
    const result = jwt.verify(token, PUBLIC_KEY, {
      algorithms: ["RS256"],
    });
    ctx.user = result;
    console.log('用户已登录~')
    await next();
  } catch (err) {
    console.log('登录信息过期~')
    const error = new Error(errorTypes.UNAUTHORIZED);
    ctx.app.emit("error", error, ctx);
  }
};

const verifyPermission = async (ctx, next) => {
  console.log("验证权限middleware");
  // 1. 获取参数 momentId, userId
  const [key] = Object.keys(ctx.params);
  const tableName = key.replace("Id", "");
  const resourceId = ctx.params[key];
  const { id } = ctx.user;
  // 2. 查询是否具备权限
  try {
    const permission = await checkResource(tableName, resourceId, id);
    if (!permission) throw new Error();
    await next();
  } catch (err) {
    const error = new Error(errorTypes.UNPERMISSION);
    ctx.app.emit("error", error, ctx);
  }
};

// const verifyPermission = (tableName) => {
//   return async (ctx, next) => {
//     console.log('验证权限middleware')
//     // 1. 获取参数 momentId, userId
//     const [key] = Object.keys(ctx.params)
//     const resourceId = ctx.params[key]
//     const {id} = ctx.user
//     // 2. 查询是否具备权限
//     try {
//       const permission = await checkResource(tableName, resourceId, id)
//       if (!permission) throw new Error()
//       await next()
//     } catch (err) {
//       const error = new Error(errorTypes.UNPERMISSION)
//       ctx.app.emit('error', error, ctx)
//     }
//   }
// }

module.exports = {
  verifyLogin,
  jwtSign,
  verifyAuth,
  verifyPermission,
};
