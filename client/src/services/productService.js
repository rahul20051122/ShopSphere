import API from "./api";

// Get All Products (Supports Search, Filters, Sorting & Pagination)
export const getProducts = async (params = {}) => {
  const query = new URLSearchParams();
  
  if (params.search) query.append("search", params.search);
  if (params.category && params.category !== "All") query.append("category", params.category);
  if (params.brand && params.brand !== "All") query.append("brand", params.brand);
  if (params.status && params.status !== "All") query.append("status", params.status);
  if (params.sort) query.append("sort", params.sort);
  if (params.page) query.append("page", params.page);
  if (params.limit) query.append("limit", params.limit);

  const queryString = query.toString() ? `?${query.toString()}` : "";
  const response = await API.get(`/products${queryString}`);
  return response.data;
};

// Get Single Product By ID
export const getSingleProduct = async (id) => {
  const response = await API.get(`/products/${id}`);
  return response.data;
};

// Admin: Create Product
export const createProductAdmin = async (productData) => {
  const response = await API.post("/products", productData);
  return response.data;
};

// Admin: Update Product
export const updateProductAdmin = async (id, productData) => {
  const response = await API.put(`/products/${id}`, productData);
  return response.data;
};

// Admin: Delete Product
export const deleteProductAdmin = async (id) => {
  const response = await API.delete(`/products/${id}`);
  return response.data;
};