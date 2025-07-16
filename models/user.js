const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      min: 3,
      max: 12,
      required: true,
    },
    lastName: {
      type: String,
      min: 3,
      max: 12,
      required: true,
    },
    email: {
      type: String,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Not a valid email");
        }
      },
      required: true,
    },
    password: {
      type: String,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Not a Strong Password");
        }
      },
      required: true,
    },
    bio: {
      type: String,
      min: 3,
      max: 200,
      required: true,
    },
    gender: {
      type: String,
      validate(value) {
        const validGenders = ["male", "female", "others"];
        if (!validGenders.includes(value.toLowerCase())) {
          throw new Error("Enter a valid gender");
        }
      },
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const user = this;

  const token = await jwt.sign({ _id: user._id }, "PractiseBE@123", {
    expiresIn: "1h",
  });

  return token
};

userSchema.methods.validatePassword = async function (inputPassword) {
  const user = this;

  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(inputPassword, passwordHash);

  return isPasswordValid;
};

module.exports = mongoose.model("User", userSchema);
