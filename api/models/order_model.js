const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Product"
  },
  quantity: {
    type: Number,
    required: true,
  },
  order_status: {
    type: String,
    required: false,
    default: "Placed",
  },
  created_at: {
    type: Date,
    required: true,
  },
  updated_at: {
    type: Date,
    required: false,
    default: null,
  },
});

module.exports = mongoose.model("Order", orderSchema);
