const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");

const ClientSchema = new Schema({
  Name: { type: String},
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
  Phone: {type: String}
},{
  versionKey: false,
  timestamps: true,
})

// Export the model
module.exports = mongoose.model("Client", ClientSchema);
