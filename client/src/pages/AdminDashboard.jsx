import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiShoppingBag,
  FiDollarSign,
  FiClock,
  FiCheckCircle,
  FiSearch,
  FiFilter,
  FiTrash2,
  FiEdit3,
  FiPlus,
  FiXCircle,
  FiRefreshCw,
  FiCpu,
  FiCheck,
  FiAlertCircle,
  FiChevronDown,
  FiUploadCloud,
  FiImage,
  FiLayers,
  FiPieChart,
  FiTrendingUp,
  FiUsers,
  FiChevronLeft,
  FiChevronRight
} from "react-icons/fi";
import {
  getAllOrdersAdminApi,
  updateOrderStatusAdminApi,
  deleteOrderAdminApi
} from "../services/orderService";
import {
  getProducts,
  createProductAdmin,
  updateProductAdmin,
  deleteProductAdmin
} from "../services/productService";

const CATEGORIES = ["Electronics", "Fashion", "Mobiles", "Home", "Beauty"];
const STATUS_OPTIONS = ["Pending", "Confirmed", "Packed", "Shipped", "Out For Delivery", "Delivered", "Cancelled"];
const PRODUCT_STATUSES = ["Active", "Out of Stock", "Hidden"];

// Mock Monthly Revenue Trend for SVG Line Chart
const MONTHLY_REVENUE_DATA = [
  { month: "Jan", revenue: 45000 },
  { month: "Feb", revenue: 68000 },
  { month: "Mar", revenue: 52000 },
  { month: "Apr", revenue: 89000 },
  { month: "May", revenue: 110000 },
  { month: "Jun", revenue: 145000 }
];

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("products"); // 'products', 'orders', 'analytics'

  // --- ORDERS STATE ---
  const [orders, setOrders] = useState([]);
  const [orderStats, setOrderStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    pendingCount: 0,
    deliveredCount: 0
  });
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("All");

  // --- PRODUCTS STATE ---
  const [products, setProducts] = useState([]);
  const [productStats, setProductStats] = useState({
    total: 0,
    active: 0,
    lowStock: 0,
    categoriesCount: CATEGORIES.length
  });
  const [productsLoading, setProductsLoading] = useState(true);
  const [productSearch, setProductSearch] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("All");
  const [productStatusFilter, setProductStatusFilter] = useState("All");
  const [productSort, setProductSort] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal & Toast States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  // Product Form State
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    category: "Electronics",
    brand: "",
    price: "",
    stock: "",
    status: "Active",
    images: []
  });
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (activeTab === "orders" || activeTab === "analytics") {
      fetchAdminOrders();
    }
    if (activeTab === "products" || activeTab === "analytics") {
      fetchAdminProducts();
    }
  }, [activeTab, orderStatusFilter, productCategoryFilter, productStatusFilter, productSort, currentPage]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  // API Fetchers
  const fetchAdminOrders = async () => {
    setOrdersLoading(true);
    try {
      const data = await getAllOrdersAdminApi(orderStatusFilter, orderSearch);
      if (data && data.success) {
        setOrders(data.orders || []);
        if (data.stats) setOrderStats(data.stats);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchAdminProducts = async () => {
    setProductsLoading(true);
    try {
      const data = await getProducts({
        search: productSearch,
        category: productCategoryFilter,
        status: productStatusFilter,
        sort: productSort,
        page: currentPage,
        limit: 8
      });
      if (data && data.success) {
        setProducts(data.products || []);
        setTotalPages(data.totalPages || 1);
        const total = data.totalProducts || data.products.length;
        const active = (data.products || []).filter((p) => p.status === "Active").length;
        const lowStock = (data.products || []).filter((p) => p.stock <= 5).length;
        setProductStats({ total, active, lowStock, categoriesCount: CATEGORIES.length });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProductsLoading(false);
    }
  };

  // Product Handlers
  const openAddProductModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: "",
      description: "",
      category: "Electronics",
      brand: "",
      price: "",
      stock: "",
      status: "Active",
      images: []
    });
    setImageUrlInput("");
    setFormErrors({});
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name || "",
      description: prod.description || "",
      category: prod.category || "Electronics",
      brand: prod.brand || "",
      price: prod.price !== undefined ? prod.price : "",
      stock: prod.stock !== undefined ? prod.stock : "",
      status: prod.status || "Active",
      images: prod.images && prod.images.length > 0 ? prod.images : (prod.image ? [prod.image] : [])
    });
    setImageUrlInput("");
    setFormErrors({});
    setIsProductModalOpen(true);
  };

  const handleAddImageUrl = () => {
    if (imageUrlInput.trim()) {
      setProductForm((prev) => ({
        ...prev,
        images: [...prev.images, imageUrlInput.trim()]
      }));
      setImageUrlInput("");
    }
  };

  const handleRemoveImage = (index) => {
    setProductForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductForm((prev) => ({
          ...prev,
          images: [...prev.images, reader.result]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const validateProductForm = () => {
    const errs = {};
    if (!productForm.name.trim()) errs.name = "Product name is required";
    if (!productForm.description.trim()) errs.description = "Description is required";
    if (!productForm.brand.trim()) errs.brand = "Brand is required";
    if (!productForm.price || Number(productForm.price) <= 0) errs.price = "Valid price is required";
    if (productForm.stock === "" || Number(productForm.stock) < 0) errs.stock = "Valid stock count is required";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!validateProductForm()) return;

    setIsSubmittingProduct(true);
    try {
      const payload = {
        ...productForm,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
        image: productForm.images[0] || ""
      };

      let res;
      if (editingProduct) {
        res = await updateProductAdmin(editingProduct._id, payload);
      } else {
        res = await createProductAdmin(payload);
      }

      if (res && res.success) {
        showToast(editingProduct ? "Product updated successfully!" : "Product created successfully!");
        setIsProductModalOpen(false);
        fetchAdminProducts();
      }
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || "Failed to save product.");
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  const confirmDeleteProduct = async () => {
    if (!deletingProduct) return;
    try {
      const res = await deleteProductAdmin(deletingProduct._id);
      if (res && res.success) {
        showToast("Product deleted successfully");
        setDeletingProduct(null);
        fetchAdminProducts();
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to delete product.");
    }
  };

  // Order Actions
  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      const data = await updateOrderStatusAdminApi(orderId, newStatus);
      if (data && data.success) {
        showToast(`Order status updated to "${newStatus}"`);
        fetchAdminOrders();
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to update status.");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Delete order record permanently?")) return;
    try {
      const data = await deleteOrderAdminApi(orderId);
      if (data && data.success) {
        showToast("Order record deleted");
        fetchAdminOrders();
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to delete order.");
    }
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen pb-24 pt-4">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-5 z-50 bg-slate-900 border border-amber-500/40 text-amber-300 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold backdrop-blur-xl"
          >
            <FiCheck className="text-amber-400 text-base" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title & Tab Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-slate-900">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-400 text-[10px] font-black uppercase border border-amber-500/20">
                👑 Admin Control Center
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Management Portal
            </h1>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800 shrink-0 overflow-x-auto">
            <button
              onClick={() => setActiveTab("products")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "products"
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <FiLayers />
              <span>Products</span>
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "orders"
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <FiShoppingBag />
              <span>Orders</span>
            </button>

            <button
              onClick={() => setActiveTab("analytics")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "analytics"
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <FiPieChart />
              <span>Analytics</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: PRODUCTS MANAGEMENT MODULE */}
        {/* ========================================================================= */}
        {activeTab === "products" && (
          <div className="space-y-8">
            
            {/* Products Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl flex items-center gap-4 shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center text-xl">
                  <FiLayers />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Catalog Size</span>
                  <p className="text-2xl font-black text-white mt-0.5">{productStats.total}</p>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl flex items-center gap-4 shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xl">
                  <FiCheckCircle />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Listings</span>
                  <p className="text-2xl font-black text-emerald-400 mt-0.5">{productStats.active}</p>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl flex items-center gap-4 shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-rose-600/20 text-rose-400 border border-rose-500/30 flex items-center justify-center text-xl">
                  <FiAlertCircle />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Low Stock Alert</span>
                  <p className="text-2xl font-black text-rose-400 mt-0.5">{productStats.lowStock}</p>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl flex items-center gap-4 shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-xl">
                  <FiCpu />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Domain Categories</span>
                  <p className="text-2xl font-black text-amber-400 mt-0.5">{productStats.categoriesCount}</p>
                </div>
              </div>
            </div>

            {/* Product Control Bar */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-slate-900/40 border border-slate-800 backdrop-blur-xl">
              <button
                onClick={openAddProductModal}
                className="w-full lg:w-auto px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-xs font-extrabold rounded-2xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0"
              >
                <FiPlus className="text-base" />
                <span>Add New Product</span>
              </button>

              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setCurrentPage(1);
                    fetchAdminProducts();
                  }}
                  className="relative flex-1 min-w-[200px]"
                >
                  <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search name or brand..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </form>

                <select
                  value={productCategoryFilter}
                  onChange={(e) => {
                    setProductCategoryFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                <select
                  value={productStatusFilter}
                  onChange={(e) => {
                    setProductStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  {PRODUCT_STATUSES.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>

                <select
                  value={productSort}
                  onChange={(e) => setProductSort(e.target.value)}
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                </select>
              </div>
            </div>

            {/* Products Table */}
            {productsLoading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-24 rounded-2xl bg-slate-900/40 border border-slate-850 animate-pulse" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="space-y-4">
                <AnimatePresence>
                  {products.map((prod) => (
                    <motion.div
                      key={prod._id}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="p-5 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <img
                          src={prod.image || prod.images?.[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=200"}
                          alt={prod.name}
                          className="w-16 h-16 rounded-2xl object-contain bg-slate-950 border border-slate-800 p-1.5 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                              {prod.category}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-400">
                              Brand: <strong className="text-slate-200">{prod.brand}</strong>
                            </span>
                          </div>
                          <h3 className="text-sm font-bold text-white truncate">{prod.name}</h3>
                          <p className="text-xs text-slate-400 truncate max-w-md mt-0.5">{prod.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-xs shrink-0">
                        <div>
                          <span className="text-slate-500 block">Unit Price</span>
                          <span className="font-extrabold text-white text-base">₹{prod.price?.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Stock Remaining</span>
                          <span className={`font-bold ${prod.stock <= 5 ? "text-rose-400" : "text-slate-200"}`}>
                            {prod.stock} units
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Status</span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                            prod.status === "Active"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : prod.status === "Out of Stock"
                              ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                              : "bg-slate-800 text-slate-400 border-slate-700"
                          }`}>
                            {prod.status || "Active"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => openEditProductModal(prod)}
                          className="p-2.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded-xl transition-colors cursor-pointer border border-slate-700"
                        >
                          <FiEdit3 className="text-base" />
                        </button>
                        <button
                          onClick={() => setDeletingProduct(prod)}
                          className="p-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl transition-colors cursor-pointer"
                        >
                          <FiTrash2 className="text-base" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <div className="flex items-center justify-between pt-6 text-xs text-slate-400">
                  <span>Showing Page {currentPage} of {totalPages}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage <= 1}
                      className="p-2 bg-slate-900 border border-slate-800 rounded-xl hover:text-white disabled:opacity-40 cursor-pointer"
                    >
                      <FiChevronLeft className="text-base" />
                    </button>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage >= totalPages}
                      className="p-2 bg-slate-900 border border-slate-800 rounded-xl hover:text-white disabled:opacity-40 cursor-pointer"
                    >
                      <FiChevronRight className="text-base" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center bg-slate-900/20 rounded-3xl border border-slate-900">
                <FiAlertCircle className="text-3xl text-slate-500 mx-auto mb-2" />
                <p className="text-slate-400 text-sm font-semibold">No products found matching filters.</p>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: ORDERS MANAGEMENT MODULE */}
        {/* ========================================================================= */}
        {activeTab === "orders" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl flex items-center gap-4 shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xl">
                  <FiDollarSign />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Revenue</span>
                  <p className="text-2xl font-black text-white mt-0.5">₹{orderStats.totalRevenue?.toLocaleString()}</p>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl flex items-center gap-4 shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center text-xl">
                  <FiShoppingBag />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Orders</span>
                  <p className="text-2xl font-black text-white mt-0.5">{orderStats.totalOrders}</p>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl flex items-center gap-4 shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-xl">
                  <FiClock />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pending Orders</span>
                  <p className="text-2xl font-black text-amber-400 mt-0.5">{orderStats.pendingCount}</p>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl flex items-center gap-4 shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center text-xl">
                  <FiCheckCircle />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Delivered Orders</span>
                  <p className="text-2xl font-black text-cyan-400 mt-0.5">{orderStats.deliveredCount}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/40 p-4 rounded-3xl border border-slate-800 backdrop-blur-xl">
              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                {["All", ...STATUS_OPTIONS].map((status) => (
                  <button
                    key={status}
                    onClick={() => setOrderStatusFilter(status)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      orderStatusFilter === status
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md"
                        : "bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  fetchAdminOrders();
                }}
                className="relative w-full md:w-72"
              >
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search Order ID or Name..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </form>
            </div>

            {ordersLoading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-28 rounded-2xl bg-slate-900/40 border border-slate-850 animate-pulse" />
                ))}
              </div>
            ) : orders.length > 0 ? (
              <div className="space-y-4">
                <AnimatePresence>
                  {orders.map((order) => (
                    <motion.div
                      key={order._id}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="p-5 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-xl"
                    >
                      <div className="space-y-1 min-w-[220px]">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-white">#{order._id}</span>
                        </div>
                        <p className="text-xs font-bold text-slate-300">
                          {order.shippingAddress?.fullName || order.user?.name || "Customer"}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {order.shippingAddress?.email || order.user?.email} • {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-6 text-xs">
                        <div>
                          <span className="text-slate-500 block">Total Revenue</span>
                          <span className="font-black text-white text-base">₹{order.totalPrice?.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Payment Method</span>
                          <span className="font-bold text-slate-300 uppercase">{order.paymentMethod}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Items</span>
                          <span className="font-bold text-slate-300">{order.orderItems?.length || 1} Products</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-850">
                        <div className="relative">
                          <select
                            value={order.status}
                            onChange={(e) => handleOrderStatusChange(order._id, e.target.value)}
                            className="appearance-none px-3.5 py-2 pr-8 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                          >
                            {STATUS_OPTIONS.map((st) => (
                              <option key={st} value={st} className="bg-slate-900 text-white">
                                {st}
                              </option>
                            ))}
                          </select>
                          <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none" />
                        </div>

                        <button
                          onClick={() => handleDeleteOrder(order._id)}
                          className="p-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl transition-colors cursor-pointer"
                        >
                          <FiTrash2 className="text-sm" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="py-16 text-center bg-slate-900/20 rounded-3xl border border-slate-900">
                <FiAlertCircle className="text-3xl text-slate-500 mx-auto mb-2" />
                <p className="text-slate-400 text-sm font-semibold">No orders found matching filters.</p>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: ANALYTICS & INSIGHTS DASHBOARD */}
        {/* ========================================================================= */}
        {activeTab === "analytics" && (
          <div className="space-y-8">
            
            {/* Analytics KPI Header */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl shadow-xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center text-xl">
                  <FiTrendingUp />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">MoM Growth Rate</span>
                  <p className="text-2xl font-black text-indigo-400 mt-0.5">+31.8%</p>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl shadow-xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xl">
                  <FiDollarSign />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Avg Order Value</span>
                  <p className="text-2xl font-black text-emerald-400 mt-0.5">₹8,450</p>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl shadow-xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center text-xl">
                  <FiUsers />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Customers</span>
                  <p className="text-2xl font-black text-purple-400 mt-0.5">1,240</p>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl shadow-xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-xl">
                  <FiShoppingBag />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Conversion Rate</span>
                  <p className="text-2xl font-black text-amber-400 mt-0.5">4.2%</p>
                </div>
              </div>
            </div>

            {/* SVG Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Revenue Trend Line Chart */}
              <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl shadow-xl">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-850">
                  <div>
                    <h3 className="text-lg font-bold text-white">Monthly Sales & Revenue Trajectory</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Cumulative earnings across recent quarters</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                    Live Telemetry
                  </span>
                </div>

                {/* SVG Curve Line Chart */}
                <div className="h-64 w-full relative pt-4">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200">
                    <defs>
                      <linearGradient id="gradientRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Gridlines */}
                    <line x1="0" y1="40" x2="500" y2="40" stroke="#1e293b" strokeDasharray="4" />
                    <line x1="0" y1="90" x2="500" y2="90" stroke="#1e293b" strokeDasharray="4" />
                    <line x1="0" y1="140" x2="500" y2="140" stroke="#1e293b" strokeDasharray="4" />

                    {/* Area fill */}
                    <path
                      d="M 20,160 Q 100,130 180,145 T 340,70 T 480,30 L 480,180 L 20,180 Z"
                      fill="url(#gradientRev)"
                    />

                    {/* Line path */}
                    <path
                      d="M 20,160 Q 100,130 180,145 T 340,70 T 480,30"
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />

                    {/* Data Points */}
                    {MONTHLY_REVENUE_DATA.map((d, index) => {
                      const x = 20 + index * 92;
                      const yArr = [160, 130, 145, 95, 70, 30];
                      const y = yArr[index];
                      return (
                        <g key={d.month} className="group cursor-pointer">
                          <circle cx={x} cy={y} r="5" fill="#ec4899" stroke="#0f172a" strokeWidth="2" />
                          <text x={x} y="195" fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="bold">
                            {d.month}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* Category Share Donut / Pie Chart */}
              <div className="lg:col-span-4 p-6 sm:p-8 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl shadow-xl flex flex-col justify-between">
                <div className="mb-4 pb-3 border-b border-slate-850">
                  <h3 className="text-lg font-bold text-white">Category Distribution</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Top performing product domains</p>
                </div>

                {/* SVG Donut Chart */}
                <div className="relative w-44 h-44 mx-auto flex items-center justify-center my-4">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#1e293b"
                      strokeWidth="3.8"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="3.8"
                      strokeDasharray="40, 100"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#ec4899"
                      strokeWidth="3.8"
                      strokeDasharray="25, 100"
                      strokeDashoffset="-40"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="3.8"
                      strokeDasharray="20, 100"
                      strokeDashoffset="-65"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-xl font-black text-white">40%</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Electronics</span>
                  </div>
                </div>

                {/* Legend */}
                <div className="space-y-2 text-xs pt-4 border-t border-slate-850">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-slate-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Electronics
                    </span>
                    <span className="font-bold text-white">40%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-slate-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-pink-500" /> Fashion
                    </span>
                    <span className="font-bold text-white">25%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-slate-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Mobiles
                    </span>
                    <span className="font-bold text-white">20%</span>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>

      {/* Product Edit / Add Modals & Confirmation */}
      <AnimatePresence>
        {isProductModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="max-w-3xl w-full bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <h3 className="text-xl font-bold text-white">
                  {editingProduct ? "Edit Product Details" : "Create New Product Listing"}
                </h3>
                <button
                  onClick={() => setIsProductModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <FiXCircle className="text-2xl" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-300 mb-1">Product Name *</label>
                    <input
                      type="text"
                      required
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      placeholder="e.g. Quantum Pods Ultra Max"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Category *</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Brand Name *</label>
                    <input
                      type="text"
                      required
                      value={productForm.brand}
                      onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                      placeholder="e.g. Apex AI"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Price (₹) *</label>
                    <input
                      type="number"
                      required
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      placeholder="12999"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Stock Count *</label>
                    <input
                      type="number"
                      required
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                      placeholder="25"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-300 mb-1">Listing Status</label>
                    <select
                      value={productForm.status}
                      onChange={(e) => setProductForm({ ...productForm, status: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                    >
                      {PRODUCT_STATUSES.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-300 mb-1">Product Description *</label>
                    <textarea
                      rows={3}
                      required
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      placeholder="Enter detailed features, specifications, and specs..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-800">
                  <label className="block text-xs font-bold text-slate-300">Product Images & Cloud Uploader</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      placeholder="Paste Image URL (https://...)"
                      className="flex-1 px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white rounded-xl transition-colors cursor-pointer"
                    >
                      Add URL
                    </button>
                  </div>

                  <div className="relative border-2 border-dashed border-slate-800 hover:border-amber-500/50 rounded-2xl p-6 text-center bg-slate-950/40 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <FiUploadCloud className="text-3xl text-slate-500 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-slate-300">
                      Drag & drop images here, or <span className="text-amber-400 hover:underline">browse files</span>
                    </p>
                  </div>

                  {productForm.images.length > 0 && (
                    <div className="flex items-center gap-3 overflow-x-auto pt-2">
                      {productForm.images.map((img, i) => (
                        <div key={i} className="relative w-20 h-20 rounded-xl bg-slate-950 border border-slate-800 p-1 shrink-0 group">
                          <img src={img} alt={`Preview ${i}`} className="w-full h-full object-contain rounded-lg" />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(i)}
                            className="absolute -top-2 -right-2 p-1 bg-rose-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                          >
                            <FiXCircle />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="px-5 py-2.5 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingProduct}
                    className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-xl shadow-lg hover:from-amber-400 hover:to-orange-400 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSubmittingProduct ? "Saving Product..." : editingProduct ? "Update Product" : "Create Product"}
                  </button>
                </div>
              </form>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deletingProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="max-w-sm w-full bg-slate-900 border border-slate-800 p-6 rounded-3xl text-center shadow-2xl relative"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
                <FiTrash2 className="text-xl" />
              </div>

              <h3 className="text-lg font-bold text-white mb-2">Delete Product?</h3>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                Are you sure you want to permanently remove <strong className="text-white">"{deletingProduct.name}"</strong>?
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setDeletingProduct(null)}
                  className="flex-1 py-2.5 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteProduct}
                  className="flex-1 py-2.5 bg-rose-600 text-white text-xs font-bold rounded-xl hover:bg-rose-500 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default AdminDashboard;