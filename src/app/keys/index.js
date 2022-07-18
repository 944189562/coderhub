const Koa = require('koa')
const Router = require('koa-router')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')

const app = new Koa()
const testRouter = new Router()

// 获取公钥和私钥
const PRIVATE_KEY = fs.readFileSync(path.resolve(__dirname, './private.key'))
const PUBLIC_KEY = fs.readFileSync(path.resolve(__dirname, './public.key'))

// 登录接口
testRouter.post('/login', (ctx, next) => {
  const user = {
    id: 1,
    name: 'jz'
  }

  const token = jwt.sign(user, PRIVATE_KEY, {
    expiresIn: 10,
    algorithm: 'RS256'
  })

  ctx.body = token
})

// 验证接口
testRouter.get('/user', (ctx, next) => {
  const authorization = ctx.request.headers.authorization
  const token = authorization.replace('Bearer ', '')

  try {
    const result = jwt.verify(token, PUBLIC_KEY, {
      algorithms: ['RS256']
    })
    ctx.body = result
  } catch (err) {
    console.log(err.message)
    ctx.body = 'token已过期~'
  }
})

app.use(testRouter.routes())

app.listen(8000, () => {
  console.log('服务已启动~')
})