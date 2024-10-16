const colors = require("colors")

const errorHandler = (err, req, res, next) => {
  console.log(err.stack)
  res.status(err.statusCode || 500).json({
    success: false,
    msg: err.message || "Server Error",
  })
}

module.exports = errorHandler
