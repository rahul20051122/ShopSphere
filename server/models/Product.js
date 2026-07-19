const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    brand: {
      type: String,
      required: true
    },
    stock: {
      type: Number,
      required: true,
      default: 0
    },
    image: {
      type: String,
      default: ""
    },
    images: [
      {
        type: String
      }
    ],
    status: {
      type: String,
      enum: ["Active", "Out of Stock", "Hidden"],
      default: "Active"
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Product", productSchema);