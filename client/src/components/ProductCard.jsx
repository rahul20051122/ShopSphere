import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { FiHeart, FiEye, FiShoppingCart, FiCheck, FiStar } from "react-icons/fi";
import { CartContext } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import QuickViewModal from "./QuickViewModal";

function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;

  const isWishlisted = isInWishlist(product._id);

  const imageSrc = product.image && product.image.trim() !== ""
    ? product.image
    : "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800";

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickViewClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  return (
    <>
      <div className="fashion-card-exact group flex flex-col justify-between p-4 font-montserrat bg-white">
        
        {/* Image Frame */}
        <div className="relative aspect-[3/4] bg-[#f5f5f5] overflow-hidden mb-4 cursor-pointer border border-gray-200">
          
          <Link to={`/product/${product._id}`}>
            <img
              src={imageSrc}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </Link>

          {/* Wishlist Heart Toggle */}
          <button
            onClick={handleWishlistClick}
            className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
              isWishlisted
                ? "bg-[#111111] text-white"
                : "bg-white/90 text-[#111111] hover:bg-[#111111] hover:text-white border border-[#111111]"
            }`}
            aria-label="Wishlist"
          >
            <FiHeart className={`text-xs ${isWishlisted ? "fill-current" : ""}`} />
          </button>

          {/* Quick View Button Hover Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button
              onClick={handleQuickViewClick}
              className="w-full py-2 bg-white text-[#111111] hover:bg-[#111111] hover:text-white text-[10px] font-bold tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-[#111111]"
            >
              <FiEye className="text-xs" />
              <span>QUICK VIEW</span>
            </button>
          </div>

        </div>

        {/* Product Details Section */}
        <div className="flex flex-col justify-between flex-1 space-y-3">
          
          <div>
            {/* Brand Tag */}
            <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#666666] mb-1">
              {product.brand || "SHOPSPHERE"}
            </span>

            {/* Product Name */}
            <Link to={`/product/${product._id}`}>
              <h3 className="text-sm font-bold text-[#111111] hover:text-gray-600 transition-colors line-clamp-1">
                {product.name}
              </h3>
            </Link>

            {/* Rating */}
            <div className="flex items-center gap-1 text-[#111111] text-xs mt-1">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} className="fill-current text-[11px]" />
              ))}
              <span className="text-[10px] font-semibold text-gray-500 ml-1">(4.8)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-sm font-black text-[#111111]">
                ₹{product.price?.toLocaleString()}
              </span>
              <span className="text-xs text-[#666666] line-through font-light">
                ₹{Math.round(product.price * 1.2)?.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Action Buttons: Add To Cart & View Details */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleAddToCart}
              className={`w-full py-2.5 text-[10px] font-bold tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#111111] ${
                isAdded
                  ? "bg-emerald-800 text-white border-emerald-800"
                  : "btn-fashion-black"
              }`}
            >
              {isAdded ? (
                <>
                  <FiCheck className="text-xs" />
                  <span>ADDED</span>
                </>
              ) : (
                <>
                  <FiShoppingCart className="text-xs" />
                  <span>ADD TO CART</span>
                </>
              )}
            </button>

            <Link
              to={`/product/${product._id}`}
              className="block w-full py-2 text-[10px] font-bold tracking-[0.2em] uppercase text-center btn-fashion-outline"
            >
              VIEW DETAILS
            </Link>
          </div>

        </div>

      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
}

export default ProductCard;