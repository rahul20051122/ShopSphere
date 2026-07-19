import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiShoppingCart, FiHeart, FiCheck } from "react-icons/fi";
import { CartContext } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

function QuickViewModal({ product, isOpen, onClose }) {
  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("Black");
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  if (!product || !isOpen) return null;

  const isWishlisted = isInWishlist(product._id);
  const SIZES = ["XS", "S", "M", "L", "XL"];
  const COLORS = [
    { name: "Black", bg: "bg-[#111111]" },
    { name: "White", bg: "bg-white border border-gray-400" },
    { name: "Cyan", bg: "bg-[#9cdbf0]" }
  ];

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 1200);
  };

  const imageSrc = product.image && product.image.trim() !== ""
    ? product.image
    : "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-montserrat">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="bg-white max-w-3xl w-full border-2 border-[#111111] relative z-10 overflow-hidden my-8 max-h-[90vh] flex flex-col md:flex-row"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 bg-white hover:bg-[#111111] hover:text-white border border-[#111111] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <FiX className="text-lg" />
          </button>

          <div className="w-full md:w-1/2 aspect-[3/4] bg-[#f5f5f5] relative overflow-hidden border-r border-[#111111]">
            <img
              src={imageSrc}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <span className="absolute top-4 left-4 px-3 py-1 bg-[#111111] text-white text-[10px] font-bold tracking-widest uppercase">
              QUICK VIEW
            </span>
          </div>

          <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#666666]">
                {product.brand || "SHOPSPHERE"}
              </span>

              <h2 className="text-2xl font-black text-[#111111] uppercase mt-1 mb-2">
                {product.name}
              </h2>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-xl font-black text-[#111111]">
                  ₹{product.price?.toLocaleString()}
                </span>
                <span className="text-xs text-[#666666] line-through font-light">
                  ₹{Math.round(product.price * 1.25)?.toLocaleString()}
                </span>
              </div>

              <p className="text-xs font-poppins text-[#666666] leading-relaxed font-light mb-6 line-clamp-3">
                {product.description || "Crafted from fine cotton blend with minimal aesthetic contours."}
              </p>

              {/* Size Selector */}
              <div className="mb-5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#111111] mb-2">
                  SIZE: <span className="font-normal text-gray-500">{selectedSize}</span>
                </label>
                <div className="flex gap-2">
                  {SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-9 h-9 text-xs font-bold transition-all cursor-pointer border border-[#111111] ${
                        selectedSize === size
                          ? "bg-[#111111] text-white"
                          : "bg-white text-[#111111] hover:bg-[#f5f5f5]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selector */}
              <div className="mb-6">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#111111] mb-2">
                  COLOR: <span className="font-normal text-gray-500">{selectedColor}</span>
                </label>
                <div className="flex gap-3">
                  {COLORS.map((col) => (
                    <button
                      key={col.name}
                      onClick={() => setSelectedColor(col.name)}
                      className={`w-6 h-6 rounded-full ${col.bg} transition-all cursor-pointer ${
                        selectedColor === col.name ? "ring-2 ring-offset-2 ring-[#111111]" : ""
                      }`}
                      title={col.name}
                    />
                  ))}
                </div>
              </div>

              {/* Quantity Counter */}
              <div className="mb-6">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#111111] mb-2">
                  QUANTITY
                </label>
                <div className="inline-flex items-center border border-[#111111]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center text-xs text-[#111111] hover:bg-gray-200 cursor-pointer font-bold"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-xs font-bold text-[#111111]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center text-xs text-[#111111] hover:bg-gray-200 cursor-pointer font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-3.5 text-xs font-bold tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#111111] ${
                    addedSuccess
                      ? "bg-emerald-800 text-white"
                      : "btn-fashion-black"
                  }`}
                >
                  {addedSuccess ? (
                    <>
                      <FiCheck />
                      <span>ADDED TO CART</span>
                    </>
                  ) : (
                    <>
                      <FiShoppingCart />
                      <span>ADD TO CART</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-3.5 border border-[#111111] transition-colors cursor-pointer ${
                    isWishlisted ? "bg-[#111111] text-white" : "bg-white text-[#111111] hover:bg-[#111111] hover:text-white"
                  }`}
                  aria-label="Wishlist"
                >
                  <FiHeart className={isWishlisted ? "fill-current" : ""} />
                </button>
              </div>

              <Link
                to={`/product/${product._id}`}
                onClick={onClose}
                className="block text-center text-xs font-bold tracking-widest text-[#666666] hover:text-[#111111] uppercase underline pt-1"
              >
                VIEW FULL DETAILS
              </Link>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default QuickViewModal;
