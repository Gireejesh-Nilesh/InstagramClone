const express = require("express");
const postRouter = express.Router();
const postController = require("../controllers/post.controller");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const identifyUser = require("../middlewares/auth.middleware");
const likeModel = require("../models/likes.model");

postRouter.post(
  "/",
  upload.single("imgUrl"),
  identifyUser,
  postController.createPostController,
);
postRouter.get("/", identifyUser, postController.getPostController);

postRouter.get(
  "/details/:postId",
  identifyUser,
  postController.getPostDetailsController,
);

postRouter.post(
  "/like/:postId",
  identifyUser,
  postController.likePostController,
);

module.exports = postRouter;
