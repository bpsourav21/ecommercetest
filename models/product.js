const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    Name: { type: String, required: true, max: 100 },
    Price: { type: Number },
    Details: { type: String },
    Quantity: { type: Schema.Types.ObjectId, ref: "Quantity" },
    Sizes: {
      type: [String],
      enum: ["s", "m", "xl", "xx"],
      default: "s",
    },
    SKU: { type: String, default: "" },
    Product_images: { type: [String] },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

// Export the model
module.exports = mongoose.model("Product", ProductSchema);
