const errorTypes = require('../constants/error-types')

const errorHandler = (err, ctx) => {
  let status, message
  switch (err.message) {
    case errorTypes.USERNAME_OR_PASSWORD_IS_NOT_EMPTY:
      status = 400 // Bad Request
      message = '用户名或密码不能为空~'
      break
    case errorTypes.USER_IS_EXIST:
      status = 409 // Conflict
      message = '用户名已存在，请换一个~'
      break
    case errorTypes.USER_IS_NOT_EXIST:
      status = 400 // 参数错误
      message = '用户名不存在~'
      break
    case errorTypes.PASSWORD_IS_INCORRECT:
      status = 400 // 参数错误
      message = '输入密码错误~'
      break
    case errorTypes.UNAUTHORIZED:
      status = 401 // 参数错误
      message = '账号信息过期，请重新登陆~'
      break
    case errorTypes.UNPERMISSION:
      status = 401 // 参数错误
      message = '您的账户没有权限~'
      break
    default:
      status = 404
      message = 'NOT FOUND'
  }

  ctx.status = status
  ctx.body = message
}

module.exports = errorHandler