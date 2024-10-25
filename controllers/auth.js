const asyncHandler = require("../middleware/async")
const ErrorResponse = require("../utils/errorResponse")
const dotenv = require("dotenv")
const User = require("../models/User")

// @desc Get logged in user
// @route GET /api/v1/auth/register
// @access Private
exports.register = asyncHandler(async (req, res, next) => {
  // const user = await User.findById(req.user.id)
  res.status(200).json({
    success: true,
    // data: user,
  })
})

// @desc Get logged in user
// @route GET /api/v1/auth/login
// @access Private

// exports.login = asyncHandler(async (req, res, next) => {
//   const user = await User.findById(req.user.id)
//   res.status(200).json({
//     success: true,
//     data: user,
//   })
// })
