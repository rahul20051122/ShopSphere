const express = require("express");
const router = express.Router();
const {
  createRazorpayOrder,
  createStripeIntent,
  handleWebhook
} = require("../controllers/paymentController");
const { protect } = require("../middleware/authMiddleware");

router.post("/razorpay", protect, createRazorpayOrder);
router.post("/stripe", protect, createStripeIntent);
router.post("/webhook", handleWebhook);

module.exports = router;
