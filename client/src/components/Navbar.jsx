import { useState, useEffect, useContext, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiShoppingCart,
  FiHeart,
  FiMenu,
  FiX,
  FiChevronDown,
  FiUser,
  FiLogOut,
  FiShield
} from "react-icons/fi";
import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";

const CATEGORIES = ["Fashion", "Electronics", "Mobiles", "Home", "Beauty"];

function Navbar() {
  const { cartItems } = useContext(CartContext);
  const { wishlistItems } = useWishlist();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const categoryRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const cartCount = cartItems?.reduce((acc, item) => acc + (item.qty || 1), 0) || 0;
  const wishlistCount = wishlistItems?.length || 0;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-white border-b border-black shadow-xs font-montserrat">
      <div className="w-full flex items-stretch h-16 sm:h-20">
        
        {/* LEFT BLOCK: Black Background with Logo & Hamburger Menu (Exact to Reference) */}
        <div className="w-full lg:w-5/12 xl:w-4/12 bg-[#111111] text-white flex items-center px-4 sm:px-8 justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-gray-300 cursor-pointer p-1"
              aria-label="Toggle Menu"
            >
              <FiMenu className="text-xl sm:text-2xl" />
            </button>
            <Link to="/" className="flex items-center">
              <span className="text-lg sm:text-2xl font-black tracking-[0.25em] text-white uppercase">
                SHOPSPHERE
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            <Link to="/cart" className="relative p-1 text-white">
              <FiShoppingCart className="text-lg" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-[#111111] text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* RIGHT BLOCK: White Background with Nav Links & Action Icons */}
        <div className="hidden lg:flex flex-1 bg-white items-center justify-between px-8 text-xs font-bold tracking-[0.2em] uppercase text-[#111111]">
          
          {/* Navigation Links */}
          <nav className="flex items-center gap-8">
            <Link
              to="/"
              className={`py-1 relative hover:text-gray-600 transition-colors ${
                isActive("/") ? "border-b-2 border-[#111111]" : ""
              }`}
            >
              HOME
            </Link>

            <Link
              to="/products"
              className={`py-1 relative hover:text-gray-600 transition-colors ${
                isActive("/products") ? "border-b-2 border-[#111111]" : ""
              }`}
            >
              PRODUCTS
            </Link>

            {/* Categories Dropdown */}
            <div className="relative" ref={categoryRef}>
              <button
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="flex items-center gap-1 py-1 hover:text-gray-600 transition-colors uppercase font-bold cursor-pointer"
              >
                <span>CATEGORIES</span>
                <FiChevronDown className={`text-xs transition-transform ${isCategoryOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {isCategoryOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 mt-3 w-48 bg-white border border-[#111111] shadow-xl p-2 z-50"
                  >
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat}
                        to={`/products?category=${encodeURIComponent(cat)}`}
                        onClick={() => setIsCategoryOpen(false)}
                        className="block px-4 py-2.5 text-xs font-bold text-[#111111] hover:bg-[#111111] hover:text-white uppercase transition-colors"
                      >
                        {cat}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              to="/contact"
              className={`py-1 relative hover:text-gray-600 transition-colors ${
                isActive("/contact") ? "border-b-2 border-[#111111]" : ""
              }`}
            >
              CONTACT
            </Link>
          </nav>

          {/* Right Action Icons: Search, Wishlist, Cart & Profile/Auth */}
          <div className="flex items-center gap-6">
            
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-1 text-[#111111] hover:opacity-70 cursor-pointer"
              aria-label="Search"
            >
              <FiSearch className="text-lg" />
            </button>

            {/* Wishlist Link */}
            <Link to="/wishlist" className="relative p-1 text-[#111111] hover:opacity-70">
              <FiHeart className="text-lg" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#111111] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* CART (Exactly formatted like reference '🛒 CART') */}
            <Link
              to="/cart"
              className={`flex items-center gap-2 py-1.5 px-3 border border-transparent hover:border-[#111111] transition-all ${
                isActive("/cart") ? "bg-[#111111] text-white" : "text-[#111111]"
              }`}
            >
              <FiShoppingCart className="text-base" />
              <span>CART ({cartCount})</span>
            </Link>

            {/* Auth Area: User Menu or Login/Register */}
            {isAuthenticated && user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 py-1 px-3 border border-[#111111] rounded-none hover:bg-[#111111] hover:text-white transition-all cursor-pointer"
                >
                  <FiUser className="text-sm" />
                  <span className="max-w-[80px] truncate">{user.name?.split(" ")[0]}</span>
                  <FiChevronDown className="text-xs" />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-3 w-52 bg-white border border-[#111111] shadow-xl p-2 z-50 text-xs font-bold"
                    >
                      <div className="px-3 py-2 border-b border-gray-200 mb-1">
                        <p className="truncate text-[#111111]">{user.name}</p>
                        <p className="text-[10px] text-gray-500 font-normal truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="block px-3 py-2 text-[#111111] hover:bg-[#111111] hover:text-white uppercase"
                      >
                        MY PROFILE
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setIsProfileOpen(false)}
                        className="block px-3 py-2 text-[#111111] hover:bg-[#111111] hover:text-white uppercase"
                      >
                        MY ORDERS
                      </Link>
                      {user.role === "admin" && (
                        <Link
                          to="/admin"
                          onClick={() => setIsProfileOpen(false)}
                          className="block px-3 py-2 bg-[#111111] text-white uppercase mt-1 mb-1"
                        >
                          ADMIN DASHBOARD
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 uppercase cursor-pointer"
                      >
                        LOGOUT
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="hover:opacity-70 transition-opacity">
                  LOGIN
                </Link>
                <span className="text-gray-300">/</span>
                <Link to="/register" className="hover:opacity-70 transition-opacity">
                  REGISTER
                </Link>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* Expandable Search Input */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-[#f5f5f5] border-b border-[#111111] overflow-hidden"
          >
            <div className="max-w-4xl mx-auto px-4 py-3">
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-3">
                <FiSearch className="text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="SEARCH SHOPSPHERE COLLECTION..."
                  className="flex-1 bg-transparent text-xs font-bold tracking-widest text-[#111111] placeholder-gray-400 focus:outline-none uppercase"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#111111] text-white text-xs font-bold tracking-widest uppercase hover:bg-[#222222] cursor-pointer"
                >
                  SEARCH
                </button>
                <button type="button" onClick={() => setIsSearchOpen(false)} className="p-1 cursor-pointer">
                  <FiX />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white border-b border-[#111111] lg:hidden overflow-hidden"
          >
            <div className="p-6 space-y-6 text-xs font-bold tracking-widest uppercase">
              
              <div className="flex flex-col space-y-4 border-b border-gray-200 pb-6">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className={isActive("/") ? "text-gray-500" : "text-[#111111]"}>
                  HOME
                </Link>
                <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className={isActive("/products") ? "text-gray-500" : "text-[#111111]"}>
                  PRODUCTS
                </Link>
                <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className={isActive("/contact") ? "text-gray-500" : "text-[#111111]"}>
                  CONTACT
                </Link>
                <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 text-[#111111]">
                  <FiShoppingCart /> CART ({cartCount})
                </Link>
              </div>

              <div>
                <h4 className="text-[10px] text-gray-500 mb-3">CATEGORIES</h4>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat}
                      to={`/products?category=${encodeURIComponent(cat)}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-3 py-2 bg-[#f5f5f5] hover:bg-[#111111] hover:text-white transition-colors text-center"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>

              {!isAuthenticated && (
                <div className="flex gap-3 pt-2">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 py-2.5 text-center border border-[#111111] text-[#111111]">
                    LOGIN
                  </Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 py-2.5 text-center bg-[#111111] text-white">
                    REGISTER
                  </Link>
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </header>
  );
}

export default Navbar;
