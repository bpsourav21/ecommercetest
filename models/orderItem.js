const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderItemSchema = new Schema({
  ProductId: { type: Schema.Types.ObjectId, ref: "Product" },
  Quantity: { type: Number },
  TotalPrice: { type: Number },
  Size: {
    type: String,
    enum: ["s", "m", "xl", "xx"],
    default: "s",
  },
  OrderId: { type: Schema.Types.ObjectId, ref: "Order" },
});

// Export the model
module.exports = mongoose.model("OrderItem", OrderItemSchema);
