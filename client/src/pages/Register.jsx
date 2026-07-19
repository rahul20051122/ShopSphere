import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiAlertCircle,
  FiCheckCircle
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMsg("PLEASE FILL IN ALL REQUIRED FIELDS.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("PASSWORD MUST BE AT LEAST 6 CHARACTERS.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("PASSWORDS DO NOT MATCH.");
      return;
    }

    setIsLoading(true);
    const res = await register(name.trim(), email.trim(), password, phone.trim());
    setIsLoading(false);

    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="bg-[#f5f5f5] text-[#111111] min-h-[90vh] flex items-center justify-center py-16 px-4 font-montserrat">
      
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
            Create Account
          </h2>
          <p className="text-xs font-poppins text-[#666666] font-light">
            Join SHOPSPHERE for bespoke orders and client benefits.
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
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Full Name */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#111111] mb-1">
              FULL NAME *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ALEXANDER VANCE"
              className="w-full px-4 py-3 bg-[#f5f5f5] border border-[#111111] text-xs font-bold tracking-widest text-[#111111] placeholder-gray-400 focus:outline-none uppercase"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#111111] mb-1">
              EMAIL ADDRESS *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ALEX@EXAMPLE.COM"
              className="w-full px-4 py-3 bg-[#f5f5f5] border border-[#111111] text-xs font-bold tracking-widest text-[#111111] placeholder-gray-400 focus:outline-none uppercase"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#111111] mb-1">
              PHONE NUMBER
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-4 py-3 bg-[#f5f5f5] border border-[#111111] text-xs font-bold tracking-widest text-[#111111] placeholder-gray-400 focus:outline-none uppercase"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#111111] mb-1">
              PASSWORD *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="MINIMUM 6 CHARACTERS"
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

          {/* Confirm Password */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#111111] mb-1">
              CONFIRM PASSWORD *
            </label>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="RE-ENTER PASSWORD"
              className="w-full px-4 py-3 bg-[#f5f5f5] border border-[#111111] text-xs font-bold tracking-widest text-[#111111] placeholder-gray-400 focus:outline-none uppercase"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 btn-fashion-black flex items-center justify-center gap-3 disabled:opacity-50 mt-4"
          >
            {isLoading ? (
              <span>REGISTERING...</span>
            ) : (
              <>
                <span>COMPLETE REGISTRATION</span>
                <FiArrowRight />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 text-center border-t border-gray-200 pt-6">
          <p className="text-xs text-[#666666] font-light">
            Already registered?{" "}
            <Link to="/login" className="font-bold text-[#111111] hover:underline tracking-wider uppercase ml-1">
              SIGN IN HERE
            </Link>
          </p>
        </div>

      </motion.div>
    </div>
  );
}

export default Register;