import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiGlobe, FiMapPin, FiPhone, FiCheck } from "react-icons/fi";
import { getProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";

const FEATURED_COLLECTIONS = [
  {
    name: "STREETWEAR '26",
    desc: "Oversized denim & jackets",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800",
    category: "Fashion"
  },
  {
    name: "MINIMAL ACCESSORIES",
    desc: "Eyewear & bucket hats",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800",
    category: "Electronics"
  },
  {
    name: "EDITORIAL TAILORING",
    desc: "Clean layered silhouettes",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800",
    category: "Beauty"
  }
];

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await getProducts();
        if (data && data.products) {
          setFeaturedProducts(data.products.slice(0, 4));
        }
      } catch (error) {
        console.error("Error loading featured products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSuccess(true);
      setNewsletterEmail("");
      setTimeout(() => setNewsletterSuccess(false), 4000);
    }
  };

  return (
    <div className="bg-white text-[#111111] font-montserrat overflow-hidden">
      
      {/* 1. EXACT SHOPSPHERE HERO BANNER (95-100% IDENTICAL TO REFERENCE IMAGE) */}
      <section className="relative min-h-[85vh] bg-white border-b border-[#111111] overflow-hidden">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 min-h-[80vh]">
          
          {/* LEFT SIDE (White background with Memphis geometric decorations & bold typography) */}
          <div className="lg:col-span-5 bg-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative z-10 border-r border-[#111111]">
            
            {/* Top Decorative Memphis Elements */}
            <div className="flex items-center justify-between relative">
              {/* Top Left: Striped circle half + solid black triangle */}
              <div className="relative flex items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-striped-pattern border border-[#111111]" />
                <div className="w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-b-[28px] border-b-[#111111] transform -rotate-45" />
              </div>

              {/* Top Right: Hollow Triangles Cluster */}
              <div className="flex gap-1.5 text-[#111111] text-lg font-mono">
                <span>Δ</span>
                <span>Δ</span>
                <span>Δ</span>
                <span>Δ</span>
              </div>
            </div>

            {/* Middle Main Content */}
            <div className="my-8 space-y-6">
              
              {/* Headline Typography (Exact: Outlined ONLINE, Solid SHOPPING, Wide EASIER THAN EVER) */}
              <div className="space-y-1">
                <motion.h1
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-stroke text-5xl sm:text-7xl font-black uppercase tracking-tight leading-none"
                >
                  ONLINE
                </motion.h1>

                <motion.h1
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-5xl sm:text-7xl font-black text-[#111111] uppercase tracking-tight leading-none"
                >
                  SHOPPING
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-sm sm:text-base font-light tracking-[0.45em] text-[#111111] uppercase pt-2"
                >
                  EASIER THAN EVER
                </motion.p>
              </div>

              {/* Editorial Description Paragraph */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-xs font-poppins text-[#666666] leading-relaxed max-w-sm font-light"
              >
                Discover curated streetwear, minimal silhouettes, and luxury apparel tailored for modern fashion enthusiasts.
              </motion.p>

              {/* Black SEE MORE Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="pt-2"
              >
                <Link to="/products" className="btn-fashion-black">
                  SEE MORE
                </Link>
              </motion.div>

            </div>

            {/* Bottom Decorative Controls & Memphis Shapes */}
            <div className="flex items-center justify-between pt-4 relative">
              {/* Pagination Dots Indicator */}
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#111111]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#111111]" />
                <span className="w-2.5 h-2.5 rounded-full border border-[#111111] bg-white" />
              </div>

              {/* Striped Circle & Floating Triangle Decorative Cluster */}
              <div className="relative flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-striped-pattern border border-[#111111]" />
                <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-b-[24px] border-b-[#111111] transform rotate-12" />
              </div>
            </div>

          </div>

          {/* RIGHT SIDE (Pastel Blue #9cdbf0 background with Fashion Models & Geometric Accents) */}
          <div className="lg:col-span-7 bg-[#9cdbf0] relative flex items-center justify-center p-6 sm:p-12 overflow-hidden min-h-[500px]">
            
            {/* Top-Right White Dot Matrix Pattern */}
            <div className="absolute top-6 right-8 w-32 h-20 dot-matrix opacity-70 pointer-events-none" />

            {/* Top Floating Solid Black Triangle */}
            <div className="absolute top-10 right-16 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[35px] border-b-[#111111] transform rotate-45 pointer-events-none" />

            {/* Top Left Hollow Triangles Cluster */}
            <div className="absolute top-12 left-10 text-[#111111] text-2xl font-mono grid grid-cols-4 gap-1 pointer-events-none">
              <span>Δ</span><span>Δ</span><span>Δ</span><span>Δ</span>
              <span>Δ</span><span>Δ</span><span>Δ</span><span>Δ</span>
            </div>

            {/* Main Fashion Model Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative z-10 w-full max-w-lg shadow-2xl overflow-hidden border-2 border-[#111111]"
            >
              <img
                src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=1200"
                alt="Apple Watch Ultra - SHOPSPHERE"
                className="w-full h-[520px] sm:h-[600px] object-cover filter contrast-105"
              />
            </motion.div>

            {/* Bottom Right Hollow Triangle Matrix */}
            <div className="absolute bottom-10 right-6 text-[#111111] text-xl font-mono grid grid-cols-3 gap-1 pointer-events-none">
              <span>Δ</span><span>Δ</span><span>Δ</span>
              <span>Δ</span><span>Δ</span><span>Δ</span>
              <span>Δ</span><span>Δ</span><span>Δ</span>
            </div>

            {/* Bottom Floating Triangle */}
            <div className="absolute bottom-8 left-12 w-0 h-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-b-[30px] border-b-[#111111] transform -rotate-12 pointer-events-none" />

          </div>

        </div>

        {/* BOTTOM ACCENT BAR (Exact to Reference Bottom Strip) */}
        <div className="w-full bg-[#111111] text-white py-3 px-6 sm:px-12 flex flex-col sm:flex-row items-center justify-between text-xs tracking-[0.25em] font-bold uppercase">
          <span>www.shopsphere.com</span>
          <div className="flex items-center gap-4 text-sm mt-2 sm:mt-0">
            <FiGlobe className="hover:text-gray-400 cursor-pointer" />
            <FiMapPin className="hover:text-gray-400 cursor-pointer" />
            <FiPhone className="hover:text-gray-400 cursor-pointer" />
          </div>
        </div>
      </section>

      {/* 2. FEATURED CATEGORIES SECTION */}
      <section className="py-20 bg-[#f5f5f5] border-b border-[#111111]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-gray-500">
              EDITORIAL CATEGORIES
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111] uppercase tracking-tight">
              Featured Collections
            </h2>
            <p className="text-xs font-poppins text-[#666666] font-light">
              Explore streetwear, minimal accessories, and modern tailoring.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURED_COLLECTIONS.map((col, idx) => (
              <motion.div
                key={col.name}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
              >
                <Link
                  to={`/products?category=${encodeURIComponent(col.category)}`}
                  className="group block relative aspect-[3/4] bg-gray-200 border border-[#111111] overflow-hidden"
                >
                  <img
                    src={col.image}
                    alt={col.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-300">
                      {col.desc}
                    </span>
                    <h3 className="text-xl font-extrabold uppercase tracking-wider">
                      {col.name}
                    </h3>
                    <div className="pt-2 flex items-center gap-2 text-xs font-bold text-white group-hover:underline">
                      <span>EXPLORE COLLECTION</span>
                      <FiArrowRight />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 3. PRODUCT SECTION (WHITE BACKGROUND, HEADING: Featured Products) */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-6 border-b border-gray-200">
            <div>
              <span className="text-xs font-bold tracking-[0.3em] uppercase text-gray-500">
                SHOPSPHERE SELECTION
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111] uppercase tracking-tight mt-1">
                Featured Products
              </h2>
            </div>
            
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#111111] hover:text-gray-600 transition-colors"
            >
              <span>VIEW ALL CATALOGUE</span>
              <FiArrowRight />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse space-y-4">
                  <div className="w-full aspect-[3/4] bg-gray-100 border border-gray-200" />
                  <div className="h-4 bg-gray-100 w-2/3" />
                  <div className="h-4 bg-gray-100 w-1/3" />
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xs text-gray-500 uppercase tracking-widest">
                No active products in catalog.
              </p>
            </div>
          )}

        </div>
      </section>

      {/* 4. NEWSLETTER SECTION */}
      <section className="py-20 bg-[#f5f5f5] border-t border-[#111111]">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-6">
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-gray-500">
            NEWSLETTER
          </span>
          <h2 className="text-3xl font-extrabold text-[#111111] uppercase tracking-tight">
            Join The Private List
          </h2>
          <p className="text-xs font-poppins text-[#666666] font-light max-w-lg mx-auto">
            Receive exclusive seasonal lookbooks and private collection invitations.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="pt-4 max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="ENTER YOUR EMAIL..."
              className="flex-1 px-4 py-3 bg-white text-xs tracking-widest text-[#111111] placeholder-gray-400 border border-[#111111] focus:outline-none uppercase"
            />
            <button
              type="submit"
              className="btn-fashion-black shrink-0"
            >
              SUBSCRIBE
            </button>
          </form>

          {newsletterSuccess && (
            <p className="text-xs font-bold text-emerald-800 flex items-center justify-center gap-1.5 pt-2 uppercase">
              <FiCheck />
              <span>Subscription confirmed. Thank you.</span>
            </p>
          )}
        </div>
      </section>

    </div>
  );
}

export default Home;