import User from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const generateAccessandRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.createaccesstoken();
    const refreshToken = user.createrefreshtoken();

    user.refreshtoken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new apiError(
      500,
      "Something went wrong while generating the access and refresh token"
    );
  }
};

const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new apiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new apiError(400, "User already exists with this email");
  }

  const newUser = await User.create({
    username,
    email,
    password,
  });

  if (!newUser) {
    throw new apiError(500, "Failed to create user");
  }

  const { accessToken, refreshToken } = await generateAccessandRefreshTokens(
    newUser._id
  );
  newUser.refreshtoken = refreshToken;
  await newUser.save({ validateBeforeSave: false });

  const savedUser = await User.findById(newUser._id).select(
    "-password -refreshtoken"
  );

  if (!savedUser) {
    throw new apiError(500, "Failed to retrieve saved user");
  }

  return res.status(200).json(
    new apiResponse(
      200,
      {
        user: savedUser,
        accessToken,
        refreshToken,
      },
      "User registered successfully"
    )
  );
});

const Loginuser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    throw new apiError(400, "Email or username is required");
  }

  const user = await User.findOne({
    $or: [{ email }],
  });

  if (!user) {
    throw new apiError(404, "User not found ");
  }

  const isPasswordCorrect = await user.ispasswordcorrect(password);
  if (!isPasswordCorrect) {
    throw new apiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessandRefreshTokens(
    user._id
  );

  const savedUser = await User.findById(user._id).select(
    "-password -refreshtoken"
  );

  if (!savedUser) {
    throw new apiError(500, "Failed to retrieve saved user");
  }
  // for production purpose 
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 24 * 60 * 60 * 1000,
  };
  // const options = {
  // httpOnly: true,
  // secure: false,        // 🔴 MUST be false on localhost
  // sameSite: "lax",    // 🔴 MUST be lax on localhost
  // path: "/",   
  // maxAge: 24 * 60 * 60 * 1000,
  // };
  return res
    .status(200)
    .cookie("accesstoken", accessToken, options)
    .cookie("refreshtoken", refreshToken, options)
    .json(
      new apiResponse(
        200,
        {
          user: savedUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});
const Logoutuser = asyncHandler(async (req, res) => {
  const user = req.user;
  await User.findByIdAndUpdate(user._id, {
    $set: {
      refreshtoken: null,
    },
  });
  if (!user) {
    throw new apiError(404, "User not found");
  }

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 24 * 60 * 60 * 1000,
  };
  return res
    .status(200)
    .clearCookie("accesstoken", options)
    .clearCookie("refreshtoken", options)
    .json(new apiResponse(200, null, "User logged out successfully"));
});

const getuserdetails = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new apiError(404, "User not found");
  }
  const userdetails = await User.findById(user._id).select(
    "-password -refreshtoken"
  );
  if (!userdetails) {
    throw new apiError(404, "User details not found");
  }
  return res
    .status(200)
    .json(
      new apiResponse(200, userdetails, "User details retrieved successfully")
    );
});

const getuserbyid = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  if (!userId) {
    throw new apiError(400, "User ID is required");
  }
  const user = await User.findById(userId).select("-password -refreshtoken");
  if (!user) {
    throw new apiError(404, "User not found");
  }
  return res
    .status(200)
    .json(new apiResponse(200, user, "User retrieved successfully"));
});

const getallusers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password -refreshtoken").lean();

  if (users.length === 0) {
    throw new apiError(404, "No users found");
  }

  return res
    .status(200)
    .json(new apiResponse(200, users, "Users retrieved successfully"));
});


const getAgents = asyncHandler(async (req, res) => {
  const agents = await User.find({ role: "agent" })
    .select("_id username email");

  return res.json(
    new apiResponse(200, agents, "Agents fetched")
  );
});

export {
  createUser,
  Loginuser,
  Logoutuser,
  getuserdetails,
  getuserbyid,
  getallusers,
  getAgents
};
