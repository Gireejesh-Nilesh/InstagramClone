const postModel = require("../models/post.model");
const likeModel = require("../models/likes.model");
const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");
const jwt = require("jsonwebtoken");
const identifyUser = require("../middlewares/auth.middleware");

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

async function createPostController(req, res) {
  const file = await imagekit.files.upload({
    file: await toFile(Buffer.from(req.file.buffer), "file"),
    fileName: "Test",
    folder: "Insta-clone-posts",
  });

  const post = await postModel.create({
    caption: req.body.caption,
    imgUrl: file.url,
    user: req.user.id,
  });

  res.status(201).json({
    message: "Post created successfully",
    post,
  });
}

async function getPostController(req, res) {
  const userId = req.user.id;

  const posts = await postModel.find({
    user: userId,
  });

  res.status(200).json({
    message: "Posts fetched successfully",
    posts,
  });
}

async function getPostDetailsController(req, res) {
  const userId = req.user.id;
  const postId = req.params.postId;

  const post = await postModel.findById(postId);

  if (!post) {
    return res.status(404).json({
      message: "Post not found",
    });
  }

  const isValidUser = post.user.toString() === userId;

  if (!isValidUser) {
    return res.status(403).json({
      message: "Forbidden Content.",
    });
  }

  return res.status(200).json({
    message: "Post fetched successfully",
    post,
  });
}

async function likePostController(req, res) {
  const username = req.user.username;
  const postId = req.params.postId;

  const post = await postModel.findById(postId);

  if (!post) {
    return res.status(404).json({
      message: "Post not found",
    });
  }

  const existingLike = await likeModel.findOne({
    postId,
    username,
  });

  if (existingLike) {
    return res.status(200).json({
      message: "Post already liked by the user",
      like: existingLike,
    });
  }

  const like = await likeModel.create({
    postId,
    username,
  });

  res.status(200).json({
    message: "Post liked successfully",
    like,
  });
}

async function getFeedController(req, res) {
  const user = req.user;
  const allPosts = await postModel.find().populate("user").lean();

  const posts = await Promise.all(
    allPosts.map(async (post) => {
      const isLiked = await likeModel.findOne({
        postId: post._id,
        username: user.username,
      });

      post.isLiked = !!isLiked;
      return post;
    }),
  );

  res.status(200).json({
    message: "posts fetched successfully",
    posts,
  });
}

module.exports = {
  createPostController,
  getPostController,
  getPostDetailsController,
  likePostController,
  getFeedController,
};
