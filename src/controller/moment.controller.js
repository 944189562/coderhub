const {
  create,
  getMomentById,
  getList,
  update,
  deleteMomentById,
  hasLabel,
  addLabel,
} = require("../service/moment.service");
const { verifyAuth } = require("../middleware/auth.middleware");

class MomentController {
  async create(ctx, next) {
    // 获取用户id
    const userId = ctx.user.id;
    const { content } = ctx.request.body;
    const result = await create(userId, content);
    ctx.body = result;
  }

  async detail(ctx, next) {
    // 1. 获取momentId
    const momentId = ctx.params.momentId;
    const result = await getMomentById(momentId);
    console.log(result);
    if (result.length) {
      ctx.body = result[0];
      return;
    }
    ctx.body = "详情未获取到";
  }

  async list(ctx, next) {
    // 1. 获取数据offset、size
    const { offset, size } = ctx.query;
    const result = await getList(offset, size);
    ctx.body = result;
  }

  async remove(ctx, next) {
    const momentId = ctx.params.momentId;
    const result = await deleteMomentById(momentId);
    ctx.body = result;
  }

  async update(ctx, next) {
    const { momentId } = ctx.params;
    const { content } = ctx.request.body;
    const result = await update(momentId, content);
    ctx.body = result;
  }

  async addLabels(ctx, next) {
    const { momentId } = ctx.params;
    const { labels } = ctx;
    // 判断 moment是否添加标签
    for (let label of labels) {
      const { labelId } = label;
      const isExists = await hasLabel(momentId, labelId);

      if (!isExists) {
        await addLabel(momentId, labelId);
      }
    }

    ctx.body = "给动态添加标签成功~";
  }
}

module.exports = new MomentController();
