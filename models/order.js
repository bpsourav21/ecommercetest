const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    OrderId: { type: String, unique: true },
    ClientId: { type: Schema.Types.ObjectId, ref: "Client" },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

OrderSchema.pre("save", function (next) {
  this.OrderId = this._id;
  return next();
});

// Export the model
module.exports = mongoose.model("Order", OrderSchema);
