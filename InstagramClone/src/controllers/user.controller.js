const followModel = require("../models/follow.model");
const userModel = require("../models/user.model");

async function followUserController(req, res) {
  const followerUsername = req.user.username;
  const followeeUsername = req.params.username;

  const isUserExists = await userModel.findOne({
    username: followeeUsername,
  });

  if (!isUserExists) {
    return res.status(404).json({
      message: "User you are trying to follow does not exist",
    });
  }

  if (followerUsername === followeeUsername) {
    return res.status(400).json({
      message: "You cannot follow yourself",
    });
  }

  const existingFollow = await followModel.findOne({
    follower: followerUsername,
    followee: followeeUsername,
  });

  if (existingFollow) {
    if (existingFollow.status === "pending") {
      return res.status(400).json({ message: "Follow request already sent" });
    }

    if (existingFollow.status === "accepted") {
      return res
        .status(400)
        .json({ message: `You are already following ${followeeUsername}` });
    }

    existingFollow.status = "pending";
    await existingFollow.save();

    return res.status(200).json({
      message: `Follow request re-sent to ${followeeUsername}`,
      follow: existingFollow,
    });
  }

  const followRecord = await followModel.create({
    follower: followerUsername,
    followee: followeeUsername,
    status: "pending",
  });

  res.status(200).json({
    message: `Follow request sent to ${followeeUsername}`,
    follow: followRecord,
  });
}

async function unfollowUserController(req, res) {
  const followerUsername = req.user.username;
  const followeeUsername = req.params.username;

  const isUserFollowing = await followModel.findOne({
    follower: followerUsername,
    followee: followeeUsername,
    status: "accepted",
  });

  if (!isUserFollowing) {
    return res.status(400).json({
      message: `You are not following ${followeeUsername}`,
    });
  }

  await followModel.findByIdAndDelete(isUserFollowing._id);

  res.status(200).json({
    message: `You have unfollowed ${followeeUsername}`,
  });
}

async function getPendingRequestsController(req, res) {
  const pendingRequests = await followModel.find({
    followee: req.user.username,
    status: "pending",
  });

  res.status(200).json({
    message: "Pending follow requests fetched successfully",
    requests: pendingRequests,
  });
}

async function acceptFollowRequestController(req, res) {
  const followerUsername = req.params.username;
  const followeeUsername = req.user.username;

  const followRequest = await followModel.findOne({
    follower: followerUsername,
    followee: followeeUsername,
    status: "pending",
  });

  if (!followRequest) {
    return res.status(404).json({ message: "Follow request not found" });
  }

  followRequest.status = "accepted";
  await followRequest.save();

  res.status(200).json({
    message: `${followerUsername} is now following you`,
    follow: followRequest,
  });
}

async function rejectFollowRequestController(req, res) {
  const followerUsername = req.params.username;
  const followeeUsername = req.user.username;

  const followRequest = await followModel.findOne({
    follower: followerUsername,
    followee: followeeUsername,
    status: "pending",
  });

  if (!followRequest) {
    return res.status(404).json({ message: "Follow request not found" });
  }

  followRequest.status = "rejected";
  await followRequest.save();

  res.status(200).json({
    message: `Follow request from ${followerUsername} rejected`,
    follow: followRequest,
  });
}

module.exports = {
  followUserController,
  unfollowUserController,
  getPendingRequestsController,
  acceptFollowRequestController,
  rejectFollowRequestController,
};
