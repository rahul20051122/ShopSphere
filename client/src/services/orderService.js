import API from "./api";

// Create order
export const createOrderApi = async (orderData) => {
  const response = await API.post("/orders", orderData);
  return response.data;
};

// Get current user orders
export const getMyOrdersApi = async () => {
  const response = await API.get("/orders/myorders");
  return response.data;
};

// Get order details by ID
export const getOrderByIdApi = async (id) => {
  const response = await API.get(`/orders/${id}`);
  return response.data;
};

// Cancel pending order
export const cancelOrderApi = async (id) => {
  const response = await API.put(`/orders/${id}/cancel`);
  return response.data;
};

// Admin: Get all orders
export const getAllOrdersAdminApi = async (status = "All", search = "") => {
  const response = await API.get(`/orders/admin/all?status=${encodeURIComponent(status)}&search=${encodeURIComponent(search)}`);
  return response.data;
};

// Admin: Update order status
export const updateOrderStatusAdminApi = async (id, status) => {
  const response = await API.put(`/orders/admin/${id}/status`, { status });
  return response.data;
};

// Admin: Delete order
export const deleteOrderAdminApi = async (id) => {
  const response = await API.delete(`/orders/admin/${id}`);
  return response.data;
};
