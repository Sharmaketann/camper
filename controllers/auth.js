const asyncHandler = require("../middleware/async")
const ErrorResponse = require("../utils/errorResponse")
const dotenv = require("dotenv")
const User = require("../models/User")

// @desc Get logged in user
// @route POST /api/v1/auth/register
// @access Private
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body
  const user = await User.create({
    name,
    email,
    password,
    role,
  })
  //Create token
  const token = user.getSignedJwtToken()

  res.status(201).json({
    success: true,
    data: user,
    token: token,
  })
})

// @desc Get logged in user
// @route POST /api/v1/auth/login
// @access Private

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400))
  }

  const user = await User.findOne({ email }).select("+password")

  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401))
  }

  const isMatch = await user.matchPassword(password)
  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 401))
  }
  //Create token
  const token = user.getSignedJwtToken()
  res.status(200).json({
    success: true,
    data: user,
    token: token,
  })
})
