const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: 6,
      select: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    role: {
      type: String,
      enum: ["user", "publisher"],
      default: "user",
    },
    // photo: {
    //   type: String,
    //   default: "default.jpg",
    // },
    // phone: {
    //   type: String,
    //   maxlength: [20, "Phone number can not be longer than 20 characters"],
    // },
    // address: {
    //   type: String,
    //   required: [true, "Please add an address"],
    // },
  },
  {
    timestamps: true,
  }
)

// Encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

//sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  })
}

// match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model("User", UserSchema)
