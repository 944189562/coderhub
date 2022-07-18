const Router = require('koa-router')

const authRouter = new Router()

const {
  login,
  success
} = require('../controller/auth.controller')
const {
  verifyLogin,
  jwtSign,
  verifyAuth
} = require('../middleware/auth.middleware')

authRouter.post('/login', verifyLogin, jwtSign, login)
authRouter.get('/test', verifyAuth, success)

module.exports = authRouter