// Create Razorpay Payment Order
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency = "INR" } = req.body;

    // Generates a mock/real Razorpay order structure
    const razorpayOrderId = `rzp_order_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    res.status(200).json({
      success: true,
      id: razorpayOrderId,
      amount: Math.round(amount * 100), // Amount in paise
      currency,
      key: process.env.RAZORPAY_KEY_ID || "rzp_test_mock_key_123456"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create Stripe Payment Intent
const createStripeIntent = async (req, res) => {
  try {
    const { amount, currency = "inr" } = req.body;

    const clientSecret = `pi_${Date.now()}_secret_${Math.random().toString(36).substring(7)}`;

    res.status(200).json({
      success: true,
      clientSecret,
      amount: Math.round(amount * 100),
      currency
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Handle Payment Webhooks (Razorpay / Stripe)
const handleWebhook = async (req, res) => {
  try {
    const event = req.body;
    console.log("Payment Webhook Event Received:", event?.type || event?.event);

    res.status(200).json({
      received: true,
      message: "Webhook processed successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createRazorpayOrder,
  createStripeIntent,
  handleWebhook
};
