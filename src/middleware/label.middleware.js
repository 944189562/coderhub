const service = require("../service/label.service");

const verifyLabelExists = async (ctx, next) => {
  try {
    const { labels } = ctx.request.body;
    const newLabels = [];
    // 循环遍历 labels是否存在，不存在创建
    for (let name of labels) {
      const result = await service.getLabelByName(name);
      const label = {
        name,
      };

      if (!result) {
        const result = await service.create(name);
        label.labelId = result.insertId;
      } else {
        label.labelId = result.id;
      }

      newLabels.push(label);
    }

    ctx.labels = newLabels;
    await next();
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  verifyLabelExists,
};
