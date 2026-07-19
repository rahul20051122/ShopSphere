import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCheckCircle, FiShoppingBag, FiArrowRight } from "react-icons/fi";

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId") || "ORD-PAY-984012";

  return (
    <div className="bg-slate-950 text-slate-100 min-h-[85vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-md w-full bg-slate-900/50 border border-slate-800 p-8 sm:p-10 rounded-3xl text-center shadow-2xl relative overflow-hidden backdrop-blur-xl"
      >
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/20">
          <FiCheckCircle className="text-white text-4xl" />
        </div>

        <h1 className="text-3xl font-extrabold text-white tracking-tight">Payment Verified! 🎉</h1>
        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
          Your payment transaction was processed successfully. We're assembling your order for dispatch.
        </p>

        <div className="mt-6 p-4 rounded-2xl bg-slate-950/60 border border-slate-850 text-xs text-slate-300 space-y-1.5 text-left font-mono">
          <div className="flex justify-between">
            <span className="text-slate-500">Order Ref:</span>
            <span className="text-indigo-400 font-bold">{orderId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Status:</span>
            <span className="text-emerald-400 font-bold">Paid & Confirmed</span>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <Link
            to="/products"
            className="flex-1 py-3 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold rounded-xl transition-all"
          >
            Storefront
          </Link>
          <Link
            to="/orders"
            className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1"
          >
            <span>My Orders</span>
            <FiArrowRight />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default PaymentSuccess;
