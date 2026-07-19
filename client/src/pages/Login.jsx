import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiAlertCircle,
  FiCheckCircle
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email.trim() || !password.trim()) {
      setErrorMsg("PLEASE ENTER BOTH EMAIL AND PASSWORD.");
      return;
    }

    setIsLoading(true);
    const res = await login(email.trim(), password);
    setIsLoading(false);

    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1200);
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="bg-[#f5f5f5] text-[#111111] min-h-[85vh] flex items-center justify-center py-16 px-4 font-montserrat">
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white border-2 border-[#111111] p-8 sm:p-12 shadow-sm relative"
      >
        {/* Header */}
        <div className="text-center mb-10 space-y-2">
          <Link to="/" className="inline-block">
            <span className="text-2xl font-black tracking-[0.25em] text-[#111111] uppercase">
              SHOPSPHERE
            </span>
          </Link>
          <h2 className="text-2xl font-black uppercase tracking-tight text-[#111111] pt-2">
            Sign In
          </h2>
          <p className="text-xs font-poppins text-[#666666] font-light">
            Enter your credentials to access your client account.
          </p>
        </div>

        {/* Alerts */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-rose-50 border border-rose-300 text-rose-800 text-xs font-bold tracking-wider uppercase flex items-center gap-2"
            >
              <FiAlertCircle className="shrink-0" />
              <span>{errorMsg}</span>
            </motion.div>
          )}
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold tracking-wider uppercase flex items-center gap-2"
            >
              <FiCheckCircle className="shrink-0" />
              <span>{successMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Email */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#111111] mb-2">
              EMAIL ADDRESS *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="CLIENT@SHOPSPHERE.COM"
              className="w-full px-4 py-3 bg-[#f5f5f5] border border-[#111111] text-xs font-bold tracking-widest text-[#111111] placeholder-gray-400 focus:outline-none uppercase"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#111111]">
                PASSWORD *
              </label>
              <span className="text-[10px] font-bold text-[#666666] tracking-wider uppercase cursor-pointer hover:text-[#111111]">
                FORGOT?
              </span>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-[#f5f5f5] border border-[#111111] text-xs font-bold tracking-widest text-[#111111] placeholder-gray-400 focus:outline-none uppercase pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#111111]"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* Remember me */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#666666] font-bold uppercase">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded-none border-[#111111] text-[#111111] focus:ring-0 cursor-pointer"
              />
              <span>Remember me</span>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 btn-fashion-black flex items-center justify-center gap-3 disabled:opacity-50 mt-4"
          >
            {isLoading ? (
              <span>SIGNING IN...</span>
            ) : (
              <>
                <span>SIGN IN</span>
                <FiArrowRight />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 text-center border-t border-gray-200 pt-6">
          <p className="text-xs text-[#666666] font-light">
            Don't have an account?{" "}
            <Link to="/register" className="font-bold text-[#111111] hover:underline tracking-wider uppercase ml-1">
              REGISTER HERE
            </Link>
          </p>
        </div>

      </motion.div>
    </div>
  );
}

export default Login;