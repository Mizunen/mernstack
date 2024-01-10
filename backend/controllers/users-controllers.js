const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

const User = require("../models/user");

const getAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password"); // exclude password from all documents
  } catch (error) {
    return next(
      new HttpError("Could not find users, please try again later.", 500)
    );
  }

  res
    .status(201)
    .json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signupUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid input(s) passed, please check your data.", 422)
    );
  }
  const { username, email, password } = req.body;

  const newUser = new User({
    username,
    password,
    email,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/375px-Empire_State_Building_%28aerial_view%29.jpg",
    places: [],
  });
  let foundUser;

  try {
    foundUser = await User.findOne({ email: email });
  } catch (error) {
    console.log("trouble finding");
    return next(new HttpError("Sign up failed, please try again.", 500));
  }

  if (foundUser) {
    return next(
      new HttpError("User exists already, please login instead.", 422)
    );
  }

  try {
    await newUser.save();
  } catch (error) {
    console.log("trouble saving");
    return next(new HttpError("Sign up failed, please try again.", 500));
  }

  res
    .status(202)
    .json({ message: "Signed up", user: newUser.toObject({ getters: true }) });
};

const loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError(
      "Invalid input(s) passed, please check your data.",
      422
    );
  }

  const { email, password } = req.body;
  let foundUser;

  try {
    foundUser = await User.findOne({ email: email });
  } catch (error) {
    console.log("trouble finding");
    return next(new HttpError("login failed, please try again.", 500));
  }

  if (!foundUser || foundUser.password !== password) {
    return next(
      new HttpError("Invalid credentials could not log you in.", 401)
    );
  }

  res
    .status(201)
    .json({
      message: "Logged in",
      user: foundUser.toObject({ getters: true }),
    });
};

exports.getAllUsers = getAllUsers;
exports.signupUser = signupUser;
exports.loginUser = loginUser;
