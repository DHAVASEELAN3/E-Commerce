import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './index.css';

// ─── CONTEXT ────────────────────────────────────────────────────────────────

const AppContext = createContext(null);

export function useApp() {
  return useContext(AppContext);
}

// ─── MOCK DATA ───────────────────────────────────────────────────────────────

const PRODUCTS = [
  { id: 1, name: 'Obsidian ANC Headphones', price: 12999, originalPrice: 18999, category: 'Electronics', rating: 4.8, reviews: 2341, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', badge: 'Bestseller', stock: 45, description: 'Premium noise-cancelling headphones with 40-hour battery life, spatial audio, and ultra-soft memory foam cushions.' },
  { id: 2, name: 'Lumina Smartwatch Pro', price: 24999, originalPrice: 32999, category: 'Electronics', rating: 4.7, reviews: 1876, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', badge: 'New', stock: 23, description: 'Ultra-thin smartwatch with AMOLED display, health monitoring suite, GPS, and 7-day battery.' },
  { id: 3, name: 'Velvet Cashmere Blazer', price: 8999, originalPrice: 13999, category: 'Fashion', rating: 4.9, reviews: 987, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4f8c5f?w=400', badge: 'Premium', stock: 12, description: 'Tailored Italian cashmere blazer with silk lining and hand-stitched lapels.' },
  { id: 4, name: 'Terra Ceramic Coffee Set', price: 3499, originalPrice: 4999, category: 'Home', rating: 4.6, reviews: 543, image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400', badge: 'Sale', stock: 67, description: 'Handcrafted ceramic pour-over set with matte glaze finish. Includes kettle, server, and mugs.' },
  { id: 5, name: 'Sovereign Leather Wallet', price: 2999, originalPrice: 3999, category: 'Fashion', rating: 4.5, reviews: 1234, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400', badge: null, stock: 89, description: 'Full-grain vegetable-tanned leather bifold wallet with RFID blocking.' },
  { id: 6, name: 'Apex Mechanical Keyboard', price: 9999, originalPrice: 13999, category: 'Electronics', rating: 4.8, reviews: 3421, image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400', badge: 'Hot', stock: 31, description: 'TKL mechanical keyboard with Cherry MX switches and per-key RGB lighting.' },
  { id: 7, name: 'Botanica Skincare Set', price: 5499, originalPrice: 7999, category: 'Beauty', rating: 4.7, reviews: 892, image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400', badge: 'New', stock: 54, description: 'Plant-based serums and moisturizers. 95% natural ingredients, dermatologist tested.' },
  { id: 8, name: 'Nomad Camera Backpack', price: 6999, originalPrice: 9999, category: 'Travel', rating: 4.6, reviews: 678, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', badge: null, stock: 28, description: 'Weather-resistant 25L backpack with dedicated camera compartment and laptop sleeve.' },
  { id: 9, name: 'Eclipse Table Lamp', price: 4299, originalPrice: 5999, category: 'Home', rating: 4.4, reviews: 345, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400', badge: 'Sale', stock: 19, description: 'Adjustable arc table lamp with warm/cool LED and touch dimmer control.' },
  { id: 10, name: 'Prism Wireless Earbuds', price: 7999, originalPrice: 11999, category: 'Electronics', rating: 4.9, reviews: 4521, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400', badge: 'Bestseller', stock: 76, description: 'True wireless earbuds with adaptive noise cancellation and 36-hour playback.' },
  { id: 11, name: 'Onyx Sunglasses', price: 3799, originalPrice: 5499, category: 'Fashion', rating: 4.5, reviews: 421, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400', badge: null, stock: 43, description: 'Polarized acetate frame sunglasses with UV400 protection and spring hinges.' },
  { id: 12, name: 'Forge Fitness Tracker', price: 5999, originalPrice: 8499, category: 'Electronics', rating: 4.6, reviews: 1123, image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400', badge: 'New', stock: 38, description: '24/7 health monitoring with ECG, SpO2, stress tracking, and GPS.' },
  { id: 13, name: 'Silk Pillowcase Set', price: 2499, originalPrice: 3999, category: 'Home', rating: 4.7, reviews: 845, image: 'https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=400', badge: 'Bestseller', stock: 92, description: 'Premium mulberry silk pillowcases for hair and skin health.' },
  { id: 14, name: 'Chrome Dumbbell Set', price: 8999, originalPrice: 12999, category: 'Sports', rating: 4.6, reviews: 567, image: 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=400', badge: 'Hot', stock: 34, description: 'Adjustable chrome dumbbells with non-slip grip handles. 5kg-25kg range.' },
  { id: 15, name: 'Vintage Camera Strap', price: 1899, originalPrice: 2999, category: 'Travel', rating: 4.4, reviews: 234, image: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400', badge: null, stock: 78, description: 'Genuine leather camera strap with adjustable length and comfortable padding.' },
  { id: 16, name: 'Marble Desk Organizer', price: 2799, originalPrice: 4299, category: 'Home', rating: 4.5, reviews: 412, image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=400', badge: 'New', stock: 55, description: 'Minimalist marble desk organizer with multiple compartments for office supplies.' },
  { id: 17, name: 'Thermal Insulated Bottle', price: 1599, originalPrice: 2299, category: 'Travel', rating: 4.8, reviews: 3124, image: 'https://images.unsplash.com/photo-1602088113235-229c19758e9f?w=400', badge: 'Bestseller', stock: 112, description: 'Double-wall stainless steel bottle keeps drinks cold for 24 hours or hot for 12.' },
  { id: 18, name: 'Linen Bedsheet Set', price: 3999, originalPrice: 5999, category: 'Home', rating: 4.7, reviews: 678, image: 'https://images.unsplash.com/photo-1635686881133-e5a9f3d26bf5?w=400', badge: 'Sale', stock: 41, description: 'Egyptian cotton linen bedsheet set with deep pockets and premium finish.' },
  { id: 19, name: 'Portable Projector', price: 18999, originalPrice: 26999, category: 'Electronics', rating: 4.7, reviews: 1456, image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400', badge: 'New', stock: 19, description: '4K portable projector with built-in speaker and 5-hour battery life.' },
  { id: 20, name: 'Wool Knit Sweater', price: 4499, originalPrice: 6999, category: 'Fashion', rating: 4.6, reviews: 523, image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d537?w=400', badge: null, stock: 38, description: 'Premium merino wool knit sweater with crew neck and ribbed cuffs.' },
  { id: 21, name: 'Ceramic Plant Pots', price: 1299, originalPrice: 1999, category: 'Home', rating: 4.5, reviews: 234, image: 'https://images.unsplash.com/photo-1604482827173-50c3da106d4e?w=400', badge: 'Hot', stock: 156, description: 'Set of 3 ceramic plant pots with drainage holes and saucers included.' },
  { id: 22, name: 'Portable SSD 1TB', price: 9999, originalPrice: 14999, category: 'Electronics', rating: 4.8, reviews: 2845, image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400', badge: 'Bestseller', stock: 67, description: 'Ultra-fast external SSD with USB-C 3.1. Durable rubber casing and compact design.' },
  { id: 23, name: 'Yoga Mat Premium', price: 2199, originalPrice: 3499, category: 'Sports', rating: 4.7, reviews: 867, image: 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=400', badge: 'New', stock: 84, description: 'Non-slip TPE yoga mat with alignment marks and carrying strap.' },
  { id: 24, name: 'Glass Water Bottle', price: 899, originalPrice: 1399, category: 'Travel', rating: 4.4, reviews: 456, image: 'https://images.unsplash.com/photo-1602088113235-229c19758e9f?w=400', badge: null, stock: 203, description: 'Borosilicate glass water bottle with protective silicone sleeve.' },
  { id: 25, name: 'Canvas Tote Bag', price: 1499, originalPrice: 2299, category: 'Fashion', rating: 4.6, reviews: 678, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4f8c5f?w=400', badge: 'Sale', stock: 95, description: 'Heavy-duty canvas tote bag with leather handles and reinforced stitching.' },
  { id: 26, name: 'Ring Light 10 inch', price: 3499, originalPrice: 4999, category: 'Electronics', rating: 4.7, reviews: 1234, image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400', badge: 'Hot', stock: 47, description: 'Professional 10-inch ring light with tripod stand and remote control.' },
  { id: 27, name: 'Bamboo Cutting Board', price: 899, originalPrice: 1299, category: 'Home', rating: 4.5, reviews: 345, image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400', badge: null, stock: 78, description: 'Organic bamboo cutting board with juice groove and hanging loop.' },
  { id: 28, name: 'Wireless Gaming Mouse', price: 2999, originalPrice: 4499, category: 'Electronics', rating: 4.8, reviews: 2156, image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400', badge: 'Bestseller', stock: 89, description: 'Ultra-responsive gaming mouse with adjustable DPI and 70-hour battery life.' },
  { id: 29, name: 'Denim Jacket Classic', price: 3999, originalPrice: 5999, category: 'Fashion', rating: 4.6, reviews: 812, image: 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=400', badge: 'New', stock: 32, description: 'Timeless classic denim jacket with comfortable fit and durable fabric.' },
  { id: 30, name: 'Aromatherapy Diffuser', price: 1999, originalPrice: 2999, category: 'Beauty', rating: 4.7, reviews: 654, image: 'https://images.unsplash.com/photo-1595536404bca-f964c321e10e?w=400', badge: 'Hot', stock: 61, description: 'Ultrasonic oil diffuser with LED mood lighting and timer function.' },
  { id: 31, name: 'Stainless Steel Flask', price: 1299, originalPrice: 1999, category: 'Travel', rating: 4.5, reviews: 423, image: 'https://images.unsplash.com/photo-1602088113235-229c19758e9f?w=400', badge: null, stock: 104, description: 'Leak-proof stainless steel flask with temperature control display.' },
  { id: 32, name: 'Bluetooth Speaker Outdoor', price: 3999, originalPrice: 5999, category: 'Electronics', rating: 4.7, reviews: 1876, image: 'https://images.unsplash.com/photo-1589003077984-894e133da89d?w=400', badge: 'Bestseller', stock: 73, description: 'Waterproof outdoor Bluetooth speaker with 360-degree sound and 20-hour battery.' },
  { id: 33, name: 'Linen Napkins Set', price: 899, originalPrice: 1399, category: 'Home', rating: 4.4, reviews: 234, image: 'https://images.unsplash.com/photo-1599599810694-6a6ee2583d0e?w=400', badge: 'Sale', stock: 156, description: 'Set of 6 premium linen napkins with contrasting embroidered borders.' },
  { id: 34, name: 'Meditation Cushion', price: 1599, originalPrice: 2499, category: 'Sports', rating: 4.6, reviews: 567, image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400', badge: 'New', stock: 42, description: 'Buckwheat-filled meditation cushion with organic cotton cover.' },
  { id: 35, name: 'Microfiber Towel', price: 599, originalPrice: 999, category: 'Travel', rating: 4.5, reviews: 789, image: 'https://images.unsplash.com/photo-1607613814075-e51df1bdc82f?w=400', badge: null, stock: 234, description: 'Quick-dry microfiber towel perfect for gym and travel use.' },
  { id: 36, name: 'USB Hub 7 Port', price: 1999, originalPrice: 2999, category: 'Electronics', rating: 4.6, reviews: 876, image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400', badge: 'Hot', stock: 68, description: '7-port USB 3.0 hub with individual switches and power adapter.' },
  { id: 37, name: 'Linen Shift Dress', price: 2999, originalPrice: 4499, category: 'Fashion', rating: 4.7, reviews: 645, image: 'https://images.unsplash.com/photo-1595777712802-461d67d0bce8?w=400', badge: 'Bestseller', stock: 28, description: 'Breathable linen shift dress with side pockets and comfortable fit.' },
  { id: 38, name: 'Coffee Grinder Burr', price: 4999, originalPrice: 7499, category: 'Home', rating: 4.8, reviews: 1234, image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b3f7?w=400', badge: 'New', stock: 19, description: 'Precision burr grinder with 15 grind settings for espresso to French press.' },
  { id: 39, name: 'Phone Case Leather', price: 1299, originalPrice: 1999, category: 'Fashion', rating: 4.5, reviews: 523, image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400', badge: null, stock: 167, description: 'Premium leather phone case with integrated card slot and wireless charging.' },
  { id: 40, name: 'Desk Lamp LED', price: 1899, originalPrice: 2999, category: 'Home', rating: 4.6, reviews: 456, image: 'https://images.unsplash.com/photo-1565636192335-14f10b9cecf8?w=400', badge: 'Sale', stock: 83, description: 'Adjustable LED desk lamp with USB charging port and touch dimmer.' },
  { id: 41, name: 'Resistance Band Set', price: 1299, originalPrice: 1999, category: 'Sports', rating: 4.7, reviews: 678, image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400', badge: 'Hot', stock: 126, description: '5-piece resistance band set with varying resistance levels and storage bag.' },
  { id: 42, name: 'Travel Pillow Neck', price: 899, originalPrice: 1499, category: 'Travel', rating: 4.4, reviews: 334, image: 'https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=400', badge: null, stock: 189, description: 'Memory foam neck pillow with ergonomic design and washable cover.' },
  { id: 43, name: 'Webcam 1080p HD', price: 2499, originalPrice: 3999, category: 'Electronics', rating: 4.7, reviews: 1123, image: 'https://images.unsplash.com/photo-1598149135622-6a91b1ee4d71?w=400', badge: 'Bestseller', stock: 94, description: 'Full HD webcam with auto-focus, noise-reducing microphone, and wide angle.' },
  { id: 44, name: 'Cotton T-Shirt Pack', price: 1499, originalPrice: 2499, category: 'Fashion', rating: 4.5, reviews: 612, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', badge: 'New', stock: 245, description: 'Pack of 3 premium cotton t-shirts in neutral colors with perfect fit.' },
  { id: 45, name: 'Bamboo Utensil Set', price: 599, originalPrice: 999, category: 'Home', rating: 4.6, reviews: 234, image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400', badge: null, stock: 312, description: 'Eco-friendly bamboo utensil set with bamboo storage case.' },
  { id: 46, name: 'Phone Stand Adjustable', price: 599, originalPrice: 999, category: 'Electronics', rating: 4.5, reviews: 567, image: 'https://images.unsplash.com/photo-1605559424843-9e4c3ca4b7f7?w=400', badge: 'Hot', stock: 298, description: 'Adjustable phone stand compatible with all sizes of phones and tablets.' },
  { id: 47, name: 'Wool Socks Pack', price: 1199, originalPrice: 1999, category: 'Fashion', rating: 4.6, reviews: 423, image: 'https://images.unsplash.com/photo-1516762714899-a31d2f0ecbee?w=400', badge: null, stock: 178, description: 'Pack of 5 merino wool socks with superior warmth and moisture-wicking.' },
  { id: 48, name: 'Wire Shelf Unit', price: 2999, originalPrice: 4499, category: 'Home', rating: 4.4, reviews: 345, image: 'https://images.unsplash.com/photo-1554995207-c18e203f5b54?w=400', badge: 'Sale', stock: 56, description: '5-tier wire shelf unit with strong steel construction and adjustable shelves.' },
  { id: 49, name: 'Screen Protector Tempered', price: 399, originalPrice: 699, category: 'Electronics', rating: 4.7, reviews: 1876, image: 'https://images.unsplash.com/photo-1599586120694-6aacf3c3f5a7?w=400', badge: 'Bestseller', stock: 423, description: 'Tempered glass screen protector with anti-glare and easy installation.' },
  { id: 50, name: 'Hair Care Oil', price: 899, originalPrice: 1499, category: 'Beauty', rating: 4.6, reviews: 654, image: 'https://images.unsplash.com/photo-1599599810694-6a6ee2583d0e?w=400', badge: 'New', stock: 87, description: 'Organic argan oil hair care treatment for all hair types and deep conditioning.' },
];

const CATEGORIES = [
  { id: 1, name: 'Electronics', icon: '⚡', count: 234, color: 'from-blue-500 to-cyan-500', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200' },
  { id: 2, name: 'Fashion', icon: '👗', count: 567, color: 'from-pink-500 to-rose-500', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=200' },
  { id: 3, name: 'Home', icon: '🏠', count: 189, color: 'from-amber-500 to-orange-500', image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=200' },
  { id: 4, name: 'Beauty', icon: '✨', count: 312, color: 'from-purple-500 to-violet-500', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200' },
  { id: 5, name: 'Travel', icon: '✈️', count: 145, color: 'from-teal-500 to-emerald-500', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200' },
  { id: 6, name: 'Sports', icon: '🏆', count: 278, color: 'from-red-500 to-orange-500', image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=200' },
];

const ORDERS = [
  { id: 'ORD-2024-001', date: '2024-10-15', status: 'Delivered', total: 24999, items: 2 },
  { id: 'ORD-2024-002', date: '2024-10-22', status: 'In Transit', total: 12999, items: 1 },
  { id: 'ORD-2024-003', date: '2024-10-28', status: 'Processing', total: 8498, items: 3 },
  { id: 'ORD-2024-004', date: '2024-11-01', status: 'Pending', total: 5999, items: 1 },
];

// ─── UTILITIES ───────────────────────────────────────────────────────────────

const formatPrice = (p) => `₹${p.toLocaleString('en-IN')}`;
const discount = (orig, curr) => Math.round(((orig - curr) / orig) * 100);

// ─── ANIMATIONS ──────────────────────────────────────────────────────────────

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.08 } },
};

const fadeUpItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// ─── TOAST ───────────────────────────────────────────────────────────────────

function Toast({ toasts, removeToast }) {
  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium cursor-pointer max-w-xs ${
              t.type === 'success' ? 'bg-green-500 text-white' :
              t.type === 'error' ? 'bg-red-500 text-white' :
              t.type === 'info' ? 'bg-blue-500 text-white' :
              'bg-gray-900 text-white'
            }`}
            onClick={() => removeToast(t.id)}
          >
            <span className="text-lg">{t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ℹ'}</span>
            <span>{t.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─── SKELETON LOADER ─────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-dark-700 rounded-2xl overflow-hidden shadow-card">
      <div className="skeleton h-52 w-full" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
        <div className="skeleton h-5 w-1/3 rounded" />
      </div>
    </div>
  );
}

// ─── STAR RATING ─────────────────────────────────────────────────────────────

function StarRating({ rating, size = 'sm' }) {
  const sz = size === 'sm' ? 'text-sm' : 'text-base';
  return (
    <div className={`flex gap-0.5 ${sz}`}>
      {[1,2,3,4,5].map(s => (
        <span key={s} className={rating >= s ? 'star-filled' : rating >= s - 0.5 ? 'text-amber-300' : 'star-empty'}>★</span>
      ))}
    </div>
  );
}

// ─── NAVBAR ──────────────────────────────────────────────────────────────────

function Navbar({ darkMode, toggleDark }) {
  const { cart, user, setUser } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const cartCount = cart.reduce((acc, i) => acc + i.quantity, 0);
  const isAdmin = user?.role === 'ADMIN';

  return (
    <nav className={`navbar ${scrolled ? 'shadow-md' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <span className="font-display text-xl font-bold gradient-text">DSS Shop</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {['/', '/products', '/categories'].map((path, i) => {
              const labels = ['Home', 'Products', 'Categories'];
              return (
                <Link
                  key={path}
                  to={path}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    location.pathname === path
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400'
                  }`}
                >
                  {labels[i]}
                </Link>
              );
            })}
            {isAdmin && (
              <Link to="/admin" className="text-sm font-medium text-accent-600 dark:text-accent-400">
                Admin
              </Link>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Dark mode */}
            <button
              onClick={toggleDark}
              className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>

            {/* Search */}
            <button
              onClick={() => navigate('/products')}
              className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
            >
              🔍
            </button>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors">
              🛒
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                >
                  {cartCount}
                </motion.span>
              )}
            </Link>

            {/* User */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link to="/dashboard" className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white text-xs font-bold">
                    {user.name[0]}
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{user.name.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={() => setUser(null)}
                  className="hidden sm:block text-xs text-gray-400 hover:text-red-500 transition-colors px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-primary !px-4 !py-2 text-sm hidden sm:block">
                Sign in
              </Link>
            )}

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-700"
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-100 dark:border-dark-600 py-3 space-y-1"
            >
              {[['/', 'Home'], ['/products', 'Products'], ['/cart', 'Cart'], user ? ['/dashboard', 'My Account'] : ['/login', 'Sign in']].map(([path, label]) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20"
                >
                  {label}
                </Link>
              ))}
              {user && (
                <button
                  onClick={() => { setUser(null); setMenuOpen(false); }}
                  className="block w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50"
                >
                  Logout
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-dark-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <span className="font-display text-xl font-bold text-white">DSS Shop</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Curating the finest products for the discerning shopper. Quality, style, and service — always.
            </p>
            <div className="flex gap-3 mt-5">
              {['𝕏', 'f', 'in', '📸'].map((icon, i) => (
                <button key={i} className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-primary-600 transition-colors flex items-center justify-center text-sm">
                  {icon}
                </button>
              ))}
            </div>
          </div>
          {[
            { title: 'Shop', links: ['Electronics', 'Fashion', 'Home & Living', 'Beauty', 'Sports', 'Travel'] },
            { title: 'Support', links: ['Help Center', 'Track Order', 'Returns & Refunds', 'Size Guide', 'Contact Us'] },
            { title: 'Company', links: ['About Us', 'Blog', 'Careers', 'Press', 'Privacy Policy', 'Terms'] },
          ].map(({ title, links }) => (
            <div key={title}>
              <h4 className="font-semibold text-white mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link}>
                    <a href="#" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">© 2024 DSS Shop. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500">We accept</span>
            {['💳 Visa', '💳 Mastercard', '🏦 UPI', '📱 PhonePe'].map(m => (
              <span key={m} className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-400">{m}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────

function ProductCard({ product, onAddToCart }) {
  const { addToCart } = useApp();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    setAdding(true);
    addToCart(product);
    if (onAddToCart) onAddToCart();
    setTimeout(() => setAdding(false), 800);
  };

  return (
    <motion.div
      variants={fadeUpItem}
      className="product-card group"
      onClick={() => navigate(`/products/${product.id}`)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative overflow-hidden h-52 bg-gray-50 dark:bg-dark-600">
        <img
          src={product.image}
          alt={product.name}
          className="product-image w-full h-full object-cover"
          loading="lazy"
        />
        {product.badge && (
          <span className={`absolute top-3 left-3 price-badge ${
            product.badge === 'Sale' ? '!bg-red-500' :
            product.badge === 'Hot' ? '!bg-accent-500' :
            product.badge === 'New' ? '!bg-blue-500' :
            'bg-primary-600'
          }`}>
            {product.badge}
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <motion.button
          className="absolute bottom-3 right-3 btn-primary !px-3 !py-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleAdd}
          whileTap={{ scale: 0.9 }}
        >
          {adding ? '✓ Added' : '+ Cart'}
        </motion.button>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-sm text-gray-900 dark:text-white leading-tight line-clamp-2">{product.name}</h3>
        </div>
        <div className="flex items-center gap-1.5 mb-3">
          <StarRating rating={product.rating} />
          <span className="text-xs text-gray-400">({product.reviews.toLocaleString()})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg text-gray-900 dark:text-white">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <>
              <span className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
              <span className="text-xs text-green-600 font-semibold">{discount(product.originalPrice, product.price)}% off</span>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── HOME PAGE ───────────────────────────────────────────────────────────────

function HomePage() {
  const { addToCart } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [carouselIdx, setCarouselIdx] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setCarouselIdx(i => (i + 1) % 3), 4000);
    return () => clearInterval(t);
  }, []);

  const heroSlides = [
    {
      title: 'Curated for the',
      highlight: 'Discerning Few',
      subtitle: 'Premium electronics, fashion & lifestyle products — handpicked for those who value quality above all.',
      cta: 'Explore Collection',
      bg: 'from-primary-900/80 to-accent-900/60',
      img: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1200',
    },
    {
      title: 'Fashion Forward,',
      highlight: 'Always Ahead',
      subtitle: 'Discover the latest trends from global designers. Style that speaks before you do.',
      cta: 'Shop Fashion',
      bg: 'from-pink-900/80 to-purple-900/60',
      img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200',
    },
    {
      title: 'Technology That',
      highlight: 'Inspires',
      subtitle: 'Cutting-edge gadgets and electronics that seamlessly integrate into your life.',
      cta: 'Shop Electronics',
      bg: 'from-blue-900/80 to-cyan-900/60',
      img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200',
    },
  ];

  const featured = PRODUCTS.slice(0, 4);
  const trending = PRODUCTS.slice(4, 8);
  const newArrivals = PRODUCTS.filter(p => p.badge === 'New');

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {/* Hero Carousel */}
      <section className="relative h-[75vh] min-h-[500px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={carouselIdx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0"
          >
            <img
              src={heroSlides[carouselIdx].img}
              alt="Hero"
              className="w-full h-full object-cover"
            />
            <div className={`absolute inset-0 bg-gradient-to-r ${heroSlides[carouselIdx].bg}`} />
          </motion.div>
        </AnimatePresence>

        {/* Hero content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${carouselIdx}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-xl"
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-white text-xs font-medium mb-5">
                ✦ New Season Arrivals
              </div>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-4">
                {heroSlides[carouselIdx].title}<br />
                <span className="text-primary-300">{heroSlides[carouselIdx].highlight}</span>
              </h1>
              <p className="text-white/80 text-base sm:text-lg mb-8 max-w-md leading-relaxed">
                {heroSlides[carouselIdx].subtitle}
              </p>
              <div className="flex items-center gap-4">
                <motion.button
                  className="btn-primary ripple"
                  onClick={() => navigate('/products')}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {heroSlides[carouselIdx].cta} →
                </motion.button>
                <button
                  onClick={() => navigate('/products')}
                  className="text-white/80 hover:text-white text-sm font-medium border-b border-white/40 hover:border-white transition-colors"
                >
                  View All
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div className="absolute bottom-8 left-4 sm:left-8 lg:left-16 flex gap-2">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCarouselIdx(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === carouselIdx ? 'w-8 bg-white' : 'w-2 bg-white/40'}`}
              />
            ))}
          </div>
        </div>

        {/* Stats bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="grid grid-cols-3 divide-x divide-white/20">
              {[['50K+', 'Products'], ['2M+', 'Customers'], ['4.9★', 'Rating']].map(([val, label]) => (
                <div key={label} className="text-center px-4">
                  <div className="font-bold text-white text-sm sm:text-base">{val}</div>
                  <div className="text-white/60 text-xs">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Categories */}
        <section className="py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Find exactly what you're looking for</p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {CATEGORIES.map(cat => (
              <motion.div
                key={cat.id}
                variants={fadeUpItem}
                className="category-card"
                onClick={() => navigate(`/products?category=${cat.name}`)}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl shadow-md`}>
                  {cat.icon}
                </div>
                <div className="text-center">
                  <p className="font-semibold text-sm text-gray-800 dark:text-gray-100">{cat.name}</p>
                  <p className="text-xs text-gray-400">{cat.count} items</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Featured Products */}
        <section className="py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title">Featured Products</h2>
              <p className="section-subtitle text-base">Handpicked just for you</p>
            </div>
            <Link to="/products" className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline">
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {featured.map(p => <ProductCard key={p.id} product={p} />)}
            </motion.div>
          )}
        </section>

        {/* Promo Banner */}
        <section className="py-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600 p-8 sm:p-12"
          >
            <div className="absolute inset-0 bg-hero-pattern opacity-20" />
            <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <div className="badge bg-white/20 text-white mb-3">Limited Time Offer</div>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-2">
                  Up to 60% Off
                </h2>
                <p className="text-white/80 text-base max-w-md">
                  Shop the season's biggest sale. New deals added daily — don't miss out.
                </p>
              </div>
              <motion.button
                className="bg-white text-primary-700 font-bold px-8 py-4 rounded-2xl whitespace-nowrap shadow-lg"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate('/products')}
              >
                Shop Sale
              </motion.button>
            </div>
          </motion.div>
        </section>

        {/* Trending */}
        <section className="py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title">🔥 Trending Now</h2>
              <p className="section-subtitle text-base">What everyone's buying</p>
            </div>
            <Link to="/products" className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline">
              See more →
            </Link>
          </div>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {trending.map(p => <ProductCard key={p.id} product={p} />)}
          </motion.div>
        </section>

        {/* Trust badges */}
        <section className="py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🚀', title: 'Free Delivery', sub: 'On orders above ₹999' },
              { icon: '↩️', title: 'Easy Returns', sub: '30-day hassle-free returns' },
              { icon: '🔒', title: 'Secure Payment', sub: '100% protected transactions' },
              { icon: '💬', title: '24/7 Support', sub: 'We\'re always here for you' },
            ].map(({ icon, title, sub }) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center p-6 rounded-2xl bg-gray-50 dark:bg-dark-700 border border-gray-100 dark:border-dark-600"
              >
                <span className="text-3xl mb-3">{icon}</span>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{title}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">{sub}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  );
}

// ─── PRODUCTS PAGE ────────────────────────────────────────────────────────────

function ProductsPage() {
  const { addToCart, showToast } = useApp();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState({ category: '', minPrice: 0, maxPrice: 30000, rating: 0 });
  const [sort, setSort] = useState('popular');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('category') || '';
    setFilter(f => ({ ...f, category: cat }));
  }, [location.search]);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      setLoading(false);
      setProducts(PRODUCTS);
    }, 800);
    return () => clearTimeout(t);
  }, []);

  const filtered = products
    .filter(p => {
      if (filter.category && p.category !== filter.category) return false;
      if (p.price < filter.minPrice || p.price > filter.maxPrice) return false;
      if (p.rating < filter.rating) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === 'low-high') return a.price - b.price;
      if (sort === 'high-low') return b.price - a.price;
      if (sort === 'rating') return b.rating - a.rating;
      return b.reviews - a.reviews;
    });

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="section-title">All Products</h1>
          <p className="section-subtitle text-base">{filtered.length} products found</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-60 xl:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-dark-700 rounded-2xl p-5 shadow-card sticky top-20">
              <h3 className="font-bold text-gray-900 dark:text-white mb-5">Filters</h3>

              {/* Search */}
              <div className="mb-5">
                <label className="form-label">Search</label>
                <input
                  type="text"
                  placeholder="Search products..."
                  className="form-input text-sm"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>

              {/* Category */}
              <div className="mb-5">
                <label className="form-label">Category</label>
                <div className="space-y-1.5">
                  {['', ...CATEGORIES.map(c => c.name)].map(cat => (
                    <button
                      key={cat || 'all'}
                      onClick={() => setFilter(f => ({ ...f, category: cat }))}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                        filter.category === cat
                          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-medium'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-600'
                      }`}
                    >
                      {cat || 'All Categories'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-5">
                <label className="form-label">
                  Price Range
                  <span className="ml-2 text-primary-600 font-semibold">₹{filter.maxPrice.toLocaleString()}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="30000"
                  step="500"
                  value={filter.maxPrice}
                  onChange={e => setFilter(f => ({ ...f, maxPrice: +e.target.value }))}
                  className="w-full mt-2"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>₹0</span><span>₹30,000</span>
                </div>
              </div>

              {/* Rating */}
              <div className="mb-5">
                <label className="form-label">Min Rating</label>
                <div className="flex gap-1">
                  {[0, 3, 4, 4.5].map(r => (
                    <button
                      key={r}
                      onClick={() => setFilter(f => ({ ...f, rating: r }))}
                      className={`flex-1 py-1.5 text-xs rounded-lg border transition-colors ${
                        filter.rating === r
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600'
                          : 'border-gray-200 dark:border-dark-500 text-gray-500'
                      }`}
                    >
                      {r === 0 ? 'Any' : `${r}★`}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setFilter({ category: '', minPrice: 0, maxPrice: 30000, rating: 0 })}
                className="w-full py-2 text-sm text-gray-500 hover:text-red-500 border border-gray-200 dark:border-dark-500 rounded-xl transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Sort */}
            <div className="flex items-center justify-between mb-5">
              <span className="text-sm text-gray-500">{filtered.length} results</span>
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="form-input !w-auto text-sm"
              >
                <option value="popular">Most Popular</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">No products found</h3>
                <p className="text-gray-400 text-sm">Try adjusting your filters</p>
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                {filtered.map(p => <ProductCard key={p.id} product={p} />)}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── PRODUCT DETAIL PAGE ──────────────────────────────────────────────────────

function ProductDetailPage() {
  const { id } = { id: window.location.pathname.split('/').pop() };
  const product = PRODUCTS.find(p => p.id === +id) || PRODUCTS[0];
  const { addToCart, showToast } = useApp();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [adding, setAdding] = useState(false);
  const [tab, setTab] = useState('description');

  const imgs = [product.image, ...PRODUCTS.slice(0, 3).map(p => p.image)];
  const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAdd = () => {
    setAdding(true);
    for (let i = 0; i < qty; i++) addToCart(product);
    showToast(`${product.name} added to cart!`, 'success');
    setTimeout(() => setAdding(false), 1000);
  };

  const handleBuyNow = () => {
    handleAdd();
    navigate('/cart');
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link to="/" className="hover:text-primary-600">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary-600">Products</Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white truncate">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div>
            <motion.div
              className="relative overflow-hidden rounded-2xl bg-gray-50 dark:bg-dark-700 aspect-square mb-4"
              layoutId={`product-${product.id}`}
            >
              <motion.img
                key={activeImg}
                src={imgs[activeImg]}
                alt={product.name}
                className="w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              />
              {product.badge && (
                <span className={`absolute top-4 left-4 price-badge text-sm ${
                  product.badge === 'Sale' ? '!bg-red-500' :
                  product.badge === 'Hot' ? '!bg-accent-500' :
                  product.badge === 'New' ? '!bg-blue-500' : ''
                }`}>{product.badge}</span>
              )}
            </motion.div>
            <div className="flex gap-3">
              {imgs.slice(0, 4).map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`flex-1 aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    activeImg === i ? 'border-primary-500' : 'border-transparent opacity-60 hover:opacity-80'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <span className="text-sm text-primary-600 font-medium mb-2">{product.category}</span>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mb-5">
              <StarRating rating={product.rating} size="base" />
              <span className="font-semibold text-gray-900 dark:text-white">{product.rating}</span>
              <span className="text-gray-400 text-sm">({product.reviews.toLocaleString()} reviews)</span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-display text-4xl font-bold text-gray-900 dark:text-white">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                  <span className="badge bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    Save {discount(product.originalPrice, product.price)}%
                  </span>
                </>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-6">
              <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-green-500' : 'bg-amber-500'} animate-pulse`} />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {product.stock > 10 ? `In stock (${product.stock} available)` : `Only ${product.stock} left!`}
              </span>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <label className="form-label">Quantity</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-10 h-10 rounded-xl border border-gray-200 dark:border-dark-500 flex items-center justify-center text-lg hover:bg-gray-50 dark:hover:bg-dark-600 transition-colors font-bold"
                >
                  −
                </button>
                <span className="w-8 text-center font-semibold text-lg">{qty}</span>
                <button
                  onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                  className="w-10 h-10 rounded-xl border border-gray-200 dark:border-dark-500 flex items-center justify-center text-lg hover:bg-gray-50 dark:hover:bg-dark-600 transition-colors font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex gap-3 mb-8">
              <motion.button
                className="flex-1 btn-primary ripple text-base py-3.5"
                onClick={handleAdd}
                whileTap={{ scale: 0.97 }}
                disabled={adding}
              >
                {adding ? '✓ Added to Cart' : '🛒 Add to Cart'}
              </motion.button>
              <motion.button
                className="flex-1 btn-accent ripple text-base py-3.5"
                onClick={handleBuyNow}
                whileTap={{ scale: 0.97 }}
              >
                Buy Now
              </motion.button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {['Free Delivery', 'Easy Returns', '1 Year Warranty', 'Authentic Product'].map(f => (
                <div key={f} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="text-green-500">✓</span> {f}
                </div>
              ))}
            </div>

            {/* Share */}
            <div className="flex items-center gap-3 pt-5 border-t border-gray-100 dark:border-dark-600">
              <span className="text-sm text-gray-400">Share:</span>
              {['𝕏', 'f', '📱', '🔗'].map((icon, i) => (
                <button key={i} className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-dark-600 hover:bg-primary-100 dark:hover:bg-primary-900/30 flex items-center justify-center text-sm transition-colors">
                  {icon}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-12">
          <div className="flex gap-1 border-b border-gray-200 dark:border-dark-600 mb-6">
            {[['description', 'Description'], ['reviews', 'Reviews'], ['specs', 'Specifications']].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setTab(val)}
                className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  tab === val
                    ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {tab === 'description' && (
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base">{product.description}</p>
                  <ul className="mt-4 space-y-2">
                    {['Premium quality materials', 'Designed for longevity', 'Backed by our quality guarantee', '1-year manufacturer warranty'].map(f => (
                      <li key={f} className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <span className="text-primary-500">→</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {tab === 'reviews' && (
                <div className="space-y-4">
                  {[
                    { name: 'Arjun M.', rating: 5, date: 'Oct 2024', text: 'Absolutely love this product! Exceeded all my expectations. The build quality is exceptional.' },
                    { name: 'Priya K.', rating: 4, date: 'Sep 2024', text: 'Great product overall. Delivery was fast and packaging was excellent. Minor issue with setup but resolved quickly.' },
                    { name: 'Rohit S.', rating: 5, date: 'Sep 2024', text: 'Worth every rupee. Have been using it for 2 months now and it\'s still as good as day one.' },
                  ].map((r, i) => (
                    <div key={i} className="bg-gray-50 dark:bg-dark-700 rounded-2xl p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white text-sm font-bold">
                            {r.name[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-gray-900 dark:text-white">{r.name}</p>
                            <p className="text-xs text-gray-400">{r.date}</p>
                          </div>
                        </div>
                        <StarRating rating={r.rating} />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{r.text}</p>
                    </div>
                  ))}
                </div>
              )}
              {tab === 'specs' && (
                <div className="grid sm:grid-cols-2 gap-3">
                  {[['Brand', 'DSS Originals'], ['Model', `LS-${product.id}00X`], ['Category', product.category], ['Rating', `${product.rating}/5`], ['In Stock', `${product.stock} units`], ['Warranty', '12 months']].map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between py-3 px-4 bg-gray-50 dark:bg-dark-700 rounded-xl">
                      <span className="text-sm text-gray-500">{k}</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section>
            <h2 className="section-title mb-6">Related Products</h2>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </motion.div>
          </section>
        )}
      </div>
    </motion.div>
  );
}

// ─── CART PAGE ────────────────────────────────────────────────────────────────

function CartPage() {
  const { cart, updateQty, removeFromCart, showToast } = useApp();
  const navigate = useNavigate();

  const subtotal = cart.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const tax = Math.round(subtotal * 0.18);
  const delivery = subtotal > 999 ? 0 : 99;
  const total = subtotal + tax + delivery;

  if (cart.length === 0) {
    return (
      <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="text-8xl mb-6"
          >
            🛒
          </motion.div>
          <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-3">Your cart is empty</h2>
          <p className="text-gray-400 mb-8">Looks like you haven't added anything yet.</p>
          <button className="btn-primary" onClick={() => navigate('/products')}>
            Start Shopping
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="pt-16 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="section-title mb-8">Shopping Cart <span className="text-gray-400 font-sans text-2xl">({cart.length})</span></h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {cart.map(item => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  className="bg-white dark:bg-dark-700 rounded-2xl p-4 shadow-card flex gap-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
                    onClick={() => navigate(`/products/${item.id}`)}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight truncate">{item.name}</h3>
                      <button
                        onClick={() => { removeFromCart(item.id); showToast('Item removed', 'info'); }}
                        className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0 text-lg"
                      >
                        ×
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5 mb-3">{item.category}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQty(item.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-lg border border-gray-200 dark:border-dark-500 flex items-center justify-center text-sm hover:bg-gray-50 dark:hover:bg-dark-600 font-bold"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-lg border border-gray-200 dark:border-dark-500 flex items-center justify-center text-sm hover:bg-gray-50 dark:hover:bg-dark-600 font-bold"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-bold text-gray-900 dark:text-white">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-dark-700 rounded-2xl p-6 shadow-card sticky top-20">
              <h2 className="font-bold text-gray-900 dark:text-white text-lg mb-5">Order Summary</h2>
              <div className="space-y-3 mb-5">
                {[
                  ['Subtotal', subtotal],
                  ['Tax (18% GST)', tax],
                  ['Delivery', delivery],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {label === 'Delivery' && val === 0 ? <span className="text-green-500">FREE</span> : formatPrice(val)}
                    </span>
                  </div>
                ))}
                {delivery > 0 && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg">
                    Add ₹{(999 - subtotal).toLocaleString()} more for free delivery
                  </p>
                )}
              </div>
              <div className="border-t border-gray-100 dark:border-dark-600 pt-4 mb-5">
                <div className="flex justify-between font-bold text-lg">
                  <span className="text-gray-900 dark:text-white">Total</span>
                  <span className="gradient-text">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Promo */}
              <div className="flex gap-2 mb-5">
                <input type="text" placeholder="Promo code" className="form-input flex-1 text-sm" />
                <button className="btn-outline !px-4 !py-2.5 text-sm whitespace-nowrap">Apply</button>
              </div>

              <motion.button
                className="w-full btn-primary text-base py-3.5 ripple"
                onClick={() => navigate('/checkout')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Proceed to Checkout →
              </motion.button>
              <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
                <span>🔒</span> Secure 256-bit SSL encryption
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── CHECKOUT PAGE ────────────────────────────────────────────────────────────

function CheckoutPage() {
  const { cart, clearCart, showToast } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({ name: '', phone: '', line1: '', city: '', state: '', pincode: '' });
  const [payment, setPayment] = useState('card');
  const [cardNum, setCardNum] = useState('');
  const [placing, setPlacing] = useState(false);

  const total = cart.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const steps = ['Address', 'Payment', 'Confirm'];

  const handleOrder = () => {
    setPlacing(true);
    setTimeout(() => {
      clearCart();
      showToast('Order placed successfully! 🎉', 'success');
      setStep(4);
      setPlacing(false);
    }, 2000);
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="pt-16 min-h-screen bg-gray-50 dark:bg-dark-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="section-title mb-8 text-center">Checkout</h1>

        {step < 4 && (
          <div className="flex items-center mb-10">
            {steps.map((s, i) => (
              <React.Fragment key={s}>
                <div className="progress-step">
                  <div className={`progress-step-circle ${step > i + 1 ? 'completed' : step === i + 1 ? 'active' : 'pending'}`}>
                    {step > i + 1 ? '✓' : i + 1}
                  </div>
                  <span className={`text-xs font-medium ${step === i + 1 ? 'text-primary-600' : 'text-gray-400'}`}>{s}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`progress-line ${step > i + 1 ? 'completed' : 'pending'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              className="bg-white dark:bg-dark-700 rounded-2xl p-6 shadow-card">
              <h2 className="font-bold text-gray-900 dark:text-white text-xl mb-6">Delivery Address</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  ['name', 'Full Name', 'text'],
                  ['phone', 'Phone Number', 'tel'],
                  ['line1', 'Address Line', 'text'],
                  ['city', 'City', 'text'],
                  ['state', 'State', 'text'],
                  ['pincode', 'PIN Code', 'text'],
                ].map(([field, label, type]) => (
                  <div key={field} className={field === 'line1' ? 'sm:col-span-2' : ''}>
                    <label className="form-label">{label}</label>
                    <input
                      type={type}
                      placeholder={label}
                      className="form-input"
                      value={address[field]}
                      onChange={e => setAddress(a => ({ ...a, [field]: e.target.value }))}
                    />
                  </div>
                ))}
              </div>
              <button
                className="btn-primary w-full mt-6 py-3.5"
                onClick={() => setStep(2)}
                disabled={!address.name || !address.phone}
              >
                Continue to Payment →
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              className="bg-white dark:bg-dark-700 rounded-2xl p-6 shadow-card">
              <h2 className="font-bold text-gray-900 dark:text-white text-xl mb-6">Payment Method</h2>
              <div className="space-y-3 mb-6">
                {[['card', '💳 Credit / Debit Card'], ['upi', '📱 UPI'], ['netbanking', '🏦 Net Banking'], ['cod', '💵 Cash on Delivery']].map(([val, label]) => (
                  <label key={val} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    payment === val ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-dark-500'
                  }`}>
                    <input type="radio" name="payment" value={val} checked={payment === val} onChange={() => setPayment(val)} className="accent-primary-600" />
                    <span className="font-medium text-sm text-gray-900 dark:text-white">{label}</span>
                  </label>
                ))}
              </div>
              {payment === 'card' && (
                <div className="space-y-4 mb-6 p-4 bg-gray-50 dark:bg-dark-600 rounded-xl">
                  <div>
                    <label className="form-label">Card Number</label>
                    <input type="text" placeholder="1234 5678 9012 3456" className="form-input" maxLength={19}
                      value={cardNum} onChange={e => setCardNum(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Expiry</label>
                      <input type="text" placeholder="MM/YY" className="form-input" />
                    </div>
                    <div>
                      <label className="form-label">CVV</label>
                      <input type="password" placeholder="•••" className="form-input" maxLength={3} />
                    </div>
                  </div>
                </div>
              )}
              <div className="flex gap-3">
                <button className="btn-outline flex-1 py-3.5" onClick={() => setStep(1)}>← Back</button>
                <button className="btn-primary flex-1 py-3.5" onClick={() => setStep(3)}>Review Order →</button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              className="bg-white dark:bg-dark-700 rounded-2xl p-6 shadow-card">
              <h2 className="font-bold text-gray-900 dark:text-white text-xl mb-6">Review & Confirm</h2>
              <div className="space-y-3 mb-5">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center gap-3 py-3 border-b border-gray-100 dark:border-dark-600 last:border-0">
                    <img src={item.image} alt="" className="w-12 h-12 rounded-xl object-cover" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.name}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-sm">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="bg-gray-50 dark:bg-dark-600 rounded-xl p-4 mb-5 space-y-2">
                {[['Subtotal', total], ['Tax (18%)', Math.round(total * 0.18)], ['Delivery', total > 999 ? 0 : 99]].map(([l, v]) => (
                  <div key={l} className="flex justify-between text-sm">
                    <span className="text-gray-500">{l}</span>
                    <span>{v === 0 ? 'FREE' : formatPrice(v)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold border-t border-gray-200 dark:border-dark-500 pt-2 mt-2">
                  <span>Total</span>
                  <span className="gradient-text">{formatPrice(total + Math.round(total * 0.18))}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="btn-outline flex-1 py-3.5" onClick={() => setStep(2)}>← Back</button>
                <motion.button
                  className="btn-primary flex-1 py-3.5 ripple"
                  onClick={handleOrder}
                  whileTap={{ scale: 0.97 }}
                  disabled={placing}
                >
                  {placing ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Placing Order...
                    </span>
                  ) : '🔒 Place Order'}
                </motion.button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="success" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-dark-700 rounded-2xl p-10 shadow-card text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-5xl mx-auto mb-6"
              >
                ✅
              </motion.div>
              <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-3">Order Placed!</h2>
              <p className="text-gray-500 mb-2">Your order has been confirmed successfully.</p>
              <p className="text-primary-600 font-semibold mb-8">ORD-2024-{Math.floor(Math.random() * 900 + 100)}</p>
              <div className="flex gap-3 justify-center">
                <button className="btn-outline" onClick={() => navigate('/dashboard')}>My Orders</button>
                <button className="btn-primary" onClick={() => navigate('/')}>Continue Shopping</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── AUTH PAGES ───────────────────────────────────────────────────────────────

function LoginPage() {
  const { setUser, showToast } = useApp();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = () => {
    // Validation
    if (!form.email) {
      showToast('Please enter an email address', 'error');
      return;
    }
    if (!form.password) {
      showToast('Please enter a password', 'error');
      return;
    }
    if (mode === 'signup' && !form.name) {
      showToast('Please enter your full name', 'error');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      let userName = form.name;
      
      // On login, try to retrieve saved name from localStorage for this email
      if (mode === 'login') {
        try {
          const savedUser = localStorage.getItem('user');
          if (savedUser) {
            const parsed = JSON.parse(savedUser);
            if (parsed.email === form.email) {
              userName = parsed.name; // Use previously saved name
            }
          }
        } catch (e) {
          // Ignore errors
        }
      }

      const user = {
        name: userName,
        email: form.email,
        role: form.email === 'admin@dssshop.com' ? 'ADMIN' : 'USER',
      };
      setUser(user);
      showToast(`${mode === 'signup' ? 'Welcome to DSS Shop' : 'Welcome back'}, ${user.name.split(' ')[0]}! 👋`, 'success');
      navigate('/');
      setLoading(false);
    }, 1200);
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"
      className="pt-16 min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 px-4">
      <div className="w-full max-w-md">
        <motion.div
          className="bg-white dark:bg-dark-700 rounded-3xl shadow-card-hover p-8"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-4 shadow-glow">
              <span className="text-white font-display font-bold text-2xl">L</span>
            </div>
            <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
              {mode === 'login' ? 'Welcome back' : 'Create account'}
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {mode === 'login' ? 'Sign in to your DSS Shop account' : 'Join the DSS Shop community'}
            </p>
          </div>

          {/* Social auth */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {['🔵 Google', '⬛ Apple'].map(p => (
              <button key={p} className="flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-200 dark:border-dark-500 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-600 transition-colors">
                {p}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-200 dark:bg-dark-500" />
            <span className="text-xs text-gray-400">or continue with email</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-dark-500" />
          </div>

          <div className="space-y-4 mb-6">
            {mode === 'signup' && (
              <div>
                <label className="form-label">Full Name</label>
                <input type="text" placeholder="Arjun Sharma" className="form-input"
                  value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
            )}
            <div>
              <label className="form-label">Email</label>
              <input type="email" placeholder="you@example.com" className="form-input"
                value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              {mode === 'login' && <p className="text-xs text-gray-400 mt-1">Tip: Use admin@dssshop.com for admin access</p>}
            </div>
            <div>
              <label className="form-label">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} placeholder="••••••••" className="form-input pr-10"
                  value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
                <button onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
          </div>

          {mode === 'login' && (
            <div className="flex justify-end mb-4">
              <button className="text-xs text-primary-600 hover:underline">Forgot password?</button>
            </div>
          )}

          <motion.button
            className="w-full btn-primary py-3.5 text-base ripple"
            onClick={handleSubmit}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                {mode === 'login' ? 'Signing in...' : 'Creating account...'}
              </span>
            ) : mode === 'login' ? 'Sign in' : 'Create Account'}
          </motion.button>

          <p className="text-center text-sm text-gray-500 mt-5">
            {mode === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
            <button onClick={() => setMode(m => m === 'login' ? 'signup' : 'login')}
              className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── USER DASHBOARD ───────────────────────────────────────────────────────────

function DashboardPage() {
  const { user, showToast } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');

  if (!user) {
    navigate('/login');
    return null;
  }

  const tabs = [
    { id: 'orders', label: 'Orders', icon: '📦' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'wishlist', label: 'Wishlist', icon: '❤️' },
    { id: 'addresses', label: 'Addresses', icon: '📍' },
  ];

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="pt-16 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white text-2xl font-bold">
            {user.name[0]}
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
            <p className="text-gray-400 text-sm">{user.email}</p>
            <span className={`badge mt-1 ${user.role === 'ADMIN' ? 'bg-accent-100 text-accent-700' : 'bg-primary-100 text-primary-700'}`}>
              {user.role}
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white dark:bg-dark-700 rounded-2xl p-3 shadow-card">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`admin-sidebar-link w-full text-left ${activeTab === tab.id ? 'active' : ''}`}
                >
                  <span>{tab.icon}</span> {tab.label}
                </button>
              ))}
              {user.role === 'ADMIN' && (
                <button
                  onClick={() => navigate('/admin')}
                  className="admin-sidebar-link w-full text-left text-accent-600 dark:text-accent-400"
                >
                  <span>⚙️</span> Admin Panel
                </button>
              )}
            </div>
          </aside>

          {/* Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === 'orders' && (
                  <div className="space-y-4">
                    <h2 className="font-bold text-gray-900 dark:text-white text-xl mb-4">Order History</h2>
                    {ORDERS.map(order => (
                      <div key={order.id} className="bg-white dark:bg-dark-700 rounded-2xl p-5 shadow-card">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{order.id}</p>
                            <p className="text-sm text-gray-400">{order.date} · {order.items} item{order.items > 1 ? 's' : ''}</p>
                          </div>
                          <div className="text-right">
                            <span className={`badge ${
                              order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                              order.status === 'In Transit' ? 'bg-blue-100 text-blue-700' :
                              order.status === 'Processing' ? 'bg-amber-100 text-amber-700' :
                              'bg-gray-100 text-gray-600'
                            }`}>{order.status}</span>
                            <p className="font-bold text-gray-900 dark:text-white mt-1">{formatPrice(order.total)}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="text-xs text-primary-600 hover:underline">Track Order</button>
                          <span className="text-gray-300">·</span>
                          <button className="text-xs text-primary-600 hover:underline">View Details</button>
                          {order.status === 'Delivered' && (
                            <>
                              <span className="text-gray-300">·</span>
                              <button className="text-xs text-primary-600 hover:underline">Return</button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'profile' && (
                  <div className="bg-white dark:bg-dark-700 rounded-2xl p-6 shadow-card">
                    <h2 className="font-bold text-gray-900 dark:text-white text-xl mb-6">Profile Settings</h2>
                    <div className="grid sm:grid-cols-2 gap-4 mb-6">
                      {[['Full Name', user.name], ['Email', user.email], ['Phone', '+91 98765 43210'], ['Location', 'Mumbai, Maharashtra']].map(([label, val]) => (
                        <div key={label}>
                          <label className="form-label">{label}</label>
                          <input type="text" defaultValue={val} className="form-input" />
                        </div>
                      ))}
                    </div>
                    <button className="btn-primary" onClick={() => showToast('Profile updated!', 'success')}>
                      Save Changes
                    </button>
                  </div>
                )}

                {activeTab === 'wishlist' && (
                  <div>
                    <h2 className="font-bold text-gray-900 dark:text-white text-xl mb-4">Wishlist</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {PRODUCTS.slice(0, 4).map(p => (
                        <div key={p.id} className="bg-white dark:bg-dark-700 rounded-2xl p-3 shadow-card flex gap-3">
                          <img src={p.image} alt="" className="w-16 h-16 rounded-xl object-cover" />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{p.name}</p>
                            <p className="text-sm font-bold text-primary-600 mt-0.5">{formatPrice(p.price)}</p>
                            <button className="text-xs text-primary-600 hover:underline mt-1">Add to Cart</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'addresses' && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="font-bold text-gray-900 dark:text-white text-xl">Saved Addresses</h2>
                      <button className="btn-outline !px-4 !py-2 text-sm">+ Add New</button>
                    </div>
                    {[
                      { label: 'Home', addr: '12, Marine Lines, South Mumbai, Maharashtra 400001', default: true },
                      { label: 'Office', addr: 'Plot 45, Bandra Kurla Complex, Mumbai, Maharashtra 400051', default: false },
                    ].map(a => (
                      <div key={a.label} className="bg-white dark:bg-dark-700 rounded-2xl p-5 shadow-card mb-3">
                        <div className="flex justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900 dark:text-white">{a.label}</span>
                            {a.default && <span className="badge bg-primary-100 text-primary-700">Default</span>}
                          </div>
                          <button className="text-xs text-primary-600 hover:underline">Edit</button>
                        </div>
                        <p className="text-sm text-gray-500">{a.addr}</p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────

function AdminPage() {
  const { user } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState(PRODUCTS);

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="font-bold text-xl text-gray-900 dark:text-white mb-2">Access Denied</h2>
          <p className="text-gray-400 mb-4">You need admin privileges to view this page.</p>
          <button className="btn-primary" onClick={() => navigate('/login')}>Login as Admin</button>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Revenue', value: '₹24,68,430', change: '+12.5%', up: true, icon: '💰' },
    { label: 'Orders Today', value: '347', change: '+8.2%', up: true, icon: '📦' },
    { label: 'Active Users', value: '12,847', change: '+5.1%', up: true, icon: '👥' },
    { label: 'Return Rate', value: '2.3%', change: '-0.5%', up: true, icon: '↩️' },
  ];

  const navItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'products', label: 'Products', icon: '🏷️' },
    { id: 'orders', label: 'Orders', icon: '📦' },
    { id: 'users', label: 'Users', icon: '👥' },
  ];

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="pt-16 min-h-screen bg-gray-50 dark:bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <span className="badge bg-accent-100 text-accent-700 dark:bg-accent-900/30 dark:text-accent-400">Administrator</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-56 flex-shrink-0">
            <div className="bg-white dark:bg-dark-700 rounded-2xl p-3 shadow-card">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`admin-sidebar-link w-full text-left ${activeTab === item.id ? 'active' : ''}`}
                >
                  <span>{item.icon}</span> {item.label}
                </button>
              ))}
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

                {activeTab === 'overview' && (
                  <div>
                    {/* Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      {stats.map(s => (
                        <div key={s.label} className="bg-white dark:bg-dark-700 rounded-2xl p-5 shadow-card">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-2xl">{s.icon}</span>
                            <span className={`badge text-xs ${s.up ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{s.change}</span>
                          </div>
                          <p className="font-bold text-xl text-gray-900 dark:text-white">{s.value}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                        </div>
                      ))}
                    </div>

                    {/* Charts Placeholder */}
                    <div className="grid lg:grid-cols-2 gap-5">
                      <div className="bg-white dark:bg-dark-700 rounded-2xl p-5 shadow-card">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Revenue Overview</h3>
                        <div className="space-y-3">
                          {[['Jan', 68], ['Feb', 75], ['Mar', 82], ['Apr', 71], ['May', 90], ['Jun', 95]].map(([month, pct]) => (
                            <div key={month} className="flex items-center gap-3">
                              <span className="w-8 text-xs text-gray-400">{month}</span>
                              <div className="flex-1 bg-gray-100 dark:bg-dark-600 rounded-full h-2">
                                <motion.div
                                  className="h-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${pct}%` }}
                                  transition={{ delay: 0.1, duration: 0.8 }}
                                />
                              </div>
                              <span className="text-xs font-medium w-8 text-gray-700 dark:text-gray-300">{pct}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-white dark:bg-dark-700 rounded-2xl p-5 shadow-card">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Top Categories</h3>
                        <div className="space-y-4">
                          {[['Electronics', 42, 'from-blue-500 to-cyan-500'], ['Fashion', 28, 'from-pink-500 to-rose-500'], ['Home', 18, 'from-amber-500 to-orange-500'], ['Beauty', 12, 'from-purple-500 to-violet-500']].map(([cat, pct, grad]) => (
                            <div key={cat} className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${grad}`} />
                              <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{cat}</span>
                              <span className="text-xs font-bold text-gray-900 dark:text-white">{pct}%</span>
                              <div className="w-24 bg-gray-100 dark:bg-dark-600 rounded-full h-1.5">
                                <motion.div
                                  className={`h-1.5 rounded-full bg-gradient-to-r ${grad}`}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${pct}%` }}
                                  transition={{ delay: 0.2, duration: 0.8 }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'products' && (
                  <div>
                    <div className="flex justify-between items-center mb-5">
                      <h2 className="font-bold text-gray-900 dark:text-white text-xl">Products ({products.length})</h2>
                      <button className="btn-primary !px-4 !py-2 text-sm">+ Add Product</button>
                    </div>
                    <div className="bg-white dark:bg-dark-700 rounded-2xl shadow-card overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50 dark:bg-dark-600">
                            <tr>
                              {['Product', 'Category', 'Price', 'Stock', 'Rating', 'Actions'].map(h => (
                                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50 dark:divide-dark-600">
                            {products.slice(0, 8).map(p => (
                              <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-dark-600 transition-colors">
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-3">
                                    <img src={p.image} alt="" className="w-9 h-9 rounded-lg object-cover" />
                                    <span className="font-medium text-gray-900 dark:text-white truncate max-w-[150px]">{p.name}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-gray-500">{p.category}</td>
                                <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{formatPrice(p.price)}</td>
                                <td className="px-4 py-3">
                                  <span className={`badge ${p.stock > 20 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                    {p.stock}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">★ {p.rating}</td>
                                <td className="px-4 py-3">
                                  <div className="flex gap-2">
                                    <button className="text-xs text-blue-600 hover:underline">Edit</button>
                                    <button
                                      className="text-xs text-red-500 hover:underline"
                                      onClick={() => setProducts(pp => pp.filter(x => x.id !== p.id))}
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'orders' && (
                  <div>
                    <h2 className="font-bold text-gray-900 dark:text-white text-xl mb-5">All Orders</h2>
                    <div className="space-y-3">
                      {[...ORDERS, ...ORDERS].slice(0, 6).map((order, i) => (
                        <div key={`${order.id}-${i}`} className="bg-white dark:bg-dark-700 rounded-xl p-4 shadow-card flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-lg">📦</div>
                            <div>
                              <p className="font-semibold text-sm text-gray-900 dark:text-white">{order.id}-{i}</p>
                              <p className="text-xs text-gray-400">{order.date} · Customer #{Math.floor(Math.random() * 9000 + 1000)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={`badge ${
                              order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                              order.status === 'In Transit' ? 'bg-blue-100 text-blue-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>{order.status}</span>
                            <span className="font-bold text-sm">{formatPrice(order.total)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'users' && (
                  <div>
                    <h2 className="font-bold text-gray-900 dark:text-white text-xl mb-5">Users</h2>
                    <div className="bg-white dark:bg-dark-700 rounded-2xl shadow-card overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-dark-600">
                          <tr>
                            {['User', 'Email', 'Role', 'Orders', 'Joined', 'Action'].map(h => (
                              <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-dark-600">
                          {[
                            { name: 'Arjun Sharma', email: 'arjun@example.com', role: 'USER', orders: 12, joined: 'Jan 2024' },
                            { name: 'Priya Kapoor', email: 'priya@example.com', role: 'USER', orders: 7, joined: 'Mar 2024' },
                            { name: 'Admin User', email: 'admin@dssshop.com', role: 'ADMIN', orders: 0, joined: 'Dec 2023' },
                            { name: 'Rohit Singh', email: 'rohit@example.com', role: 'USER', orders: 23, joined: 'Feb 2024' },
                          ].map(u => (
                            <tr key={u.email} className="hover:bg-gray-50 dark:hover:bg-dark-600 transition-colors">
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white text-xs font-bold">
                                    {u.name[0]}
                                  </div>
                                  <span className="font-medium text-gray-900 dark:text-white">{u.name}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-gray-500 text-xs">{u.email}</td>
                              <td className="px-4 py-3">
                                <span className={`badge ${u.role === 'ADMIN' ? 'bg-accent-100 text-accent-700' : 'bg-gray-100 text-gray-700'}`}>{u.role}</span>
                              </td>
                              <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{u.orders}</td>
                              <td className="px-4 py-3 text-gray-400 text-xs">{u.joined}</td>
                              <td className="px-4 py-3">
                                <button className="text-xs text-red-500 hover:underline">Suspend</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── APP SHELL ────────────────────────────────────────────────────────────────

function AppContent() {
  const location = useLocation();
  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved === 'true') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback((product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id) => {
    setCart(prev => prev.filter(i => i.id !== id));
  }, []);

  const updateQty = useCallback((id, qty) => {
    if (qty < 1) { removeFromCart(id); return; }
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
  }, [removeFromCart]);

  const clearCart = useCallback(() => setCart([]), []);

  const showToast = useCallback((message, type = 'default') => {
    const id = Date.now();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(t => t.filter(x => x.id !== id));
  }, []);

  return (
    <AppContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, user, setUser, showToast }}>
      <Router>
        <div className="min-h-screen">
          <Navbar darkMode={darkMode} toggleDark={() => setDarkMode(d => !d)} />
          <main className="pt-0">
            <AppContent />
          </main>
          <Toast toasts={toasts} removeToast={removeToast} />
        </div>
      </Router>
    </AppContext.Provider>
  );
}
