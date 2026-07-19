const express = require("express");
const router = express.Router();

const {
  createProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");

const { protect, admin } = require("../middleware/authMiddleware");

// Public routes
router.get("/", getProducts);
router.get("/:id", getSingleProduct);

// Admin protected routes
router.post("/", protect, admin, createProduct);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;