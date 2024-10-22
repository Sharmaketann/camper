const ErrorResponse = require("../utils/errorResponse")
const asyncHand1er = require("../middleware/async")
const Bootcamp = require("../models/Bootcamp")
const geocoder = require("../utils/geocoder")

// @desc GET ALL BOOTCAMPS
// @route GET /api/v1/bootcamps
// @access public

exports.getBootcamps = asyncHand1er(async (req, res, next) => {
  const bootcamps = await Bootcamp.find()
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  })
})
// @desc GET SINGLE BOOTCAMP
// @route GET /api/v1/bootcamps/:id
// @access public

exports.getBootcamp = asyncHand1er(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id)

  if (!bootcamp) {
    return next(new ErrorResponse(`No bootcamp with id ${req.params.id}`, 404))
  }
  res.status(200).json({
    success: true,
    data: bootcamp,
  })
})

// @desc CREATE NEW BOOTCAMP
// @route POST /api/v1/bootcamps
// @access private

exports.createBootcamp = asyncHand1er(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body)
  res.status(201).json({
    success: true,
    data: bootcamp,
  })
})

// @desc UPDATE BOOTCAMP
// @route PUT /api/v1/bootcamps/:id
// @access private

exports.updateBootcamp = asyncHand1er(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  if (!bootcamp) {
    return next(new ErrorResponse(`No bootcamp with id ${req.params.id}`, 404))
  }
  res.status(200).json({
    success: true,
    data: bootcamp,
  })
})

// @desc DELETE BOOTCAMP
// @route DELETE /api/v1/bootcamps/:id
// @access private

exports.deleteBootcamp = asyncHand1er(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
  if (!bootcamp) {
    return next(new ErrorResponse(`No bootcamp with id ${req.params.id}`, 404))
  }
  res.status(200).json({
    success: true,
    data: "BOOTCAMP DELETED",
  })
})

// @desc get bootcamps within a radius
// @route GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access private

exports.getBootcampsInRadius = asyncHand1er(async (req, res, next) => {
  const { zipcode, distance } = req.params

  const loc = await geocoder.geocode(zipcode)
  const lat = loc[0].latitude
  const lng = loc[0].longitude

  const radius = distance / 3963
  Bootcamp.find({
    location: {
      $geoWithin: { $centerSphere: [[lng, lat], radius] },
    },
  }).then((bootcamps) => {
    res.status(200).json({
      success: true,
      count: bootcamps.length,
      data: bootcamps,
    })
  })
})

// @desc GET SINGLE BOOTCAMP REVIEWS
// @route GET /api/v1/bootcamps/:id/reviews
// @access private

exports.getBootcampReviews = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `Show all reviews for bootcamp with id ${req.params.id}`,
  })
}
