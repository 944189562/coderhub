class AuthController {
  async login(ctx, next) {
    const {id, name, token} = ctx.user
    ctx.body = {
      id,
      name,
      token
    }
  }

  async success(ctx, next) {
    ctx.body = '授权成功'
  }
}

module.exports = new AuthController()