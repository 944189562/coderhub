const Koa = require('koa')
const bodyparser = require('koa-bodyparser')
const errorHandler = require('../app/error-handler')
const useRoutes = require('../router')

const app = new Koa()

app.useRoutes = useRoutes

app.use(bodyparser())
app.useRoutes()
app.on('error', errorHandler)

module.exports = app