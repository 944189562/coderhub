const {
  create,
  reply,
  update,
  remove,
  getCommentsByCommentId
} = require('../service/comment.service')

class CommentController {
  async create(ctx, next) {
    const {content, momentId} = ctx.request.body
    const {id} = ctx.user
    const result = await create(id, content, momentId)
    ctx.body = result
  }

  async reply(ctx, next) {
    const {content, momentId} = ctx.request.body
    const {commentId} = ctx.params
    const {id} = ctx.user
    const result = await reply(id, content, momentId, commentId)
    ctx.body = result
  }

  async update(ctx, next) {
    const {commentId} = ctx.params
    const {content} = ctx.request.body
    const result = await update(commentId, content)
    ctx.body = result
  }

  async remove(ctx, next) {
    const {commentId} = ctx.params
    const result = await remove(commentId)
    ctx.body = result
  }

  async list(ctx, next) {
    const {momentId}= ctx.query
    const result = await getCommentsByCommentId(momentId)
    ctx.body = result
  }
}

module.exports = new CommentController()