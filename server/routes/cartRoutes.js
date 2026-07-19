const express = require("express");
const router = express.Router();

const {
  addToCart,
  getCartItems,
  deleteCartItem
} = require("../controllers/cartController");

router.route("/")
  .post(addToCart)
  .get(getCartItems);

router.route("/:id")
  .delete(deleteCartItem);

module.exports = router;