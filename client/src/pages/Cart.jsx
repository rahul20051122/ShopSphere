import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiTrash2,
  FiArrowRight,
  FiShoppingBag,
  FiTag,
  FiArrowLeft,
  FiCheck,
  FiAlertCircle
} from "react-icons/fi";
import { CartContext } from "../context/CartContext";

function Cart() {
  const { cartItems, removeFromCart, updateQty } = useContext(CartContext);
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.price || 0) * (item.qty || 1),
    0
  );

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError("");
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      setCouponError("ENTER PROMO CODE");
      return;
    }

    if (code === "FASHION10" || code === "AI2026") {
      setAppliedCoupon({ code, type: "percent", value: 10 });
      setCouponCode("");
      showToast("10% DISCOUNT APPLIED!");
    } else {
      setCouponError("INVALID PROMO CODE. TRY 'FASHION10'");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    showToast("Coupon removed.");
  };

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === "percent") {
      discountAmount = Math.round((subtotal * appliedCoupon.value) / 100);
    }
  }

  const deliveryCharge = subtotal > 5000 || subtotal === 0 ? 0 : 250;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const gstTax = Math.round(taxableAmount * 0.18);
  const grandTotal = taxableAmount + gstTax + deliveryCharge;

  if (cartItems.length === 0) {
    return (
      <div className="bg-white text-[#111111] min-h-[75vh] flex items-center justify-center px-4 py-16 font-montserrat">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center p-10 border-2 border-[#111111] bg-[#f5f5f5]"
        >
          <div className="w-16 h-16 rounded-full bg-[#111111] text-white flex items-center justify-center mx-auto mb-6">
            <FiShoppingBag className="text-2xl" />
          </div>

          <h2 className="text-3xl font-black uppercase tracking-tight text-[#111111]">
            YOUR CART IS EMPTY
          </h2>
          <p className="text-xs font-poppins text-[#666666] mt-3 font-light leading-relaxed">
            Your shopping cart is currently empty. Explore our latest SHOPSPHERE collection.
          </p>

          <Link
            to="/products"
            className="mt-8 btn-fashion-black"
          >
            EXPLORE PRODUCTS
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-white text-[#111111] min-h-screen pb-24 pt-4 font-montserrat">
      
      {/* Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-5 z-50 bg-[#111111] text-white border border-[#111111] px-5 py-3 text-xs font-bold tracking-widest uppercase flex items-center gap-2 shadow-xl"
          >
            <FiCheck />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-6 border-b-2 border-[#111111]">
          <div>
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-gray-500">
              SHOPPING BAG
            </span>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#111111] mt-1">
              Your Cart ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
            </h1>
          </div>

          <Link
            to="/products"
            className="text-xs font-bold tracking-widest uppercase text-[#666666] hover:text-[#111111] transition-colors flex items-center gap-2"
          >
            <FiArrowLeft />
            <span>CONTINUE SHOPPING</span>
          </Link>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Cart Table */}
          <div className="lg:col-span-8 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-[#111111] text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500">
                  <th className="pb-4">PRODUCT</th>
                  <th className="pb-4 text-center">PRICE</th>
                  <th className="pb-4 text-center">QUANTITY</th>
                  <th className="pb-4 text-right">SUBTOTAL</th>
                  <th className="pb-4 text-right">REMOVE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-xs">
                {cartItems.map((item) => (
                  <tr key={item._id} className="hover:bg-[#f5f5f5] transition-colors">
                    
                    {/* Item Image & Title */}
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-4">
                        <Link to={`/product/${item._id}`}>
                          <div className="w-16 aspect-[3/4] bg-gray-100 border border-[#111111] overflow-hidden">
                            <img
                              src={item.image || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=300"}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </Link>
                        <div>
                          <span className="text-[9px] font-bold text-gray-500 uppercase block">{item.brand || "SHOPSPHERE"}</span>
                          <Link to={`/product/${item._id}`} className="font-bold text-[#111111] hover:underline">
                            {item.name}
                          </Link>
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-4 text-center font-bold">
                      ₹{item.price?.toLocaleString()}
                    </td>

                    {/* Quantity Counter */}
                    <td className="py-4 text-center">
                      <div className="inline-flex items-center border border-[#111111]">
                        <button
                          onClick={() => updateQty(item._id, item.qty - 1)}
                          className="w-7 h-7 flex items-center justify-center text-xs text-[#111111] hover:bg-gray-200 cursor-pointer font-bold"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-[#111111]">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(item._id, item.qty + 1)}
                          className="w-7 h-7 flex items-center justify-center text-xs text-[#111111] hover:bg-gray-200 cursor-pointer font-bold"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    {/* Subtotal */}
                    <td className="py-4 text-right font-black text-[#111111]">
                      ₹{(item.price * item.qty).toLocaleString()}
                    </td>

                    {/* Remove */}
                    <td className="py-4 text-right">
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="p-2 text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Remove Item"
                      >
                        <FiTrash2 className="text-base" />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Right Column: Summary Sidebar */}
          <div className="lg:col-span-4 sticky top-28 space-y-6">
            
            <div className="p-8 bg-[#111111] text-white border-2 border-[#111111] space-y-6">
              
              <h2 className="text-2xl font-black uppercase tracking-tight border-b border-gray-800 pb-4">
                Order Summary
              </h2>

              {/* Promo Code Input */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">
                  PROMO CODE
                </label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 bg-gray-900 border border-white text-xs">
                    <div className="flex items-center gap-2 font-bold text-white">
                      <FiTag />
                      <span>{appliedCoupon.code} APPLIED</span>
                    </div>
                    <button onClick={handleRemoveCoupon} className="text-rose-400 text-[10px] uppercase underline cursor-pointer">
                      REMOVE
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="e.g. FASHION10"
                      className="flex-1 px-3.5 py-2.5 bg-gray-900 border border-gray-700 text-xs tracking-widest text-white placeholder-gray-500 uppercase focus:outline-none focus:border-white"
                    />
                    <button type="submit" className="px-4 py-2.5 bg-white text-[#111111] text-xs font-bold tracking-widest uppercase hover:bg-gray-200 cursor-pointer">
                      APPLY
                    </button>
                  </form>
                )}
                {couponError && (
                  <p className="text-[10px] text-rose-400 mt-1.5 flex items-center gap-1 font-bold uppercase">
                    <FiAlertCircle />
                    <span>{couponError}</span>
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 pt-2 text-xs tracking-wider font-bold uppercase">
                <div className="flex justify-between text-gray-400">
                  <span>SUBTOTAL</span>
                  <span className="text-white">₹{subtotal.toLocaleString()}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-400">
                    <span>DISCOUNT</span>
                    <span>-₹{discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-400">
                  <span>ESTIMATED GST (18%)</span>
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

                <div className="border-t border-gray-800 pt-4 mt-4 flex justify-between items-baseline">
                  <span className="text-sm font-black text-white">TOTAL</span>
                  <span className="text-2xl font-black text-white">
                    ₹{grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => navigate("/checkout")}
                disabled={cartItems.length === 0}
                className="w-full py-4 text-xs font-bold tracking-[0.25em] uppercase bg-white text-[#111111] hover:bg-gray-200 transition-colors flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
              >
                <span>PROCEED TO CHECKOUT</span>
                <FiArrowRight />
              </button>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Cart;