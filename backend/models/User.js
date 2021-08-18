const crypto = require("crypto");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please add a username"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minLength: [6, "Password must be at least 6 characters"],
      maxLength: [18, "Password must be more than 18 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["User", "Admin"],
      required: true,
      default: "User",
    },
    credentials: {
      image: String,
      phone: {
        mobile: String,
        office: String,
      },
      address: {
        type: String,
        maxLength: 250,
      },
      age: {
        type: Number,
      },
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Hash password and update and call this before save.
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Comparation entered password with current password in db
userSchema.methods.comparedPassword = async function (enteredPwd) {
  return await bcrypt.compare(enteredPwd, this.password);
};

// Sign JWT and return it.
userSchema.methods.getSignJwtToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
};

// Generate reset token id for reset password
userSchema.methods.getResetPasswordToken = function () {
  // Token Id
  const tokenId = crypto.randomBytes(20).toString("hex");

  // Hashed reset token and save to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(tokenId)
    .digest("hex");

  // Set expired time to reset token and save to resetPasswordExpire field
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return tokenId;
};

module.exports = mongoose.model("User", userSchema);
