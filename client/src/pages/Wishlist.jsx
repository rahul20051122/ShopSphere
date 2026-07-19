import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHeart,
  FiShoppingCart,
  FiTrash2,
  FiArrowRight,
  FiCheck
} from "react-icons/fi";
import { useWishlist } from "../context/WishlistContext";
import { CartContext } from "../context/CartContext";

function Wishlist() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useContext(CartContext);
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const handleMoveToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product._id);
    showToast(`"${product.name}" moved to Cart!`);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="bg-white text-[#111111] min-h-[75vh] flex items-center justify-center px-4 py-16 font-poppins">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center p-10 border border-gray-200 bg-[#f5f5f5]"
        >
          <div className="w-16 h-16 rounded-full bg-[#111111] text-[#d4af37] flex items-center justify-center mx-auto mb-6">
            <FiHeart className="text-2xl" />
          </div>

          <h2 className="font-serif text-3xl font-bold uppercase tracking-tight text-[#111111]">
            WISHLIST IS EMPTY
          </h2>
          <p className="text-xs text-[#666666] mt-3 font-light leading-relaxed">
            Save pieces you love here for later. Explore our latest catalogue.
          </p>

          <Link
            to="/products"
            className="mt-8 inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-[#111111] text-white text-xs font-montserrat font-bold tracking-[0.2em] uppercase hover:bg-[#d4af37] hover:text-[#111111] transition-all"
          >
            <span>DISCOVER PRODUCTS</span>
            <FiArrowRight />
          </Link>
        </motion.div>
      </div>
    );
  }

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
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 pb-6 border-b border-gray-200">
          <div>
            <span className="text-xs font-montserrat font-bold tracking-[0.3em] uppercase text-[#d4af37]">
              SAVED PIECES
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold uppercase tracking-tight text-[#111111] mt-1">
              My Wishlist ({wishlistItems.length})
            </h1>
          </div>

          <Link
            to="/products"
            className="text-xs font-montserrat font-bold tracking-widest uppercase text-[#666666] hover:text-[#111111]"
          >
            CONTINUE BROWSING
          </Link>
        </div>

        {/* Wishlist 4-column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <AnimatePresence>
            {wishlistItems.map((product) => (
              <motion.div
                key={product._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="group flex flex-col justify-between bg-white border border-gray-200 p-4"
              >
                <div>
                  {/* Thumbnail Image */}
                  <div className="product-image-frame mb-4 relative overflow-hidden">
                    <Link to={`/product/${product._id}`}>
                      <img
                        src={
                          product.image ||
                          "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=400"
                        }
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </Link>

                    {/* Trash Button */}
                    <button
                      onClick={() => {
                        removeFromWishlist(product._id);
                        showToast(`REMOVED "${product.name.toUpperCase()}" FROM WISHLIST`);
                      }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-gray-600 hover:bg-[#111111] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                      title="Remove"
                    >
                      <FiTrash2 className="text-xs" />
                    </button>
                  </div>

                  {/* Brand & Name */}
                  <span className="block text-[10px] font-montserrat font-bold uppercase tracking-[0.2em] text-[#d4af37] mb-1">
                    {product.brand || "HAUTE FASHION"}
                  </span>
                  
                  <Link to={`/product/${product._id}`}>
                    <h3 className="font-serif text-base font-bold text-[#111111] hover:text-[#d4af37] transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Price */}
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-montserrat text-sm font-bold text-[#111111]">
                      ₹{product.price?.toLocaleString()}
                    </span>
                    <span className="text-xs text-[#666666] line-through font-light">
                      ₹{Math.round(product.price * 1.2)?.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Move to Cart Button */}
                <button
                  onClick={() => handleMoveToCart(product)}
                  className="w-full mt-4 py-3 bg-[#111111] text-white text-[11px] font-montserrat font-bold tracking-[0.2em] uppercase hover:bg-[#d4af37] hover:text-[#111111] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FiShoppingCart />
                  <span>MOVE TO BAG</span>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}

export default Wishlist;
