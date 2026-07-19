import { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiPhone, FiMapPin, FiSend, FiCheck } from "react-icons/fi";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  return (
    <div className="bg-white text-[#111111] min-h-screen pb-24 pt-8 font-montserrat">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-gray-500">
            SHOPSPHERE BOUTIQUE
          </span>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-[#111111]">
            Contact Us
          </h1>
          <p className="text-xs font-poppins text-[#666666] font-light max-w-md mx-auto">
            Our client advisors are available to assist with bespoke fashion inquiries, orders, and delivery details.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          
          {/* Contact Form */}
          <div className="lg:col-span-7 bg-[#f5f5f5] p-8 sm:p-12 border-2 border-[#111111]">
            <h2 className="text-2xl font-black uppercase text-[#111111] mb-6">
              Send A Message
            </h2>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-white border border-[#111111] text-[#111111] space-y-2"
              >
                <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-widest text-[#111111]">
                  <FiCheck className="text-base" />
                  <span>MESSAGE RECEIVED</span>
                </div>
                <p className="text-xs font-poppins text-[#666666] font-light">
                  Thank you for contacting SHOPSPHERE. A client advisor will respond shortly.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#111111] mb-2">
                      YOUR NAME *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="ELEANOR VANCE"
                      className="w-full px-4 py-3 bg-white border border-[#111111] text-xs font-bold tracking-widest text-[#111111] placeholder-gray-400 focus:outline-none uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#111111] mb-2">
                      EMAIL ADDRESS *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="ELEANOR@EXAMPLE.COM"
                      className="w-full px-4 py-3 bg-white border border-[#111111] text-xs font-bold tracking-widest text-[#111111] placeholder-gray-400 focus:outline-none uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#111111] mb-2">
                    SUBJECT
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="ORDER / STYLING INQUIRY"
                    className="w-full px-4 py-3 bg-white border border-[#111111] text-xs font-bold tracking-widest text-[#111111] placeholder-gray-400 focus:outline-none uppercase"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#111111] mb-2">
                    MESSAGE *
                  </label>
                  <textarea
                    rows="5"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="HOW CAN WE ASSIST YOU?"
                    className="w-full px-4 py-3 bg-white border border-[#111111] text-xs font-bold tracking-widest text-[#111111] placeholder-gray-400 focus:outline-none uppercase"
                  />
                </div>

                <button type="submit" className="w-full py-4 btn-fashion-black flex items-center justify-center gap-3">
                  <span>SEND MESSAGE</span>
                  <FiSend />
                </button>
              </form>
            )}
          </div>

          {/* Boutique Details */}
          <div className="lg:col-span-5 space-y-8">
            <div className="p-8 border-2 border-[#111111] space-y-6">
              <h3 className="text-xl font-black uppercase text-[#111111] border-b border-[#111111] pb-3">
                Flagship Store
              </h3>

              <div className="space-y-4 text-xs font-bold">
                <div className="flex items-start gap-3">
                  <FiMapPin className="text-base shrink-0 mt-0.5" />
                  <div>
                    <span className="block uppercase">MUMBAI FLAGSHIP BOUTIQUE</span>
                    <p className="font-light text-gray-600 mt-0.5">Level 3, Palladium Mall, High Street Phoenix, Lower Parel, Mumbai, Maharashtra 400013</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FiMail className="text-base shrink-0 mt-0.5" />
                  <div>
                    <span className="block uppercase">EMAIL CONCIERGE</span>
                    <p className="font-light text-gray-600 mt-0.5">concierge@shopsphere.in</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FiPhone className="text-base shrink-0 mt-0.5" />
                  <div>
                    <span className="block uppercase">TELEPHONE</span>
                    <p className="font-light text-gray-600 mt-0.5">+91 (022) 6789-0100 / +91 98200 12345</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Map */}
        <div className="space-y-4">
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-gray-500">
            LOCATION MAP
          </span>
          <div className="w-full h-96 border-2 border-[#111111] overflow-hidden bg-gray-100">
            <iframe
              title="Google Map Boutique Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3772.6631853489!2d72.8256!3d18.9953!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7ce8c9735d461%3A0xb35a0edb8875086b!2sPalladium%20Mall!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, filter: "grayscale(100%) contrast(1.2)" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

      </div>
    </div>
  );
}

export default Contact;
