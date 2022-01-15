const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const validator = require("validator");

const UserSchema = new Schema(
  {
    Name: { type: String, required: true, max: 100 },
    Email: {
      type: String,
      validate: {
        validator: validator.isEmail,
        message: "EMAIL_IS_NOT_VALID",
      },
      lowercase: true,
      unique: true,
      required: true,
    },
    Phone: { type: String },
    Occupation: { type: String },
    Password: { type: String },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const hash = (user, salt, next) => {
  bcrypt.hash(user.Password, salt, (error, newHash) => {
    if (error) {
      return next(error);
    }
    user.Password = newHash;
    return next();
  });
};

const genSalt = (user, SALT_FACTOR, next) => {
  bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
    if (err) {
      return next(err);
    }
    return hash(user, salt, next);
  });
};

UserSchema.pre("save", function (next) {
  const that = this;
  const SALT_FACTOR = 5;
  if (!that.isModified("Password")) {
    return next();
  }
  return genSalt(that, SALT_FACTOR, next);
});

UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.Password);
};

// Export the model
module.exports = mongoose.model("User", UserSchema);
