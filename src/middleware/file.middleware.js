const multer = require("koa-multer");
const { AVATAR_PATH, PICTURE_PATH } = require("../constants/file-path");

const uploadAvator = multer({
  dest: AVATAR_PATH,
});

const avatarHandler = uploadAvator.single("avatar");

const uploadPicture = multer({
  dest: PICTURE_PATH,
});

const pictureHandler = uploadPicture.array("picture", 10);

const pictureResize = async (ctx, next) => {
  // 1. 获取图像信息
  // 2. 对图像进行处理（sharp（较大）/jimp）这里选择jimp
}

module.exports = {
  avatarHandler,
  pictureHandler,
};
