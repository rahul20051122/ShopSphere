import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiX, FiSearch } from "react-icons/fi";
import { getProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";

const CATEGORIES = [
  "All",
  "Mobiles",
  "Laptops",
  "Audio",
  "Accessories",
  "Men Fashion",
  "Women Fashion",
  "Footwear"
];

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const selectedCategory = searchParams.get("category") || "All";
  const searchQuery = searchParams.get("search") || "";
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    fetchProducts();
  }, [searchParams, sortOption]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory && selectedCategory !== "All") params.category = selectedCategory;
      if (searchQuery) params.search = searchQuery;
      if (sortOption) params.sort = sortOption;

      const data = await getProducts(params);
      if (data && data.products) {
        setProducts(data.products);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (cat) => {
    const newParams = new URLSearchParams(searchParams);
    if (cat === "All") {
      newParams.delete("category");
    } else {
      newParams.set("category", cat);
    }
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setSearchParams({});
    setSortOption("");
  };

  return (
    <div className="bg-white text-[#111111] min-h-screen pb-24 pt-8 font-montserrat">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-gray-500">
            SHOPSPHERE COLLECTION
          </span>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-[#111111]">
            {selectedCategory !== "All" ? `${selectedCategory} Collection` : "All Products"}
          </h1>
          {searchQuery && (
            <p className="text-xs text-[#666666] tracking-wider uppercase pt-1">
              SEARCH RESULTS FOR: <span className="font-bold text-[#111111]">"{searchQuery}"</span>
            </p>
          )}
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pb-6 border-b border-[#111111]">
          
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 text-xs font-bold tracking-widest uppercase transition-all shrink-0 cursor-pointer border border-[#111111] ${
                  selectedCategory === cat
                    ? "bg-[#111111] text-white"
                    : "bg-[#f5f5f5] text-[#111111] hover:bg-[#111111] hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Option */}
          <div className="flex items-center gap-4 shrink-0">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="px-4 py-2 bg-[#f5f5f5] border border-[#111111] text-xs font-bold tracking-wider uppercase text-[#111111] focus:outline-none cursor-pointer"
            >
              <option value="">SORT BY: FEATURED</option>
              <option value="price-asc">PRICE: LOW TO HIGH</option>
              <option value="price-desc">PRICE: HIGH TO LOW</option>
            </select>

            {(selectedCategory !== "All" || searchQuery || sortOption) && (
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold tracking-widest text-[#666666] hover:text-[#111111] uppercase cursor-pointer"
              >
                <FiX />
                <span>CLEAR</span>
              </button>
            )}
          </div>

        </div>

        {/* Products Grid: Desktop 4 columns, Tablet 2 columns, Mobile 1 column */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse space-y-4">
                <div className="w-full aspect-[3/4] bg-gray-100 border border-gray-200" />
                <div className="h-4 bg-gray-100 w-2/3" />
                <div className="h-4 bg-gray-100 w-1/3" />
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-24 space-y-4">
            <FiSearch className="text-4xl text-gray-400 mx-auto" />
            <h3 className="text-2xl font-bold uppercase text-[#111111]">No Products Found</h3>
            <p className="text-xs text-[#666666] font-light max-w-sm mx-auto">
              We couldn't find any items matching your selected criteria.
            </p>
            <button
              onClick={handleClearFilters}
              className="btn-fashion-black mt-4"
            >
              RESET FILTERS
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default Products;