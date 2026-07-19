import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiShield,
  FiEdit2,
  FiLogOut,
  FiShoppingBag,
  FiCheck,
  FiX
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(user?.name || "");
  const [editPhone, setEditPhone] = useState(user?.phone || "+91 98765 43210");
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updatedUser = { ...user, name: editName, phone: editPhone };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setSaveSuccessMsg("PROFILE DETAILS UPDATED.");
    setTimeout(() => {
      setSaveSuccessMsg("");
      setIsEditModalOpen(false);
    }, 1500);
  };

  const joinedDateFormatted = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
      })
    : "January 2026";

  return (
    <div className="bg-white text-[#111111] min-h-screen pb-24 pt-4 font-poppins">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center gap-2 text-[11px] font-montserrat font-semibold tracking-wider text-[#666666] uppercase mb-6">
          <Link to="/" className="hover:text-[#111111]">HOME</Link>
          <span>/</span>
          <span className="text-[#111111] font-bold">CLIENT PROFILE</span>
        </nav>

        {/* Profile Card */}
        <div className="p-8 sm:p-12 bg-[#111111] text-white border border-[#111111] mb-10 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 relative z-10 text-center sm:text-left">
            
            {/* Initial Avatar */}
            <div className="w-24 h-24 rounded-full bg-[#d4af37] text-[#111111] font-serif font-black text-4xl flex items-center justify-center border-2 border-white shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : <FiUser />}
            </div>

            {/* Info */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-montserrat font-bold tracking-[0.3em] uppercase text-[#d4af37]">
                    VERIFIED CLIENT
                  </span>
                  <h1 className="font-serif text-3xl font-bold uppercase tracking-tight text-white mt-1">
                    {user?.name || "Client"}
                  </h1>
                  <p className="text-xs text-gray-400 font-light mt-0.5">{user?.email}</p>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setEditName(user?.name || "");
                      setEditPhone(user?.phone || "+91 98765 43210");
                      setIsEditModalOpen(true);
                    }}
                    className="px-4 py-2 bg-[#d4af37] text-[#111111] text-xs font-montserrat font-bold tracking-widest uppercase hover:bg-white transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <FiEdit2 />
                    <span>EDIT</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-rose-950 text-rose-300 text-xs font-montserrat font-bold tracking-widest uppercase hover:bg-rose-700 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer border border-rose-800"
                  >
                    <FiLogOut />
                    <span>LOGOUT</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="p-6 bg-[#f5f5f5] border border-gray-200 flex items-center gap-4">
            <FiMail className="text-xl text-[#d4af37] shrink-0" />
            <div>
              <span className="text-[10px] font-montserrat font-bold uppercase tracking-widest text-[#666666]">EMAIL ADDRESS</span>
              <p className="text-xs font-bold font-montserrat text-[#111111] mt-0.5">{user?.email}</p>
            </div>
          </div>

          <div className="p-6 bg-[#f5f5f5] border border-gray-200 flex items-center gap-4">
            <FiPhone className="text-xl text-[#d4af37] shrink-0" />
            <div>
              <span className="text-[10px] font-montserrat font-bold uppercase tracking-widest text-[#666666]">TELEPHONE</span>
              <p className="text-xs font-bold font-montserrat text-[#111111] mt-0.5">{user?.phone || "+91 98765 43210"}</p>
            </div>
          </div>

          <div className="p-6 bg-[#f5f5f5] border border-gray-200 flex items-center gap-4">
            <FiCalendar className="text-xl text-[#d4af37] shrink-0" />
            <div>
              <span className="text-[10px] font-montserrat font-bold uppercase tracking-widest text-[#666666]">CLIENT SINCE</span>
              <p className="text-xs font-bold font-montserrat text-[#111111] mt-0.5">{joinedDateFormatted}</p>
            </div>
          </div>

          <div className="p-6 bg-[#f5f5f5] border border-gray-200 flex items-center gap-4">
            <FiShield className="text-xl text-[#d4af37] shrink-0" />
            <div>
              <span className="text-[10px] font-montserrat font-bold uppercase tracking-widest text-[#666666]">AUTHENTICATION</span>
              <p className="text-xs font-bold font-montserrat text-[#111111] mt-0.5">JWT Encrypted Session</p>
            </div>
          </div>
        </div>

        {/* Dashboard Link Banner */}
        <div className="p-6 bg-[#111111] text-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <FiShoppingBag className="text-[#d4af37] text-2xl" />
            <div>
              <h4 className="font-serif text-lg font-bold uppercase">Order History</h4>
              <p className="text-xs text-gray-400 font-light">View active shipments and past invoice references</p>
            </div>
          </div>
          <Link
            to="/orders"
            className="px-6 py-2.5 bg-[#d4af37] text-[#111111] text-xs font-montserrat font-bold tracking-widest uppercase hover:bg-white transition-all shrink-0"
          >
            MY ORDERS
          </Link>
        </div>

      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-md w-full bg-white border border-[#111111] p-8 font-poppins relative"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-6">
                <h3 className="font-serif text-xl font-bold uppercase text-[#111111]">Edit Details</h3>
                <button onClick={() => setIsEditModalOpen(false)} className="text-gray-500 hover:text-[#111111]">
                  <FiX className="text-lg" />
                </button>
              </div>

              {saveSuccessMsg && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-montserrat uppercase font-bold flex items-center gap-2">
                  <FiCheck />
                  <span>{saveSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-montserrat font-bold uppercase tracking-widest text-[#111111] mb-1">
                    FULL NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#f5f5f5] border border-gray-300 text-xs font-montserrat text-[#111111] focus:outline-none focus:border-[#111111] uppercase"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-montserrat font-bold uppercase tracking-widest text-[#111111] mb-1">
                    PHONE NUMBER
                  </label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#f5f5f5] border border-gray-300 text-xs font-montserrat text-[#111111] focus:outline-none focus:border-[#111111] uppercase"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="flex-1 py-3 bg-[#f5f5f5] text-[#111111] text-xs font-montserrat font-bold tracking-widest uppercase border border-gray-300"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-[#111111] text-white text-xs font-montserrat font-bold tracking-widest uppercase hover:bg-[#d4af37] hover:text-[#111111] transition-all"
                  >
                    SAVE
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default Profile;