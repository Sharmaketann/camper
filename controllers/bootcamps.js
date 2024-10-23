const path = require("path")
const ErrorResponse = require("../utils/errorResponse")

const asyncHandler = require("../middleware/async")
const Bootcamp = require("../models/Bootcamp")
const Course = require("../models/Course")
const dotenv = require("dotenv")
const geocoder = require("../utils/geocoder")

dotenv.config({ path: "./config/config.env" })

// @desc GET ALL BOOTCAMPS
// @route GET /api/v1/bootcamps
// @access public

exports.getBootcamps = asyncHandler(async (req, res, next) => {
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
  query = Bootcamp.find(JSON.parse(queryStr)).populate("courses")

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

  // Pagination  page=2&limit=10  1-10 11-20
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 25
  const startIndex = (page - 1) * limit
  const endIndex = page * limit

  const total = await Bootcamp.countDocuments()

  query = query.skip(startIndex).limit(limit)

  // Pagination result
  const pagination = {}

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    }
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    }
  }

  // Executing query
  const bootcamps = await query
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    pagination,
    data: bootcamps,
  })
})
// @desc GET SINGLE BOOTCAMP
// @route GET /api/v1/bootcamps/:id
// @access public

exports.getBootcamp = asyncHandler(async (req, res, next) => {
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

exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body)
  res.status(201).json({
    success: true,
    data: bootcamp,
  })
})

// @desc UPDATE BOOTCAMP
// @route PUT /api/v1/bootcamps/:id
// @access private

exports.updateBootcamp = asyncHandler(async (req, res, next) => {
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

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id)

  if (!bootcamp) {
    return next(
      new ErrorResponse(`No bootcamp found with id ${req.params.id}`, 404)
    )
  }

  // Manually delete related courses
  await Course.deleteMany({ bootcamp: req.params.id })

  // Now delete the bootcamp
  await bootcamp.deleteOne()

  res.status(200).json({
    success: true,
    data: "Bootcamp and related courses deleted successfully",
  })
})

// @desc get bootcamps within a radius
// @route GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access private

exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
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

// @desc Upload photo for bootcamp
// @route PUT /api/v1/bootcamps/:id/photo
// @access private

exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id)

  if (!bootcamp) {
    return next(new ErrorResponse(`No bootcamp with id ${req.params.id}`, 404))
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400))
  }

  console.log(req.files)

  const file = req.files.file

  // Make sure the image is a photo
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload an image file`, 400))
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    )
  }

  // Create custom filename
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`
  console.log(file.name)

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err)
      return next(new ErrorResponse(`Problem with file upload`, 500))
    }

    await Bootcamp.findByIdAndUpdate(req.params.id, {
      photo: file.name,
    })

    res.status(200).json({
      success: true,
      data: file.name,
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
