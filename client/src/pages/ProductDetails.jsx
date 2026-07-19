import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiHeart,
  FiShoppingCart,
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiCheck,
  FiChevronRight,
  FiArrowLeft,
  FiAlertCircle
} from "react-icons/fi";
import { getSingleProduct, getProducts } from "../services/productService";
import { CartContext } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/ProductCard";

const SIZES = ["XS", "S", "M", "L", "XL"];
const COLORS = [
  { name: "Black", bg: "bg-[#111111]" },
  { name: "White", bg: "bg-white border border-gray-400" },
  { name: "Cyan", bg: "bg-[#9cdbf0]" }
];

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("Black");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedSuccess, setAddedSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSingleProduct(id);
      if (data && data.product) {
        setProduct(data.product);
        setSelectedImage(
          data.product.image ||
          "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800"
        );
        fetchRelatedProducts(data.product.category, data.product._id);
      } else {
        setError("Product not found");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load product details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (category, currentId) => {
    try {
      const data = await getProducts();
      if (data && data.products) {
        const filtered = data.products
          .filter((p) => p._id !== currentId && (p.category === category || !category))
          .slice(0, 4);

        if (filtered.length < 4) {
          const extra = data.products
            .filter((p) => p._id !== currentId && !filtered.some((f) => f._id === p._id))
            .slice(0, 4 - filtered.length);
          setRelatedProducts([...filtered, ...extra]);
        } else {
          setRelatedProducts(filtered);
        }
      }
    } catch (err) {
      console.error("Error fetching related products:", err);
    }
  };

  const getThumbnails = () => {
    if (!product) return [];
    const mainImg =
      product.image ||
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800";
    return [mainImg, mainImg, mainImg];
  };

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 font-montserrat">
        <div className="animate-pulse grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 aspect-[3/4] bg-gray-100 border border-gray-200" />
          <div className="lg:col-span-5 space-y-6">
            <div className="h-4 bg-gray-100 w-1/4" />
            <div className="h-8 bg-gray-100 w-3/4" />
            <div className="h-6 bg-gray-100 w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 font-montserrat">
        <FiAlertCircle className="text-4xl text-[#111111] mb-4" />
        <h2 className="text-2xl font-black text-[#111111] mb-2 uppercase">Product Not Found</h2>
        <p className="text-xs text-[#666666] font-light max-w-sm mb-6">
          The requested fashion piece could not be retrieved.
        </p>
        <Link to="/products" className="btn-fashion-black">
          <FiArrowLeft className="inline mr-2" />
          BACK TO PRODUCTS
        </Link>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product._id);
  const isOutOfStock = product.stock === 0;

  return (
    <div className="bg-white text-[#111111] min-h-screen pb-24 pt-4 font-montserrat">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[11px] font-bold tracking-wider text-[#666666] uppercase py-4 mb-6 border-b border-gray-200">
          <Link to="/" className="hover:text-[#111111]">HOME</Link>
          <FiChevronRight className="text-gray-400" />
          <Link to="/products" className="hover:text-[#111111]">PRODUCTS</Link>
          <FiChevronRight className="text-gray-400" />
          <span className="text-[#111111] font-bold truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="relative w-full aspect-[3/4] bg-[#f5f5f5] overflow-hidden border-2 border-[#111111] group">
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`absolute top-4 right-4 z-10 w-11 h-11 rounded-full flex items-center justify-center transition-colors cursor-pointer border border-[#111111] ${
                  isWishlisted ? "bg-[#111111] text-white" : "bg-white text-[#111111] hover:bg-[#111111] hover:text-white"
                }`}
                aria-label="Wishlist"
              >
                <FiHeart className={`text-lg ${isWishlisted ? "fill-current" : ""}`} />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-4 overflow-x-auto pb-2">
              {getThumbnails().map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`w-20 aspect-[3/4] bg-[#f5f5f5] overflow-hidden border transition-all cursor-pointer ${
                    selectedImage === imgUrl ? "border-2 border-[#111111]" : "border-gray-200 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Information */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-gray-500">
                {product.brand || "SHOPSPHERE"}
              </span>

              <h1 className="text-3xl sm:text-4xl font-black text-[#111111] uppercase tracking-tight mt-1 mb-3">
                {product.name}
              </h1>

              {/* Price & Category & Stock */}
              <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-gray-200">
                <span className="text-3xl font-black text-[#111111]">
                  ₹{product.price?.toLocaleString()}
                </span>
                <span className="text-sm text-[#666666] line-through font-light">
                  ₹{Math.round(product.price * 1.25)?.toLocaleString()}
                </span>
                <span className="text-[10px] font-bold tracking-widest text-white bg-[#111111] px-2.5 py-1 uppercase">
                  {product.category || "FASHION"}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs font-poppins text-[#666666] leading-relaxed font-light mb-6">
                {product.description}
              </p>

              {/* Stock Status */}
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-[#111111] block mb-1">AVAILABILITY</span>
                {isOutOfStock ? (
                  <span className="text-xs font-bold text-rose-700 uppercase">OUT OF STOCK</span>
                ) : (
                  <span className="text-xs font-bold text-emerald-800 uppercase">IN STOCK ({product.stock !== undefined ? product.stock : 10} UNITS AVAILABLE)</span>
                )}
              </div>

              {/* Size Selector */}
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-widest text-[#111111] mb-2">
                  SELECT SIZE: <span className="font-normal text-gray-500">{selectedSize}</span>
                </label>
                <div className="flex gap-2">
                  {SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-11 h-11 text-xs font-bold border border-[#111111] transition-all cursor-pointer ${
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
                <label className="block text-xs font-bold uppercase tracking-widest text-[#111111] mb-2">
                  SELECT COLOR: <span className="font-normal text-gray-500">{selectedColor}</span>
                </label>
                <div className="flex gap-3">
                  {COLORS.map((col) => (
                    <button
                      key={col.name}
                      onClick={() => setSelectedColor(col.name)}
                      className={`w-7 h-7 rounded-full ${col.bg} transition-all cursor-pointer ${
                        selectedColor === col.name ? "ring-2 ring-offset-2 ring-[#111111]" : ""
                      }`}
                      title={col.name}
                    />
                  ))}
                </div>
              </div>

              {/* Quantity Counter */}
              <div className="mb-8">
                <label className="block text-xs font-bold uppercase tracking-widest text-[#111111] mb-2">
                  QUANTITY
                </label>
                <div className="inline-flex items-center border border-[#111111]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-sm font-bold text-[#111111] hover:bg-gray-200 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-xs font-bold text-[#111111]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center text-sm font-bold text-[#111111] hover:bg-gray-200 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`py-4 text-xs font-bold tracking-[0.25em] uppercase border border-[#111111] transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    addedSuccess ? "bg-emerald-800 text-white border-emerald-800" : "btn-fashion-black"
                  }`}
                >
                  {addedSuccess ? (
                    <>
                      <FiCheck className="text-base" />
                      <span>ADDED TO BAG</span>
                    </>
                  ) : (
                    <>
                      <FiShoppingCart className="text-base" />
                      <span>ADD TO CART</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className="py-4 text-xs font-bold tracking-[0.25em] uppercase btn-fashion-outline"
                >
                  BUY NOW
                </button>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-4 pt-8 mt-8 border-t border-gray-200 text-center text-[10px] font-bold uppercase">
                <div className="space-y-1">
                  <FiTruck className="text-lg text-[#111111] mx-auto" />
                  <span className="block text-[#111111]">EXPRESS SHIPPING</span>
                </div>
                <div className="space-y-1">
                  <FiRefreshCw className="text-lg text-[#111111] mx-auto" />
                  <span className="block text-[#111111]">EASY 30-DAY RETURNS</span>
                </div>
                <div className="space-y-1">
                  <FiShield className="text-lg text-[#111111] mx-auto" />
                  <span className="block text-[#111111]">VERIFIED GENUINE</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Recommended Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 pt-16 border-t border-[#111111]">
            <div className="flex justify-between items-end mb-12">
              <div>
                <span className="text-xs font-bold tracking-[0.3em] uppercase text-gray-500">RECOMMENDED PRODUCTS</span>
                <h3 className="text-3xl font-black uppercase text-[#111111] mt-1">You Might Also Like</h3>
              </div>
              <Link to="/products" className="text-xs font-bold tracking-widest uppercase text-[#111111] hover:underline">
                VIEW ALL
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((relProduct) => (
                <ProductCard key={relProduct._id} product={relProduct} />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}

export default ProductDetails;