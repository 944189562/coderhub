const path = require("path");
const fs = require("fs");
const jimp = require("jimp");

const fileService = require("../service/file.service");
const userService = require("../service/user.service");
const { APP_HOST, APP_PORT } = require("../app/config");
const { PICTURE_PATH } = require("../constants/file-path");

class FileController {
  async saveAvatarInfo(ctx, next) {
    const { filename, mimetype, size } = ctx.req.file;
    const { id } = ctx.user;
    // 将图片信息存到数据库中
    const result = await fileService.addAvatar(filename, mimetype, size, id);
    // 将图片地址存到users 表中
    const avatarUrl = `${APP_HOST}:${APP_PORT}/users/${id}/avatar`;
    await userService.updateUserAvatar(avatarUrl, id);
    // 返回结果
    ctx.body = result;
  }

  async savePictureInfo(ctx, next) {
    const files = ctx.req.files;
    const { id } = ctx.user;
    const { momentId } = ctx.query;
    console.log("files: ", files);
    for (let file of files) {
      const { filename, mimetype, size } = file;
      await fileService.savePicture(filename, mimetype, size, id, momentId);
    }

    ctx.body = "上传动态图片成功~";
  }

  async getPictureInfo(ctx, next) {
    const { filename } = ctx.params;
    const { params } = ctx.query;
    const { mimetype } = await fileService.getFileInfoByFilename(filename);
    const picPath = path.join(PICTURE_PATH, filename);

    try {
      // params 存在，对图片尺寸进行裁剪
      if (params) {
        const image = await jimp.read(picPath);
        const buffer = await image
          .resize(Number(params), jimp.AUTO)
          .getBufferAsync(mimetype);
        ctx.type = mimetype;
        ctx.body = buffer;
      } else {
        ctx.type = mimetype;
        ctx.body = fs.createReadStream(picPath);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new FileController();
