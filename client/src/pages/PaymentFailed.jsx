import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiXCircle, FiRefreshCw, FiArrowLeft } from "react-icons/fi";

function PaymentFailed() {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-[85vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-md w-full bg-slate-900/50 border border-slate-800 p-8 sm:p-10 rounded-3xl text-center shadow-2xl relative overflow-hidden backdrop-blur-xl"
      >
        <div className="w-20 h-20 rounded-full bg-rose-500/20 text-rose-500 border border-rose-500/30 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-rose-500/20">
          <FiXCircle className="text-4xl" />
        </div>

        <h1 className="text-3xl font-extrabold text-white tracking-tight">Payment Unsuccessful</h1>
        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
          Your payment could not be processed due to bank authentication failure or insufficient funds. No amount was debited.
        </p>

        <div className="mt-8 flex gap-3">
          <Link
            to="/cart"
            className="flex-1 py-3 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1"
          >
            <FiArrowLeft />
            <span>Return to Cart</span>
          </Link>
          <Link
            to="/checkout"
            className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1"
          >
            <FiRefreshCw />
            <span>Retry Payment</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default PaymentFailed;
