const express = require("express");
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderController");

const { protect, admin } = require("../middleware/authMiddleware");

/* ======================================================
   USER ROUTES
====================================================== */

// Create Order
router.post("/", protect, createOrder);

// Get Logged-in User Orders
router.get("/my", protect, getMyOrders);

// (Optional - Backward Compatibility)
router.get("/myorders", protect, getMyOrders);

// Get Single Order
router.get("/:id", protect, getOrderById);

// Cancel Order
router.put("/:id/cancel", protect, cancelOrder);

/* ======================================================
   ADMIN ROUTES
====================================================== */

// Get All Orders
router.get("/admin/all", protect, admin, getAllOrders);

// Update Order Status
router.put("/admin/:id/status", protect, admin, updateOrderStatus);

// Delete Order
router.delete("/admin/:id", protect, admin, deleteOrder);

module.exports = router;