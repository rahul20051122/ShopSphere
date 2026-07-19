# 🛍️ ShopSphere AI — Modern Flagship MERN E-Commerce Platform

A production-ready, full-stack MERN (MongoDB, Express, React, Node.js) e-commerce platform built with an Apple + Amazon-inspired glassmorphism design system, AI curation themes, Razorpay/Stripe payment integrations, order status progress tracking, persistent wishlist sharing, and a comprehensive admin analytics portal.

---

## 🌟 Key Features

### 🛒 Storefront & Customer Experience
- **Apple/Amazon Aesthetics**: Modern dark glassmorphism UI, vibrant HSL gradients, smooth Framer Motion micro-animations, and full mobile responsiveness.
- **Neural Product Discovery**: Live search, multi-category filters (Electronics, Fashion, Mobiles, Home, Beauty), price sorting, and paginated catalogs.
- **Product Details & Gallery**: Interactive image preview galleries, stock status indicators, star ratings, quantity selectors, and related product recommendations.
- **Smart Cart & Savings Engine**: Subtotal calculation, 18% GST auto-taxation, free shipping threshold rules, coupon application engine, and local storage state persistence.
- **Persistent Wishlist**: One-click wishlist save/remove toggles, "Move To Cart" actions, and a "Share Wishlist" feature that copies shareable URLs directly to the clipboard.
- **Order Tracking Timeline**: Real-time visual progress step bar (`Pending` -> `Confirmed` -> `Packed` -> `Shipped` -> `Out For Delivery` -> `Delivered`), order cancellation controls, and invoice print/download triggers.

### 🔐 Security & Authentication
- **JWT Bearer Auth**: Stateless JSON Web Token authentication with local storage session persistence, auto-refresh verification, and auto-logout expiration rules.
- **Role-Based Authorization**: Protected routes enforcing login access (`/cart`, `/checkout`, `/orders`, `/profile`, `/wishlist`) and strict `admin` privilege requirements for `/admin`.
- **Form Validation & Security**: Interactive password strength meter (Weak/Medium/Strong), visibility toggles, and input validation alerts.

### ⚡ Admin & Analytics Portal
- **Catalog Management (CRUD)**: Create, update, soft-delete, and status-toggle (`Active`, `Out of Stock`, `Hidden`) products with drag-and-drop image uploads and live previewing.
- **Order Dispatch Control**: Inspect customer shipping addresses, line items, and modify order fulfillment statuses in real time.
- **Analytics & Telemetry**: Dynamic SVG Line, Donut, and Bar charts for MoM revenue trends, category market shares, and inventory alerts.

### 💳 Payment Gateways & Webhooks
- **Multi-Method Support**: Cash On Delivery (COD), Razorpay UPI/NetBanking, and Stripe International Cards.
- **Webhook Telemetry**: Dedicated backend route (`/api/payment/webhook`) to handle payment provider callbacks asynchronously.

---

## 🏗️ Technology Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS v4, Framer Motion, React Router v7, React Icons, Axios |
| **Backend** | Node.js, Express.js, Mongoose, JSON Web Token (JWT), bcryptjs, Cors, dotenv |
| **Database** | MongoDB Atlas / Local MongoDB Server |
| **Media / Storage** | Cloudinary API / Base64 File Reader fallback |
| **Payments** | Razorpay SDK, Stripe API |

---

## 📁 Repository Structure

```
ShopSphere-AI/
├── client/                     # React + Vite Frontend
│   ├── src/
│   │   ├── components/         # Navbar, Footer, ProtectedRoute, etc.
│   │   ├── context/            # AuthContext, CartContext, WishlistContext
│   │   ├── pages/              # Home, Login, Register, Cart, Checkout, Orders, Wishlist, AdminDashboard...
│   │   ├── services/           # Axios API Client & Services (authService, orderService, productService)
│   │   ├── App.jsx             # React Router Configuration
│   │   └── main.jsx            # React Root & Global Providers
│   └── .env.example
├── server/                     # Node.js + Express Backend
│   ├── config/                 # MongoDB Database Connection
│   ├── controllers/            # authController, productController, orderController, paymentController
│   ├── middleware/             # authMiddleware (protect, admin)
│   ├── models/                 # User, Product, Order Schemas
│   ├── routes/                 # Auth, Product, Cart, Order, Payment Routes
│   ├── server.js               # Express Server Entrypoint
│   └── .env.example
└── README.md                   # Flagship Documentation
```

---

## ⚡ Quick Start & Local Setup

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB running locally or a MongoDB Atlas connection string.

### 1. Backend Setup
```bash
cd server
npm install
# Copy environment variables template
cp .env.example .env
# Edit .env and set your MONGO_URI & JWT_SECRET
npm run dev
```

### 2. Frontend Setup
```bash
cd client
npm install
# Copy environment variables template
cp .env.example .env
npm run dev
```

The client dev server will launch at `http://localhost:5173` and communicate with the backend at `http://localhost:5000/api`.

---

## 🚀 Production Deployment Guide

### Backend Deployment (Render / Railway / Heroku)
1. Push the repository to GitHub.
2. Create a **Web Service** on Render connected to the `/server` directory.
3. Set Build Command: `npm install`
4. Set Start Command: `node server.js`
5. Configure Environment Variables in Render Dashboard:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `CLOUDINARY_CLOUD_NAME`
   - `RAZORPAY_KEY_ID`
   - `STRIPE_SECRET_KEY`

### Frontend Deployment (Vercel / Netlify)
1. Create a new project on Vercel connected to the `/client` directory.
2. Set Build Command: `npm run build`
3. Set Output Directory: `dist`
4. Configure Environment Variables:
   - `VITE_API_BASE_URL=https://your-backend-service.onrender.com/api`
