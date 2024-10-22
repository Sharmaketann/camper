const express = require("express")
const dotenv = require("dotenv")
const colors = require("colors")
const connectDB = require("./config/db")
const logger = require("./middleware/logger")
const morgan = require("morgan")
const errorHandler = require("./middleware/error")
const nodemailer = require("nodemailer") // Import nodemailer

// Route files
const bootcamps = require("./routes/bootcamps")
const courses = require("./routes/courses")

dotenv.config({ path: "./config/config.env" })

// Connect to database
connectDB()

const app = express()

// Body parser
app.use(express.json())

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
}

// Nodemailer setup for sending emails
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

// Middleware to send an email on every route hit
// const sendEmailOnRouteHit = async (req, res, next) => {
//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: "sharmaketann@gmail.com", // Replace with recipient email
//     subject: `Route Hit: ${req.method} ${req.originalUrl}`,
//     text: `A request was made to the following route:\nMethod: ${
//       req.method
//     }\nURL: ${req.originalUrl}\nPayload: ${JSON.stringify(req.body, null, 2)}`,
//   }

//   try {
//     await transporter.sendMail(mailOptions)
//     console.log(`Email sent for route: ${req.originalUrl}`)
//   } catch (error) {
//     console.error(`Error sending email: ${error}`)
//   }
//   next() // Move to the next middleware or route handler
// }

// Use the middleware for all routes
// app.use(sendEmailOnRouteHit)

// Mount routers
app.use("/api/v1/bootcamps", bootcamps)
app.use("/api/v1/courses", courses)

// Error handling middleware
app.use(errorHandler)

const PORT = process.env.PORT || 3000

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.yellow.bold)
})

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Logged Error: ${err.message}`.red)
  server.close(() => process.exit(1))
})
