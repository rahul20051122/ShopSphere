import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCheckCircle,
  FiCreditCard,
  FiTruck,
  FiLock,
  FiArrowRight,
  FiArrowLeft,
  FiAlertCircle,
  FiCheck
} from "react-icons/fi";
import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { createOrderApi } from "../services/orderService";

const PAYMENT_METHODS = [
  {
    id: "COD",
    title: "CASH ON DELIVERY",
    subtitle: "Pay cash or UPI QR upon delivery",
    icon: FiTruck
  },
  {
    id: "Razorpay",
    title: "RAZORPAY SECURE",
    subtitle: "UPI, Cards & NetBanking",
    icon: FiCreditCard
  },
  {
    id: "Stripe",
    title: "STRIPE GLOBAL",
    subtitle: "International Credit & Debit Cards",
    icon: FiLock
  }
];

function Checkout() {
  const { cartItems, clearCart } = useContext(CartContext);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [apiError, setApiError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.price || 0) * (item.qty || 1),
    0
  );

  const discountAmount = subtotal > 0 ? Math.round(subtotal * 0.1) : 0;
  const deliveryCharge = subtotal > 5000 || subtotal === 0 ? 0 : 250;
  const taxableSubtotal = Math.max(0, subtotal - discountAmount);
  const gstTax = Math.round(taxableSubtotal * 0.18);
  const grandTotal = taxableSubtotal + gstTax + deliveryCharge;

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "FULL NAME REQUIRED";
    if (!formData.phone.trim()) newErrors.phone = "PHONE NUMBER REQUIRED";
    if (!formData.email.trim()) newErrors.email = "EMAIL ADDRESS REQUIRED";
    if (!formData.address.trim()) newErrors.address = "STREET ADDRESS REQUIRED";
    if (!formData.city.trim()) newErrors.city = "CITY REQUIRED";
    if (!formData.state.trim()) newErrors.state = "STATE REQUIRED";
    if (!formData.pincode.trim()) newErrors.pincode = "PINCODE REQUIRED";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setApiError("");
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const orderPayload = {
        orderItems: cartItems.map((item) => ({
          name: item.name,
          qty: item.qty,
          price: item.price,
          image: item.image,
          product: item._id
        })),
        shippingAddress: formData,
        paymentMethod,
        itemsPrice: subtotal,
        taxPrice: gstTax,
        shippingPrice: deliveryCharge,
        discountAmount,
        totalPrice: grandTotal
      };

      const data = await createOrderApi(orderPayload);
      setIsSubmitting(false);

      if (data && (data.success || data.order)) {
        setPlacedOrder(data.order);
        setIsOrderSuccess(true);
        clearCart();

        setTimeout(() => {
          navigate("/orders");
        }, 4000);
      } else {
        setApiError(data.message || "FAILED TO PLACE ORDER.");
      }
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      setApiError(err.response?.data?.message || err.message || "ERROR OCCURRED PLACING ORDER.");
    }
  };

  if (cartItems.length === 0 && !isOrderSuccess) {
    return (
      <div className="bg-white text-[#111111] min-h-[75vh] flex items-center justify-center px-4 font-montserrat">
        <div className="text-center p-10 border-2 border-[#111111] bg-[#f5f5f5] max-w-md w-full">
          <FiAlertCircle className="text-4xl text-[#111111] mx-auto mb-4" />
          <h2 className="text-2xl font-black uppercase text-[#111111] mb-2">NO ITEMS TO CHECKOUT</h2>
          <p className="text-xs text-[#666666] font-light mb-6">
            Your shopping bag is empty. Please select products to continue.
          </p>
          <Link to="/products" className="btn-fashion-black">
            <FiArrowLeft className="inline mr-2" />
            BROWSE PRODUCTS
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white text-[#111111] min-h-screen pb-24 pt-4 font-montserrat">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center gap-2 text-[11px] font-bold tracking-wider text-[#666666] uppercase mb-6">
          <Link to="/" className="hover:text-[#111111]">HOME</Link>
          <span>/</span>
          <Link to="/cart" className="hover:text-[#111111]">CART</Link>
          <span>/</span>
          <span className="text-[#111111] font-bold">CHECKOUT</span>
        </nav>

        <div className="mb-10 pb-4 border-b-2 border-[#111111]">
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-gray-500">
            FINAL STEP
          </span>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#111111] mt-1">
            Express Checkout
          </h1>
        </div>

        {apiError && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-300 text-rose-800 text-xs font-bold tracking-wider uppercase flex items-center gap-2">
            <FiAlertCircle />
            <span>{apiError}</span>
          </div>
        )}

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Forms */}
            <div className="lg:col-span-7 space-y-10">
              
              {/* Shipping Address */}
              <div className="space-y-6">
                <h2 className="text-xl font-black uppercase text-[#111111] border-b border-[#111111] pb-3">
                  1. Shipping Address
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#111111] mb-1">
                      FULL NAME *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="ALEXANDER VANCE"
                      className="w-full px-4 py-3 bg-[#f5f5f5] border border-[#111111] text-xs font-bold tracking-widest text-[#111111] uppercase focus:outline-none"
                    />
                    {errors.fullName && <span className="text-[10px] text-rose-600 font-bold mt-1 block uppercase">{errors.fullName}</span>}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#111111] mb-1">
                      PHONE NUMBER *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 bg-[#f5f5f5] border border-[#111111] text-xs font-bold tracking-widest text-[#111111] uppercase focus:outline-none"
                    />
                    {errors.phone && <span className="text-[10px] text-rose-600 font-bold mt-1 block uppercase">{errors.phone}</span>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#111111] mb-1">
                      EMAIL ADDRESS *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="ALEXANDER@EXAMPLE.COM"
                      className="w-full px-4 py-3 bg-[#f5f5f5] border border-[#111111] text-xs font-bold tracking-widest text-[#111111] uppercase focus:outline-none"
                    />
                    {errors.email && <span className="text-[10px] text-rose-600 font-bold mt-1 block uppercase">{errors.email}</span>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#111111] mb-1">
                      STREET ADDRESS *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="SUITE / STREET / APARTMENT"
                      className="w-full px-4 py-3 bg-[#f5f5f5] border border-[#111111] text-xs font-bold tracking-widest text-[#111111] uppercase focus:outline-none"
                    />
                    {errors.address && <span className="text-[10px] text-rose-600 font-bold mt-1 block uppercase">{errors.address}</span>}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#111111] mb-1">
                      CITY *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="MUMBAI"
                      className="w-full px-4 py-3 bg-[#f5f5f5] border border-[#111111] text-xs font-bold tracking-widest text-[#111111] uppercase focus:outline-none"
                    />
                    {errors.city && <span className="text-[10px] text-rose-600 font-bold mt-1 block uppercase">{errors.city}</span>}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#111111] mb-1">
                      STATE *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="MAHARASHTRA"
                      className="w-full px-4 py-3 bg-[#f5f5f5] border border-[#111111] text-xs font-bold tracking-widest text-[#111111] uppercase focus:outline-none"
                    />
                    {errors.state && <span className="text-[10px] text-rose-600 font-bold mt-1 block uppercase">{errors.state}</span>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#111111] mb-1">
                      PINCODE *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="400001"
                      className="w-full px-4 py-3 bg-[#f5f5f5] border border-[#111111] text-xs font-bold tracking-widest text-[#111111] uppercase focus:outline-none"
                    />
                    {errors.pincode && <span className="text-[10px] text-rose-600 font-bold mt-1 block uppercase">{errors.pincode}</span>}
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-6">
                <h2 className="text-xl font-black uppercase text-[#111111] border-b border-[#111111] pb-3">
                  2. Payment Method
                </h2>

                <div className="space-y-3">
                  {PAYMENT_METHODS.map((method) => {
                    const MethodIcon = method.icon;
                    const isSelected = paymentMethod === method.id;
                    return (
                      <div
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`p-5 border-2 transition-all cursor-pointer flex items-center justify-between gap-4 ${
                          isSelected
                            ? "bg-[#111111] text-white border-[#111111]"
                            : "bg-[#f5f5f5] text-[#111111] border-gray-300 hover:border-[#111111]"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <MethodIcon className="text-xl" />
                          <div>
                            <h4 className="text-xs font-bold tracking-widest uppercase">
                              {method.title}
                            </h4>
                            <p className="text-[11px] font-light mt-0.5 opacity-80">
                              {method.subtitle}
                            </p>
                          </div>
                        </div>

                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected ? "border-white bg-white text-[#111111]" : "border-gray-400"
                        }`}>
                          {isSelected && <FiCheck className="text-xs font-bold" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-5 sticky top-28 space-y-6">
              
              <div className="p-8 bg-[#111111] text-white border-2 border-[#111111] space-y-6">
                
                <h2 className="text-2xl font-black uppercase tracking-tight border-b border-gray-800 pb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex items-center justify-between gap-3 text-xs font-bold">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 aspect-[3/4] bg-gray-900 border border-gray-800 shrink-0 overflow-hidden">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-white truncate">{item.name}</p>
                          <p className="text-[10px] text-gray-400">QTY: {item.qty}</p>
                        </div>
                      </div>
                      <span className="font-black text-white shrink-0">
                        ₹{(item.price * item.qty).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2.5 pt-4 border-t border-gray-800 text-xs tracking-wider font-bold uppercase">
                  <div className="flex justify-between text-gray-400">
                    <span>SUBTOTAL</span>
                    <span className="text-white">₹{subtotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-emerald-400">
                    <span>DISCOUNT</span>
                    <span>-₹{discountAmount.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-gray-400">
                    <span>GST (18%)</span>
                    <span className="text-white">₹{gstTax.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-gray-400">
                    <span>SHIPPING</span>
                    {deliveryCharge === 0 ? (
                      <span className="text-white">FREE</span>
                    ) : (
                      <span className="text-white">₹{deliveryCharge}</span>
                    )}
                  </div>

                  <div className="border-t border-gray-800 pt-4 mt-2 flex justify-between items-baseline">
                    <span className="text-sm font-black text-white">TOTAL PAYABLE</span>
                    <span className="text-2xl font-black text-white">
                      ₹{grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 text-xs font-bold tracking-[0.25em] uppercase bg-white text-[#111111] hover:bg-gray-200 transition-colors flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>PLACING ORDER...</span>
                  ) : (
                    <>
                      <span>PLACE ORDER</span>
                      <FiArrowRight />
                    </>
                  )}
                </button>

              </div>

            </div>

          </div>
        </form>

      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {isOrderSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-md w-full bg-white border-2 border-[#111111] p-8 text-center shadow-2xl"
            >
              <div className="w-16 h-16 rounded-full bg-[#111111] text-white flex items-center justify-center mx-auto mb-6">
                <FiCheckCircle className="text-3xl" />
              </div>

              <h2 className="text-3xl font-black uppercase text-[#111111] tracking-tight">
                Order Confirmed
              </h2>
              <p className="text-xs text-[#666666] mt-2 font-light leading-relaxed">
                Thank you for shopping with SHOPSPHERE. Your order has been placed successfully.
              </p>

              <div className="mt-6 p-4 bg-[#f5f5f5] text-xs font-bold text-left space-y-2 border border-[#111111]">
                <div className="flex justify-between">
                  <span className="text-gray-500">ORDER ID:</span>
                  <span className="font-mono text-[#111111]">{placedOrder?._id || "ORD-894210"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">PAYMENT:</span>
                  <span className="text-[#111111] uppercase">{placedOrder?.paymentMethod || paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">TOTAL:</span>
                  <span className="text-[#111111]">₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Link to="/products" className="flex-1 py-3 bg-[#f5f5f5] text-[#111111] text-xs font-bold tracking-widest uppercase border border-[#111111] text-center">
                  CATALOGUE
                </Link>
                <Link to="/orders" className="flex-1 py-3 bg-[#111111] text-white text-xs font-bold tracking-widest uppercase text-center hover:bg-gray-800">
                  VIEW ORDERS
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default Checkout;