import { useState } from "react";
import { Link } from "react-router-dom";
import { FiInstagram, FiTwitter, FiFacebook, FiArrowRight, FiCheck } from "react-icons/fi";
import { FaPinterestP } from "react-icons/fa";

function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-[#111111] text-white pt-20 pb-12 font-poppins border-t border-[#222222]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-[#222222]">
          
          {/* Col 1: About (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <Link to="/" className="inline-block">
              <span className="font-montserrat text-2xl font-extrabold tracking-[0.2em] text-white uppercase">
                SHOPSPHERE
              </span>
            </Link>
            
            <p className="text-xs text-gray-400 leading-relaxed font-light max-w-sm">
              A premium fashion brand offering minimal, high-end apparel and curated lifestyle pieces. Tailored with clean craftsmanship and timeless aesthetic.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-colors"
                aria-label="Instagram"
              >
                <FiInstagram className="text-sm" />
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-colors"
                aria-label="Pinterest"
              >
                <FaPinterestP className="text-sm" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-colors"
                aria-label="Twitter"
              >
                <FiTwitter className="text-sm" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-colors"
                aria-label="Facebook"
              >
                <FiFacebook className="text-sm" />
              </a>
            </div>
          </div>

          {/* Col 2: Categories (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-montserrat text-xs font-bold uppercase tracking-[0.2em] text-white">
              CATEGORIES
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400 font-light">
              <li>
                <Link to="/products?category=Fashion" className="hover:text-white transition-colors">Fashion Collection</Link>
              </li>
              <li>
                <Link to="/products?category=Electronics" className="hover:text-white transition-colors">Techwear & Accessories</Link>
              </li>
              <li>
                <Link to="/products?category=Beauty" className="hover:text-white transition-colors">Beauty & Personal Care</Link>
              </li>
              <li>
                <Link to="/products?category=Home" className="hover:text-white transition-colors">Home Accents</Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition-colors">All Products</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Links (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <h4 className="font-montserrat text-xs font-bold uppercase tracking-[0.2em] text-white">
              CONTACT & NEWSLETTER
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed font-light">
              Mumbai Flagship: Palladium Mall, High Street Phoenix, Lower Parel, Mumbai, Maharashtra 400013. <br />
              Email: concierge@shopsphere.in | Phone: +91 (022) 6789-0100
            </p>

            <form onSubmit={handleSubscribe} className="pt-2">
              <div className="relative flex items-center border-b border-gray-700 focus-within:border-white transition-colors pb-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ENTER YOUR EMAIL..."
                  className="w-full bg-transparent text-xs font-montserrat tracking-widest text-white placeholder-gray-500 focus:outline-none uppercase py-2 pr-10"
                />
                <button
                  type="submit"
                  className="absolute right-0 text-gray-400 hover:text-white transition-colors p-1 cursor-pointer"
                  aria-label="Subscribe"
                >
                  <FiArrowRight className="text-lg" />
                </button>
              </div>
            </form>

            {subscribed && (
              <p className="text-[11px] text-emerald-400 font-montserrat flex items-center gap-1.5 pt-1">
                <FiCheck />
                <span>Thank you. You have been added to our private list.</span>
              </p>
            )}
          </div>

        </div>

        {/* Bottom Copyright Strip */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-[11px] text-gray-500 font-montserrat uppercase tracking-wider">
          <p>© 2026 SHOPSPHERE AI. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-6">
            <span>PRIVACY POLICY</span>
            <span>TERMS OF SERVICE</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
