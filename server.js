const express = require("express")
const dotenv = require("dotenv")
const colors = require("colors")
const connectDB = require("./config/db")
const logger = require("./middleware/logger")
const morgan = require("morgan")

//Route files

const bootcamps = require("./routes/bootcamps")

dotenv.config({ path: "./config/config.env" })

//Connect to database
connectDB()

const app = express()

//Body parser
app.use(express.json())

// DEV logging middleware
if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"))
}

//Mount routers

app.use("/api/v1/bootcamps", bootcamps)

const PORT = process.env.PORT || 3000

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.yellow.bold)
})

process.on("unhandledRejection", (err, promise) => {
  console.log(`Logged Error: ${err}`.red)
  server.close(() => process.exit(1))
})
