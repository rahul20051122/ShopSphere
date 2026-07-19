import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiChevronRight,
  FiXCircle,
  FiArrowRight,
  FiDownload,
  FiCheck,
  FiPackage
} from "react-icons/fi";
import { getMyOrdersApi, cancelOrderApi } from "../services/orderService";

const STATUS_STEPS = ["Pending", "Confirmed", "Packed", "Shipped", "Out For Delivery", "Delivered"];

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getMyOrdersApi();
      if (data && data.orders) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error("Error loading orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this pending order?")) return;
    setCancellingId(orderId);
    try {
      const data = await cancelOrderApi(orderId);
      if (data && data.success) {
        setToastMsg("ORDER CANCELLED SUCCESSFULLY");
        fetchOrders();
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(data.order);
        }
      }
    } catch (err) {
      console.error(err);
      setToastMsg("FAILED TO CANCEL ORDER.");
    } finally {
      setCancellingId(null);
      setTimeout(() => setToastMsg(""), 3500);
    }
  };

  const handleDownloadInvoice = () => {
    window.print();
  };

  const filteredOrders = orders.filter((o) => {
    if (activeTab === "All") return true;
    return o.status === activeTab;
  });

  const getStepProgressIndex = (status) => {
    if (status === "Cancelled") return -1;
    const index = STATUS_STEPS.indexOf(status);
    return index !== -1 ? index : 0;
  };

  return (
    <div className="bg-white text-[#111111] min-h-screen pb-24 pt-4 font-poppins">
      
      {/* Toast */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-5 z-50 bg-[#111111] text-white border border-[#d4af37] px-5 py-3 text-xs font-montserrat tracking-widest uppercase flex items-center gap-2 shadow-xl"
          >
            <FiCheck className="text-[#d4af37]" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-gray-200">
          <div>
            <span className="text-xs font-montserrat font-bold tracking-[0.3em] uppercase text-[#d4af37]">
              CLIENT DASHBOARD
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold uppercase tracking-tight text-[#111111] mt-1">
              Order History
            </h1>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            {["All", "Pending", "Shipped", "Delivered", "Cancelled"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-xs font-montserrat font-bold tracking-widest uppercase transition-all cursor-pointer ${
                  activeTab === tab
                    ? "bg-[#111111] text-white"
                    : "bg-[#f5f5f5] text-gray-700 hover:bg-[#111111] hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="space-y-6">
            <AnimatePresence>
              {filteredOrders.map((order) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 bg-[#f5f5f5] border border-gray-200 space-y-4"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-gray-300">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-montserrat text-sm font-bold text-[#111111] uppercase tracking-wider">
                          ORDER #{order._id}
                        </span>
                        <span className="px-2.5 py-0.5 bg-[#111111] text-[#d4af37] text-[10px] font-montserrat font-bold uppercase tracking-widest">
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#666666] font-light mt-1">
                        Placed on {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>

                    <div className="flex items-center gap-8 text-xs font-montserrat tracking-wider">
                      <div>
                        <span className="text-[#666666] block text-[10px] uppercase">TOTAL</span>
                        <span className="font-bold text-[#111111]">₹{order.totalPrice?.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[#666666] block text-[10px] uppercase">PAYMENT</span>
                        <span className="font-bold text-[#111111] uppercase">{order.paymentMethod}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-4 py-2 bg-[#111111] text-white text-xs font-montserrat font-bold tracking-widest uppercase hover:bg-[#d4af37] hover:text-[#111111] transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <span>DETAILS</span>
                        <FiChevronRight />
                      </button>

                      {order.status === "Pending" && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          disabled={cancellingId === order._id}
                          className="px-3 py-2 bg-rose-100 text-rose-800 text-xs font-montserrat font-bold tracking-widest uppercase hover:bg-rose-600 hover:text-white transition-all cursor-pointer disabled:opacity-50"
                        >
                          {cancellingId === order._id ? "CANCELING..." : "CANCEL"}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Items Preview Strip */}
                  <div className="flex items-center gap-3 overflow-x-auto pt-2">
                    {order.orderItems?.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-white p-2 pr-4 border border-gray-200 shrink-0">
                        <img
                          src={item.image || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=150"}
                          alt={item.name}
                          className="w-10 aspect-[3/4] object-cover"
                        />
                        <div>
                          <p className="text-xs font-serif font-bold text-[#111111] truncate max-w-[140px]">{item.name}</p>
                          <p className="text-[10px] font-montserrat text-[#666666]">QTY: {item.qty} × ₹{item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="py-20 text-center bg-[#f5f5f5] border border-gray-200">
            <FiPackage className="text-4xl text-gray-400 mx-auto mb-4" />
            <h3 className="font-serif text-2xl font-bold uppercase text-[#111111]">No Orders Found</h3>
            <p className="text-xs text-[#666666] font-light mt-1">You have no active orders in this view.</p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-[#111111] text-white text-xs font-montserrat font-bold tracking-widest uppercase hover:bg-[#d4af37] hover:text-[#111111] transition-all"
            >
              <span>SHOP NOW</span>
              <FiArrowRight />
            </Link>
          </div>
        )}

      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-2xl w-full bg-white border border-[#111111] p-8 max-h-[90vh] overflow-y-auto font-poppins relative"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div>
                  <span className="text-[10px] font-montserrat font-bold uppercase tracking-widest text-[#d4af37]">REFERENCE</span>
                  <h3 className="font-serif text-xl font-bold uppercase text-[#111111]">#{selectedOrder._id}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadInvoice}
                    className="px-3 py-1.5 bg-[#111111] text-white text-[10px] font-montserrat font-bold tracking-widest uppercase flex items-center gap-1"
                  >
                    <FiDownload />
                    <span>INVOICE</span>
                  </button>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-1.5 text-gray-500 hover:text-[#111111]"
                  >
                    <FiXCircle className="text-xl" />
                  </button>
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="py-6 border-b border-gray-200">
                <h4 className="text-[10px] font-montserrat font-bold uppercase tracking-[0.2em] text-[#111111] mb-4">
                  SHIPMENT TIMELINE
                </h4>
                {selectedOrder.status === "Cancelled" ? (
                  <p className="text-xs text-rose-700 font-montserrat uppercase font-bold">THIS ORDER HAS BEEN CANCELLED.</p>
                ) : (
                  <div className="grid grid-cols-6 text-center text-[9px] font-montserrat font-bold uppercase">
                    {STATUS_STEPS.map((step, idx) => {
                      const activeIdx = getStepProgressIndex(selectedOrder.status);
                      const done = idx <= activeIdx;
                      return (
                        <div key={step} className="space-y-1">
                          <div className={`w-6 h-6 rounded-full mx-auto flex items-center justify-center ${done ? "bg-[#111111] text-[#d4af37]" : "bg-gray-200 text-gray-500"}`}>
                            {done ? "✓" : idx + 1}
                          </div>
                          <span className={done ? "text-[#111111]" : "text-gray-400"}>{step}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Items */}
              <div className="py-6 border-b border-gray-200">
                <h4 className="text-[10px] font-montserrat font-bold uppercase tracking-[0.2em] text-[#111111] mb-3">
                  PRODUCTS
                </h4>
                <div className="space-y-3">
                  {selectedOrder.orderItems?.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-[#f5f5f5] text-xs font-montserrat">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-10 aspect-[3/4] object-cover" />
                        <div>
                          <p className="font-bold text-[#111111]">{item.name}</p>
                          <p className="text-[10px] text-gray-500">QTY: {item.qty} × ₹{item.price}</p>
                        </div>
                      </div>
                      <span className="font-bold text-[#d4af37]">₹{(item.price * item.qty).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-montserrat">
                <div className="p-4 bg-[#f5f5f5] space-y-1">
                  <span className="font-bold uppercase block text-[#111111] mb-2">SHIPPING ADDRESS</span>
                  <p className="font-bold">{selectedOrder.shippingAddress?.fullName}</p>
                  <p className="text-gray-600">{selectedOrder.shippingAddress?.address}</p>
                  <p className="text-gray-600">{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}</p>
                </div>
                <div className="p-4 bg-[#f5f5f5] space-y-2">
                  <span className="font-bold uppercase block text-[#111111] mb-2">FINANCIAL RECAP</span>
                  <div className="flex justify-between text-gray-600"><span>SUBTOTAL</span><span>₹{selectedOrder.itemsPrice?.toLocaleString()}</span></div>
                  <div className="flex justify-between text-gray-600"><span>GST</span><span>₹{selectedOrder.taxPrice?.toLocaleString()}</span></div>
                  <div className="flex justify-between font-bold text-[#111111] border-t border-gray-300 pt-2"><span>TOTAL</span><span className="text-[#d4af37]">₹{selectedOrder.totalPrice?.toLocaleString()}</span></div>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default Orders;