const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuantitySchema = new Schema({
  ProductId: {
    type: Schema.Types.ObjectId,
  },
  Quantity: { type: Number },
});

QuantitySchema.pre("save", function (next) {
  this.ProductId = this._id;
  return next();
});

// Export the model
module.exports = mongoose.model("Quantity", QuantitySchema);
