const ErrorResponse = require("../utils/errorResponse")
const asyncHand1er = require("../middleware/async")
const Bootcamp = require("../models/Bootcamp")
const geocoder = require("../utils/geocoder")

// @desc GET ALL BOOTCAMPS
// @route GET /api/v1/bootcamps
// @access public

exports.getBootcamps = asyncHand1er(async (req, res, next) => {
  let query

  // Copy req.query
  let reqQuery = { ...req.query }

  // Fields to exclude
  const removeFields = ["select", "sort", "page", "limit"]

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param])

  // Create query string
  let queryStr = JSON.stringify(reqQuery)

  // Create operator ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`)

  // Finding resources
  query = Bootcamp.find(JSON.parse(queryStr))

  // Select fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ")
    query = query.select(fields)
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ")
    query = query.sort(sortBy)
  } else {
    query = query.sort("-createdAt")
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 25
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const total = await Bootcamp.countDocuments()

  // Executing query
  const bootcamps = await query
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
