const asyncHandler = require("express-async-handler");
const User = require("../model/userModel");
const { generateToken } = require("../config/generateToken");

const userSignup = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  console.log(username, email, password);
  try {
    // Check if user already exists
    const existingUser = await User.find({ email: email });

    if (existingUser.length > 0) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    // Create new user
    const newUser = await User.create({ username, email, password });

    // Send response without the password
    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      password: newUser.password,
      token: generateToken(newUser._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    const userExist = await User.findOne({ email });

    console.log(userExist);

    if (!userExist) {
      res.status(400).json({ message: "User does not exist" });
      return;
    }

    if (userExist && (await userExist.isValidPassword(password))) {
      res.status(200).json({
        _id: userExist._id,
        username: userExist.username,
        email: userExist.email,
        password: userExist.password,
        token: generateToken(userExist._id),
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const getallUsers = asyncHandler(async (req, res) => {
  const search = req.query.search;
  console.log(search);
  const keyword = search
    ? {
        $or: [
          { username: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }
    : {};

  console.log(keyword);

  const searchedUsers = await User.find(keyword).find({
    _id: { $ne: req.user._id },
  });
  if (searchedUsers) return res.status(200).json(searchedUsers);
  res.status(404).json({ message: "Users not found" });
});

module.exports = { userLogin, userSignup, getallUsers };
