const express = require("express");
const userController = require("../controllers/user.controller");
const identifyUser = require("../middlewares/auth.middleware");

const userRouter = express.Router();

userRouter.post(
  "/follows/:username",
  identifyUser,
  userController.followUserController,
);
userRouter.post(
  "/unfollows/:username",
  identifyUser,
  userController.unfollowUserController,
);

userRouter.get(
  "/follows/requests",
  identifyUser,
  userController.getPendingRequestsController,
);

userRouter.patch(
  "/follows/:username/accept",
  identifyUser,
  userController.acceptFollowRequestController,
);

userRouter.patch(
  "/follows/:username/reject",
  identifyUser,
  userController.rejectFollowRequestController,
);


module.exports = userRouter;
