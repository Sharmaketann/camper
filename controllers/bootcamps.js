const ErrorResponse = require("../utils/errorResponse")

const Bootcamp = require("../models/Bootcamp")

// @desc GET ALL BOOTCAMPS
// @route GET /api/v1/bootcamps
// @access public

exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find()
    res.status(200).json({
      success: true,
      count: bootcamps.length,
      data: bootcamps,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: error.message,
    })
  }
}

// @desc GET SINGLE BOOTCAMP
// @route GET /api/v1/bootcamps/:id
// @access public

exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id)

    if (!bootcamp) {
      return res.status(404).json({
        success: false,
        msg: `No bootcamp with id ${req.params.id}`,
      })
    }

    res.status(200).json({
      success: true,
      data: bootcamp,
    })
  } catch (error) {
    // res.status(400).json({
    //   success: false,
    //   msg: error.message,
    // })
    next(new ErrorResponse(`No bootcamp with id ${req.params.id}`, 404))
  }
}

// @desc CREATE NEW BOOTCAMP
// @route POST /api/v1/bootcamps
// @access private

exports.createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body)
    res.status(201).json({
      success: true,
      data: bootcamp,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: error.message,
    })
  }
}

// @desc UPDATE BOOTCAMP
// @route PUT /api/v1/bootcamps/:id
// @access private

exports.updateBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!bootcamp) {
      return res.status(404).json({
        success: false,
        msg: `No bootcamp with id ${req.params.id}`,
      })
    }
    res.status(200).json({
      success: true,
      data: bootcamp,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: error.message,
    })
  }
}

// @desc DELETE BOOTCAMP
// @route DELETE /api/v1/bootcamps/:id
// @access private

exports.deleteBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
    if (!bootcamp) {
      return res.status(404).json({
        success: false,
        msg: `No bootcamp with id ${req.params.id}`,
      })
    }
    res.status(200).json({
      success: true,
      data: "BOOTCAMP DELETED",
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: error.message,
    })
  }
}

// @desc GET SINGLE BOOTCAMP REVIEWS
// @route GET /api/v1/bootcamps/:id/reviews
// @access private

exports.getBootcampReviews = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `Show all reviews for bootcamp with id ${req.params.id}`,
  })
}
