const Cart = require("../models/Cart");

// Add To Cart
const addToCart = async (req, res) => {
  try {
    const cartItem = await Cart.create(req.body);

    res.status(201).json({
      success: true,
      cartItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Cart Items
const getCartItems = async (req, res) => {
  try {
    const items = await Cart.find()
      .populate("product")
      .populate("user", "-password");

    res.status(200).json({
      success: true,
      count: items.length,
      items
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete Cart Item
const deleteCartItem = async (req, res) => {
  try {
    const item = await Cart.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found"
      });
    }

    await Cart.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Item removed from cart"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  addToCart,
  getCartItems,
  deleteCartItem
};