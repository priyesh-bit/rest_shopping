const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const productSchema = new Schema({
  id: {
    type: ObjectId,
    unique: true,
    required: true,
  },
  name: String,
  price: Number,
  category: String,
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

module.exports = mongoose.model("Product", productSchema);
