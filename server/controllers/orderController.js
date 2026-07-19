const Order = require("../models/Order");

// Create Order (User)
const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      discountAmount,
      totalPrice
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No order items provided"
      });
    }

    if (!shippingAddress || !shippingAddress.address || !shippingAddress.city) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is incomplete"
      });
    }

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || "COD",
      paymentStatus: paymentMethod === "COD" ? "Pending" : "Completed",
      itemsPrice,
      taxPrice,
      shippingPrice,
      discountAmount,
      totalPrice
    });

    res.status(201).json({
      success: true,
      message: "Order Placed Successfully",
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Logged-In User Orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Single Order By ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Verify ownership or admin role
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this order"
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Cancel Order (User or Admin - only if Pending)
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    if (order.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel this order"
      });
    }

    if (order.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel order that has already been processed or shipped"
      });
    }

    order.status = "Cancelled";
    order.cancelledAt = Date.now();
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get All Orders (Admin)
const getAllOrders = async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = {};

    if (status && status !== "All") {
      query.status = status;
    }

    let orders = await Order.find(query)
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    if (search && search.trim()) {
      const s = search.trim().toLowerCase();
      orders = orders.filter((o) => {
        const idMatch = o._id.toString().toLowerCase().includes(s);
        const nameMatch = o.shippingAddress?.fullName?.toLowerCase().includes(s);
        const emailMatch = o.shippingAddress?.email?.toLowerCase().includes(s);
        return idMatch || nameMatch || emailMatch;
      });
    }

    // Revenue statistics
    const totalRevenue = orders.reduce((acc, item) => item.status !== "Cancelled" ? acc + item.totalPrice : acc, 0);
    const pendingCount = orders.filter((o) => o.status === "Pending").length;
    const deliveredCount = orders.filter((o) => o.status === "Delivered").length;

    res.status(200).json({
      success: true,
      count: orders.length,
      stats: {
        totalRevenue,
        totalOrders: orders.length,
        pendingCount,
        deliveredCount
      },
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update Order Status (Admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    order.status = status || order.status;

    if (status === "Delivered") {
      order.deliveredAt = Date.now();
      order.paymentStatus = "Completed";
    } else if (status === "Cancelled") {
      order.cancelledAt = Date.now();
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete Order (Admin)
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    await Order.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Order deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  deleteOrder
};