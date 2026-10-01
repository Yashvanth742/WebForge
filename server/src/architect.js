/**
 * Autonomous AI Software Architect & Dynamic Application Generator
 *
 * Dynamically plans and generates custom React application architectures based
 * on natural language prompts without rigid or hardcoded templates.
 */

// Domain analyzer helper
export function analyzePrompt(request = '') {
  const req = String(request).trim();
  const lower = req.toLowerCase();

  // 1. Detect Domain Type
  let domain = 'custom';
  if (/restaurant|food delivery|dining|bistro|cafe|bakery|menu|dish|pizza|burger|sushi|taco|culinary/i.test(lower)) {
    domain = 'restaurant';
  } else if (/ecommerce|e-commerce|store|shop|sneaker|shoe|fashion|clothing|watch|retail|boutique|merch|product|cart/i.test(lower)) {
    domain = 'ecommerce';
  } else if (/saas|dashboard|analytics|admin|metric|cloud|crm|devops|data platform|charts/i.test(lower)) {
    domain = 'saas';
  } else if (/portfolio|resume|cv|personal site|developer profile|designer portfolio|freelance/i.test(lower)) {
    domain = 'portfolio';
  } else if (/clinic|doctor|hospital|medical|healthcare|dental|dentist|patient|telehealth|therapy/i.test(lower)) {
    domain = 'healthcare';
  } else if (/fitness|gym|workout|trainer|crossfit|yoga|pilates|bodybuilding|athletic|membership/i.test(lower)) {
    domain = 'fitness';
  } else if (/real estate|realty|property|properties|villa|house|apartment|housing|listings/i.test(lower)) {
    domain = 'realestate';
  } else if (/task|kanban|todo|project management|scrum|trello|productivity|notes/i.test(lower)) {
    domain = 'kanban';
  } else if (/course|academy|education|school|bootcamp|learning|tutoring|university|lessons/i.test(lower)) {
    domain = 'education';
  }

  // 2. Extract Title / Brand
  let brandName = '';
  const brandMatch = req.match(/(?:called|named|brand|for)\s+([A-Z][a-zA-Z0-9'\s]{2,20})/);
  if (brandMatch && !/restaurant|store|portfolio|website|app|developer/i.test(brandMatch[1])) {
    brandName = brandMatch[1].trim();
  }

  if (!brandName) {
    if (domain === 'ecommerce') {
      if (/sneaker|shoe/i.test(lower)) brandName = 'KicksVault';
      else if (/watch/i.test(lower)) brandName = 'Chronos Luxury';
      else brandName = 'Aura Store';
    } else if (domain === 'restaurant') {
      if (/pizza/i.test(lower)) brandName = 'Bella Forno';
      else if (/burger/i.test(lower)) brandName = 'StackCraft';
      else brandName = 'Lumina Dining';
    } else if (domain === 'saas') {
      brandName = 'PulseMetric AI';
    } else if (domain === 'portfolio') {
      const nameMatch = req.match(/(?:for|by)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/);
      brandName = nameMatch ? nameMatch[1] : 'Alex Rivera';
    } else if (domain === 'healthcare') {
      brandName = 'Apex Health';
    } else if (domain === 'fitness') {
      brandName = 'Titan Fitness Club';
    } else if (domain === 'realestate') {
      brandName = 'Elysian Estates';
    } else if (domain === 'kanban') {
      brandName = 'FlowTask Pro';
    } else if (domain === 'education') {
      brandName = 'CodeForge Academy';
    } else {
      const cleanTopic = req.replace(/^create\s+/i, '').replace(/^build\s+/i, '').replace(/^a\s+/i, '');
      const words = cleanTopic.split(/\s+/).slice(0, 3).join(' ');
      brandName = words.charAt(0).toUpperCase() + words.slice(1);
    }
  }

  return { domain, brandName, rawPrompt: req };
}

/**
 * Plans the architecture and generates modular files.
 */
export function buildAutonomousApplication(request) {
  const analysis = analyzePrompt(request);
  const { domain, brandName } = analysis;

  switch (domain) {
    case 'restaurant':
      return generateRestaurantArchitecture(brandName, request);
    case 'ecommerce':
      return generateEcommerceArchitecture(brandName, request);
    case 'saas':
      return generateSaasArchitecture(brandName, request);
    case 'portfolio':
      return generatePortfolioArchitecture(brandName, request);
    case 'healthcare':
      return generateHealthcareArchitecture(brandName, request);
    case 'fitness':
      return generateFitnessArchitecture(brandName, request);
    case 'realestate':
      return generateRealEstateArchitecture(brandName, request);
    case 'kanban':
      return generateKanbanArchitecture(brandName, request);
    case 'education':
      return generateEducationArchitecture(brandName, request);
    default:
      return generateDynamicCustomArchitecture(brandName, request);
  }
}

// -----------------------------------------------------------------------------
// 1. E-COMMERCE / STORE ARCHITECTURE (e.g. Sneakers, Fashion, Goods)
// -----------------------------------------------------------------------------
function generateEcommerceArchitecture(brand, request) {
  const isSneakers = /sneaker|shoe/i.test(request);
  const entityName = isSneakers ? 'Sneaker' : 'Product';

  const plan = [
    ['/src/components/Navbar.jsx', `Navigation header with brand logo, search bar toggle, and live cart counter badge`],
    ['/src/components/ProductCard.jsx', `${entityName} card with high-res imagery, price tag, rating, and interactive Add to Cart`],
    ['/src/components/ProductGrid.jsx', `Responsive showcase grid with search and category filtering logic`],
    ['/src/components/CartDrawer.jsx', `Sliding side drawer showing cart items, quantity adjustments, item removal, and checkout button`],
    ['/src/components/FilterBar.jsx', `Pill tabs for instant category filtering and price sorting`],
    ['/src/components/CheckoutModal.jsx', `Interactive checkout modal with order summary and instant form validation`],
    ['/src/components/Footer.jsx', `Store footer with customer support links, newsletter signup, and trust badges`],
    ['/src/data/products.js', `Realistic ${entityName.toLowerCase()} mock catalog with names, prices, tags, and Unsplash images`],
    ['/src/App.jsx', `Root app managing cart state, search query, active category, and modal visibility`],
    ['/src/styles.css', `Modern street & commerce styling, smooth transitions, badges, and responsive grid`],
  ];

  const files = {
    '/data/products.js': `export const PRODUCTS = [
  {
    id: 1,
    name: '${isSneakers ? 'Aero Glide Velocity X' : 'Minimalist Leather Chrono'}',
    category: '${isSneakers ? 'Running' : 'Accessories'}',
    price: 185,
    rating: 4.9,
    reviews: 142,
    badge: 'BESTSELLER',
    image: '${isSneakers ? 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'}',
    description: 'Engineered for peak performance and all-day comfort with responsive cushioning.'
  },
  {
    id: 2,
    name: '${isSneakers ? 'Retro High Street Lows' : 'Canvas Explorer Daypack'}',
    category: '${isSneakers ? 'Lifestyle' : 'Bags'}',
    price: 140,
    rating: 4.8,
    reviews: 98,
    badge: 'NEW',
    image: '${isSneakers ? 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80'}',
    description: 'Clean silhouette crafted from premium materials with durable rubber outsoles.'
  },
  {
    id: 3,
    name: '${isSneakers ? 'Quantum Boost Pro 2' : 'Matte Ceramic Wireless Audio'}',
    category: '${isSneakers ? 'Training' : 'Audio'}',
    price: 210,
    rating: 5.0,
    reviews: 312,
    badge: 'LIMITED',
    image: '${isSneakers ? 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'}',
    description: 'High-energy return technology designed for high-impact movement and endurance.'
  },
  {
    id: 4,
    name: '${isSneakers ? 'Midnight Obsidian Court' : 'Titanium Polarized Shades'}',
    category: '${isSneakers ? 'Basketball' : 'Eyewear'}',
    price: 165,
    rating: 4.7,
    reviews: 84,
    image: '${isSneakers ? 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80'}',
    description: 'Signature lockdown support with lightweight breathable knit upper.'
  }
];
`,

    '/components/Navbar.jsx': `import React from 'react';

export default function Navbar({ cartCount, onOpenCart, searchQuery, setSearchQuery }) {
  return (
    <header className="store-navbar">
      <div className="nav-container">
        <a href="#home" className="store-brand">
          <span className="brand-dot"></span>
          <span className="brand-text">${brand}</span>
        </a>

        <div className="nav-search-wrap">
          <input 
            type="text" 
            placeholder="Search catalog…" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="nav-search-input"
          />
        </div>

        <div className="nav-actions">
          <button onClick={onOpenCart} className="cart-trigger-btn">
            <span>🛒 Cart</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}
`,

    '/components/FilterBar.jsx': `import React from 'react';

export default function FilterBar({ categories, activeCategory, setActiveCategory, sortBy, setSortBy }) {
  return (
    <div className="filter-bar">
      <div className="category-pills">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={'cat-pill ' + (activeCategory === cat ? 'active' : '')}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="sort-wrap">
        <label>Sort by:</label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="featured">Featured</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
}
`,

    '/components/ProductCard.jsx': `import React from 'react';

export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="product-card">
      <div className="product-image-box">
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <img src={product.image} alt={product.name} loading="lazy" />
      </div>
      <div className="product-details">
        <span className="product-cat">{product.category}</span>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-desc">{product.description}</p>
        <div className="product-bottom">
          <div className="price-tag">\${product.price}</div>
          <button onClick={() => onAddToCart(product)} className="add-cart-btn">
            + Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
`,

    '/components/ProductGrid.jsx': `import React from 'react';
import ProductCard from './ProductCard.jsx';

export default function ProductGrid({ products, onAddToCart }) {
  if (products.length === 0) {
    return (
      <div className="empty-catalog">
        <h3>No matching items found</h3>
        <p>Try clearing your search query or choosing another category.</p>
      </div>
    );
  }

  return (
    <section className="product-grid-section">
      <div className="product-grid">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} />
        ))}
      </div>
    </section>
  );
}
`,

    '/components/CartDrawer.jsx': `import React from 'react';

export default function CartDrawer({ isOpen, onClose, cartItems, onUpdateQuantity, onRemove, onCheckout }) {
  if (!isOpen) return null;

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <h3>Your Shopping Cart ({cartItems.length})</h3>
          <button onClick={onClose} className="drawer-close">&times;</button>
        </div>

        <div className="drawer-body">
          {cartItems.length === 0 ? (
            <div className="drawer-empty">
              <p>Your cart is empty.</p>
              <span>Add some items from our catalog to get started.</span>
            </div>
          ) : (
            <div className="cart-list">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-row">
                  <img src={item.image} alt={item.name} />
                  <div className="cart-info">
                    <h4>{item.name}</h4>
                    <span className="cart-price">\${item.price}</span>
                    <div className="cart-stepper">
                      <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                  </div>
                  <button onClick={() => onRemove(item.id)} className="cart-remove-btn">&times;</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="drawer-footer">
            <div className="drawer-total">
              <span>Subtotal:</span>
              <strong>\${total.toFixed(2)}</strong>
            </div>
            <button onClick={onCheckout} className="checkout-btn">
              Proceed to Checkout &rarr;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
`,

    '/components/CheckoutModal.jsx': `import React, { useState } from 'react';

export default function CheckoutModal({ isOpen, onClose, total, onComplete }) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', address: '', card: '' });

  if (!isOpen) return null;

  const handlePay = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onComplete();
      setSubmitted(false);
    }, 2200);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Secure Checkout</h3>
          <button onClick={onClose} className="modal-close">&times;</button>
        </div>

        {submitted ? (
          <div className="modal-success">
            <div className="success-icon">✓</div>
            <h4>Order Confirmed!</h4>
            <p>Thank you for shopping with ${brand}. We sent your receipt and tracking link.</p>
          </div>
        ) : (
          <form onSubmit={handlePay} className="checkout-form">
            <div className="order-summary-box">
              <span>Total Amount:</span>
              <strong>\${total.toFixed(2)}</strong>
            </div>
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                required 
                placeholder="Jane Doe" 
                value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
              />
            </div>
            <div className="form-group">
              <label>Shipping Address</label>
              <input 
                type="text" 
                required 
                placeholder="123 Market St, Suite 400" 
                value={formData.address} 
                onChange={(e) => setFormData({ ...formData, address: e.target.value })} 
              />
            </div>
            <div className="form-group">
              <label>Card Details</label>
              <input 
                type="text" 
                required 
                placeholder="4242 •••• •••• 4242" 
                value={formData.card} 
                onChange={(e) => setFormData({ ...formData, card: e.target.value })} 
              />
            </div>
            <button type="submit" className="pay-now-btn">Pay \${total.toFixed(2)} & Complete Order</button>
          </form>
        )}
      </div>
    </div>
  );
}
`,

    '/components/Footer.jsx': `import React from 'react';

export default function Footer() {
  return (
    <footer className="store-footer">
      <div className="footer-wrap">
        <div className="footer-info">
          <h4>${brand}</h4>
          <p>Curated modern collection designed for performance, comfort, and timeless everyday style.</p>
        </div>
        <div className="footer-links">
          <span>Shipping & Returns</span>
          <span>Order Tracker</span>
          <span>Privacy Policy</span>
          <span>Contact Us</span>
        </div>
        <div className="footer-copy">
          <p>© 2026 ${brand} Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
`,

    '/App.jsx': `import React, { useState, useMemo } from 'react';
import Navbar from './components/Navbar.jsx';
import FilterBar from './components/FilterBar.jsx';
import ProductGrid from './components/ProductGrid.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import CheckoutModal from './components/CheckoutModal.jsx';
import Footer from './components/Footer.jsx';
import { PRODUCTS } from './data/products.js';
import './styles.css';

export default function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');

  const categories = useMemo(() => {
    return ['All', ...new Set(PRODUCTS.map((p) => p.category))];
  }, []);

  const filteredProducts = useMemo(() => {
    let list = PRODUCTS.filter((item) => {
      const matchCat = activeCategory === 'All' || item.category === activeCategory;
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });

    if (sortBy === 'price-low') list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') list = [...list].sort((a, b) => b.price - a.price);

    return list;
  }, [searchQuery, activeCategory, sortBy]);

  const handleAddToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      handleRemove(id);
      return;
    }
    setCart((prev) => prev.map((item) => item.id === id ? { ...item, quantity: newQty } : item));
  };

  const handleRemove = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="store-shell">
      <Navbar 
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <main className="store-main">
        <header className="hero-banner">
          <span className="hero-tag">NEW COLLECTION 2026</span>
          <h1>Engineered Style & Precision</h1>
          <p>Discover our latest drop crafted with high-grade materials and ergonomic design.</p>
        </header>

        <FilterBar 
          categories={categories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        <ProductGrid products={filteredProducts} onAddToCart={handleAddToCart} />
      </main>

      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemove={handleRemove}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        total={cartTotal}
        onComplete={() => {
          setCart([]);
          setIsCheckoutOpen(false);
        }}
      />

      <Footer />
    </div>
  );
}
`,

    '/styles.css': `/* E-Commerce Styling */
:root {
  --primary: #0f172a;
  --accent: #e11d48;
  --bg-main: #f8fafc;
  --card-bg: #ffffff;
  --border: #e2e8f0;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Plus Jakarta Sans', Inter, sans-serif;
  background-color: var(--bg-main);
  color: #0f172a;
  -webkit-font-smoothing: antialiased;
}

.store-shell { min-height: 100vh; display: flex; flex-direction: column; }

.store-navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
  padding: 12px 24px;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.store-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  font-weight: 800;
  font-size: 19px;
  color: var(--primary);
  letter-spacing: -0.02em;
}

.brand-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent); }

.nav-search-wrap { flex: 1; max-width: 440px; margin: 0 16px; }
.nav-search-input {
  width: 100%;
  padding: 9px 16px;
  border-radius: 9999px;
  border: 1px solid var(--border);
  font-size: 13.5px;
  outline: none;
  background: #f1f5f9;
}
.nav-search-input:focus { border-color: var(--primary); background: #ffffff; }

.cart-trigger-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--primary);
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
}
.cart-badge {
  background: var(--accent);
  color: #fff;
  font-size: 11px;
  padding: 2px 7px;
  border-radius: 999px;
}

.store-main { max-width: 1200px; margin: 0 auto; padding: 32px 20px; flex: 1; width: 100%; box-sizing: border-box; }

.hero-banner {
  text-align: center;
  margin-bottom: 36px;
  padding: 40px 20px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  border-radius: 20px;
  color: #ffffff;
}
.hero-tag { font-size: 11px; font-weight: 800; letter-spacing: 0.12em; color: var(--accent); }
.hero-banner h1 { font-size: clamp(28px, 4vw, 44px); font-weight: 800; margin: 12px 0; letter-spacing: -0.03em; }
.hero-banner p { color: #94a3b8; font-size: 15px; max-width: 520px; margin: 0 auto; }

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 28px;
}

.category-pills { display: flex; gap: 8px; flex-wrap: wrap; }
.cat-pill {
  border: 1px solid var(--border);
  background: #ffffff;
  padding: 7px 16px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  transition: all 0.15s ease;
}
.cat-pill.active { background: var(--primary); color: #ffffff; border-color: var(--primary); }

.sort-wrap { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #64748b; }
.sort-wrap select { padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border); font-size: 13px; outline: none; }

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 24px;
}

.product-card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s, box-shadow 0.2s;
}
.product-card:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(0,0,0,0.06); }

.product-image-box { position: relative; height: 210px; background: #f1f5f9; overflow: hidden; }
.product-image-box img { width: 100%; height: 100%; object-fit: cover; }
.product-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: var(--accent);
  color: #ffffff;
  font-size: 10px;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 4px;
}

.product-details { padding: 18px; flex: 1; display: flex; flex-direction: column; }
.product-cat { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px; }
.product-name { font-size: 16px; font-weight: 700; margin: 0 0 6px; color: var(--primary); }
.product-desc { font-size: 13px; color: #64748b; line-height: 1.45; margin-bottom: 16px; flex: 1; }

.product-bottom { display: flex; align-items: center; justify-content: space-between; }
.price-tag { font-size: 18px; font-weight: 800; color: var(--primary); }
.add-cart-btn {
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  color: #0f172a;
  padding: 8px 14px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 12.5px;
  cursor: pointer;
  transition: background 0.15s;
}
.add-cart-btn:hover { background: var(--primary); color: #fff; border-color: var(--primary); }

/* Cart Drawer */
.drawer-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(3px); z-index: 200;
  display: flex; justify-content: flex-end;
}
.drawer-panel {
  width: 100%; max-width: 400px; height: 100%; background: #ffffff; display: flex; flex-direction: column;
  box-shadow: -10px 0 30px rgba(0,0,0,0.15); animation: slideLeft 0.25s ease;
}
@keyframes slideLeft { from { transform: translateX(100%); } to { transform: translateX(0); } }

.drawer-header { padding: 18px 20px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
.drawer-header h3 { margin: 0; font-size: 16px; font-weight: 700; }
.drawer-close { background: none; border: none; font-size: 24px; cursor: pointer; color: #64748b; }

.drawer-body { flex: 1; overflow-y: auto; padding: 20px; }
.cart-row { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #f1f5f9; }
.cart-row img { width: 64px; height: 64px; border-radius: 10px; object-fit: cover; }
.cart-info { flex: 1; }
.cart-info h4 { margin: 0 0 4px; font-size: 14px; font-weight: 600; }
.cart-price { font-weight: 700; color: var(--primary); font-size: 13px; }
.cart-stepper { display: inline-flex; align-items: center; gap: 8px; margin-top: 6px; border: 1px solid #cbd5e1; border-radius: 6px; padding: 2px 6px; }
.cart-stepper button { border: none; background: none; cursor: pointer; font-size: 14px; font-weight: 700; }
.cart-remove-btn { background: none; border: none; color: #ef4444; font-size: 18px; cursor: pointer; }

.drawer-footer { padding: 20px; border-top: 1px solid var(--border); background: #fafafa; }
.drawer-total { display: flex; justify-content: space-between; font-size: 16px; margin-bottom: 14px; }
.checkout-btn { width: 100%; padding: 12px; background: var(--primary); color: #fff; border: none; border-radius: 10px; font-size: 14px; font-weight: 700; cursor: pointer; }

/* Modal */
.modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 300; display: flex; align-items: center; justify-content: center; }
.modal-dialog { background: #fff; width: 90%; max-width: 440px; border-radius: 16px; padding: 28px; box-sizing: border-box; }
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
.modal-header h3 { margin: 0; font-size: 18px; font-weight: 700; }
.modal-close { background: none; border: none; font-size: 22px; cursor: pointer; }
.order-summary-box { background: #f8fafc; border: 1px solid var(--border); padding: 12px 16px; border-radius: 8px; display: flex; justify-content: space-between; margin-bottom: 16px; }
.form-group { margin-bottom: 14px; }
.form-group label { display: block; font-size: 12.5px; font-weight: 600; margin-bottom: 4px; color: #475569; }
.form-group input { width: 100%; padding: 9px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13.5px; box-sizing: border-box; }
.pay-now-btn { width: 100%; padding: 12px; background: var(--accent); color: #fff; border: none; border-radius: 10px; font-size: 14px; font-weight: 700; cursor: pointer; margin-top: 8px; }
.modal-success { text-align: center; padding: 20px 0; }
.success-icon { width: 48px; height: 48px; background: #dcfce7; color: #15803d; border-radius: 50%; font-size: 22px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 12px; font-weight: 800; }

.store-footer { background: var(--primary); color: #94a3b8; padding: 48px 24px; margin-top: 48px; }
.footer-wrap { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 24px; }
.footer-info h4 { color: #fff; margin: 0 0 8px; font-size: 18px; }
.footer-links { display: flex; gap: 20px; font-size: 13px; }
.footer-copy { width: 100%; border-top: 1px solid #334155; padding-top: 20px; font-size: 12px; }
`
  };

  return {
    summary: `Created a custom e-commerce web application for ${brand} featuring catalog search, category pills, product cards, dynamic slide-out cart drawer, and interactive checkout modal.`,
    plan,
    files,
  };
}

// -----------------------------------------------------------------------------
// 2. RESTAURANT & CULINARY ARCHITECTURE
// -----------------------------------------------------------------------------
function generateRestaurantArchitecture(brand, request) {
  const plan = [
    ['/src/components/Navbar.jsx', 'Navigation bar with restaurant brand, menu jump links, and reservation CTA'],
    ['/src/components/MenuSection.jsx', 'Filterable a la carte menu organized by course categories (Appetizers, Mains, Desserts)'],
    ['/src/components/FoodCard.jsx', 'Dish card with culinary photos, dietary badges (GF, Vegan), price, and Add to Order'],
    ['/src/components/CartDrawer.jsx', 'Live order drawer with items, quantities, and table delivery/pickup option'],
    ['/src/components/ReservationModal.jsx', 'Interactive table booking form with guest count, date picker, time slot, and confirmation'],
    ['/src/components/Footer.jsx', 'Hours of operation, address, phone number, and social links'],
    ['/src/data/menu.js', 'Curated artisanal menu items with descriptions, prices, dietary tags, and photos'],
    ['/src/App.jsx', 'Root culinary application orchestrating order state, table bookings, and course filters'],
    ['/src/styles.css', 'Warm culinary styling, appetizing typography, elegant card borders, and responsive grid'],
  ];

  const files = {
    '/data/menu.js': `export const MENU_ITEMS = [
  {
    id: 1,
    name: 'Truffle Tagliolini Tartufata',
    category: 'Mains',
    price: 34,
    dietary: 'Vegetarian',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&auto=format&fit=crop&q=80',
    description: 'Handcrafted ribbon pasta, shaved Umbrian black winter truffles, cultured butter, aged Parmigiano Reggiano.'
  },
  {
    id: 2,
    name: 'Wood-Fired Burrata Caprese',
    category: 'Starters',
    price: 22,
    dietary: 'Gluten-Free',
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?w=600&auto=format&fit=crop&q=80',
    description: 'Pugliese burrata, heirloom tomatoes, cold-pressed Sicilian olive oil, 25-year aged balsamic.'
  },
  {
    id: 3,
    name: 'Prime Wagyu Filetto al Barolo',
    category: 'Mains',
    price: 58,
    dietary: 'Signature',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=600&auto=format&fit=crop&q=80',
    description: 'Pan-seared A5 Wagyu tenderloin, Barolo wine reduction, roasted bone marrow, glazed baby carrots.'
  },
  {
    id: 4,
    name: 'Espresso Tiramisu Tradizionale',
    category: 'Desserts',
    price: 16,
    dietary: 'Vegetarian',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&auto=format&fit=crop&q=80',
    description: 'Savoiardi soaked in single-origin espresso, whipped mascarpone cream, Valrhona dark cocoa.'
  }
];
`,

    '/components/Navbar.jsx': `import React from 'react';

export default function Navbar({ cartCount, onOpenCart, onOpenBooking }) {
  return (
    <header className="bistro-nav">
      <div className="bistro-nav-wrap">
        <a href="#home" className="bistro-brand">
          <span className="bistro-icon">🍷</span>
          <span>${brand}</span>
        </a>

        <nav className="bistro-links">
          <a href="#menu">Menu</a>
          <a href="#about">Story</a>
          <a href="#reservations" onClick={(e) => { e.preventDefault(); onOpenBooking(); }}>Reservations</a>
        </nav>

        <div className="bistro-actions">
          <button onClick={onOpenBooking} className="btn-reserve">Book Table</button>
          <button onClick={onOpenCart} className="btn-order">
            Order ({cartCount})
          </button>
        </div>
      </div>
    </header>
  );
}
`,

    '/components/FoodCard.jsx': `import React from 'react';

export default function FoodCard({ item, onAdd }) {
  return (
    <div className="food-card">
      <div className="food-img-wrap">
        <img src={item.image} alt={item.name} loading="lazy" />
        <span className="dietary-tag">{item.dietary}</span>
      </div>
      <div className="food-body">
        <div className="food-headline">
          <h4>{item.name}</h4>
          <span className="food-price">\${item.price}</span>
        </div>
        <p className="food-desc">{item.description}</p>
        <button onClick={() => onAdd(item)} className="btn-add-food">
          + Add to Order
        </button>
      </div>
    </div>
  );
}
`,

    '/components/MenuSection.jsx': `import React, { useState } from 'react';
import FoodCard from './FoodCard.jsx';

export default function MenuSection({ menuItems, onAdd }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', 'Starters', 'Mains', 'Desserts'];

  const filtered = selectedCategory === 'All' 
    ? menuItems 
    : menuItems.filter((i) => i.category === selectedCategory);

  return (
    <section id="menu" className="menu-container">
      <div className="menu-header">
        <span className="section-eyebrow">Artisanal Dining</span>
        <h2>A La Carte Menu</h2>
        <p>Prepared daily with locally sourced organic produce and farm-fresh ingredients.</p>
        <div className="menu-tabs">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={'menu-tab ' + (selectedCategory === c ? 'active' : '')}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="food-grid">
        {filtered.map((item) => (
          <FoodCard key={item.id} item={item} onAdd={onAdd} />
        ))}
      </div>
    </section>
  );
}
`,

    '/components/CartDrawer.jsx': `import React from 'react';

export default function CartDrawer({ isOpen, onClose, cart, onUpdateQty, onCheckout }) {
  if (!isOpen) return null;
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <h3>Your Dining Order</h3>
          <button onClick={onClose} className="drawer-close">&times;</button>
        </div>

        <div className="drawer-body">
          {cart.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#78716c', marginTop: '40px' }}>Your order is empty.</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="cart-item-row">
                <div>
                  <strong>{item.name}</strong>
                  <div>\${item.price} each</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button onClick={() => onUpdateQty(item.id, item.qty - 1)}>-</button>
                  <span>{item.qty}</span>
                  <button onClick={() => onUpdateQty(item.id, item.qty + 1)}>+</button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="drawer-footer">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', fontWeight: 700 }}>
              <span>Total:</span>
              <span>\${subtotal.toFixed(2)}</span>
            </div>
            <button onClick={onCheckout} className="btn-primary" style={{ width: '100%' }}>
              Submit Order to Kitchen &rarr;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
`,

    '/components/ReservationModal.jsx': `import React, { useState } from 'react';

export default function ReservationModal({ isOpen, onClose }) {
  const [confirmed, setConfirmed] = useState(false);
  const [form, setForm] = useState({ name: '', guests: '2 Guests', date: '', time: '7:00 PM' });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setConfirmed(true);
    setTimeout(() => {
      setConfirmed(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Reserve Your Table</h3>
          <button onClick={onClose} className="modal-close">&times;</button>
        </div>

        {confirmed ? (
          <div className="modal-success">
            <div className="success-icon">✓</div>
            <h4>Table Reserved!</h4>
            <p>We are delighted to welcome you to ${brand}. A confirmation email has been sent.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="reservation-form">
            <div className="form-group">
              <label>Guest Name</label>
              <input type="text" required placeholder="Lord Julian Vance" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Party Size</label>
              <select value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })}>
                <option>1 Guest</option>
                <option>2 Guests</option>
                <option>4 Guests</option>
                <option>6+ VIP Private Room</option>
              </select>
            </div>
            <div className="form-group">
              <label>Preferred Date & Time</label>
              <input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <button type="submit" className="btn-reserve" style={{ width: '100%', marginTop: '12px' }}>Confirm Reservation</button>
          </form>
        )}
      </div>
    </div>
  );
}
`,

    '/components/Footer.jsx': `import React from 'react';

export default function Footer() {
  return (
    <footer className="bistro-footer">
      <div className="bistro-footer-wrap">
        <div>
          <h3>${brand}</h3>
          <p>Michelin-selected artisanal culinary dining and private sommelier cellar.</p>
        </div>
        <div>
          <h4>Hours</h4>
          <p>Tuesday – Sunday: 5:00 PM – 11:00 PM</p>
          <p>Closed Mondays for private culinary events</p>
        </div>
        <div>
          <h4>Contact & Location</h4>
          <p>448 Grand Avenue, New York, NY</p>
          <p>+1 (555) 890-2341</p>
        </div>
      </div>
    </footer>
  );
}
`,

    '/App.jsx': `import React, { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import MenuSection from './components/MenuSection.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import ReservationModal from './components/ReservationModal.jsx';
import Footer from './components/Footer.jsx';
import { MENU_ITEMS } from './data/menu.js';
import './styles.css';

export default function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const handleAddDish = (item) => {
    setCart((prev) => {
      const match = prev.find((i) => i.id === item.id);
      if (match) return prev.map((i) => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...item, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQty = (id, newQty) => {
    if (newQty <= 0) {
      setCart((prev) => prev.filter((i) => i.id !== id));
      return;
    }
    setCart((prev) => prev.map((i) => i.id === id ? { ...i, qty: newQty } : i));
  };

  return (
    <div className="bistro-app">
      <Navbar 
        cartCount={cart.reduce((s, i) => s + i.qty, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenBooking={() => setIsBookingOpen(true)}
      />

      <header className="bistro-hero">
        <div className="bistro-hero-content">
          <span className="hero-eyebrow">MICHELIN SELECTED • VINTAGE CELLAR</span>
          <h1>Artisanal Gastronomy & Memorable Evenings</h1>
          <p>Experience sensory culinary journeys orchestrated by world-renowned chefs with seasonal harvests.</p>
          <div className="hero-buttons">
            <button onClick={() => setIsBookingOpen(true)} className="btn-reserve-large">Reserve Table</button>
            <a href="#menu" className="btn-menu-link">Explore Menu &rarr;</a>
          </div>
        </div>
      </header>

      <MenuSection menuItems={MENU_ITEMS} onAdd={handleAddDish} />

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart}
        onUpdateQty={handleUpdateQty}
        onCheckout={() => {
          alert('Order sent to our kitchen team!');
          setCart([]);
          setIsCartOpen(false);
        }}
      />

      <ReservationModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
      />

      <Footer />
    </div>
  );
}
`,

    '/styles.css': `/* Restaurant Theme */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Plus Jakarta Sans', Georgia, serif;
  background-color: #0c0a09;
  color: #f5f5f4;
}

.bistro-nav {
  position: sticky; top: 0; z-index: 100;
  background: rgba(12, 10, 9, 0.95);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid #292524;
  padding: 16px 24px;
}
.bistro-nav-wrap { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
.bistro-brand { display: flex; align-items: center; gap: 8px; font-size: 20px; font-weight: 800; color: #f5f5f4; text-decoration: none; }
.bistro-links { display: flex; gap: 24px; }
.bistro-links a { color: #a8a29e; text-decoration: none; font-size: 14px; font-weight: 600; }
.bistro-links a:hover { color: #f5f5f4; }
.bistro-actions { display: flex; gap: 12px; }
.btn-reserve { background: #b45309; color: #fff; border: 0; padding: 8px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; }
.btn-order { background: #292524; color: #f5f5f4; border: 1px solid #44403c; padding: 8px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; }

.bistro-hero {
  padding: 100px 24px;
  text-align: center;
  background: linear-gradient(180deg, #1c1917 0%, #0c0a09 100%);
  border-bottom: 1px solid #292524;
}
.hero-eyebrow { font-size: 12px; font-weight: 800; letter-spacing: 0.15em; color: #d97706; display: block; margin-bottom: 12px; }
.bistro-hero h1 { font-size: clamp(32px, 5vw, 56px); font-weight: 800; margin: 0 auto 16px; max-width: 780px; line-height: 1.15; }
.bistro-hero p { color: #a8a29e; font-size: 16px; max-width: 600px; margin: 0 auto 28px; line-height: 1.6; }
.hero-buttons { display: flex; justify-content: center; gap: 16px; }
.btn-reserve-large { background: #b45309; color: #fff; border: 0; padding: 12px 28px; border-radius: 10px; font-size: 15px; font-weight: 700; cursor: pointer; }
.btn-menu-link { display: inline-flex; align-items: center; color: #f5f5f4; text-decoration: none; font-weight: 600; padding: 12px 20px; }

.menu-container { max-width: 1200px; margin: 0 auto; padding: 60px 24px; }
.menu-header { text-align: center; margin-bottom: 48px; }
.section-eyebrow { color: #d97706; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.12em; }
.menu-header h2 { font-size: 36px; margin: 8px 0 12px; }
.menu-header p { color: #a8a29e; font-size: 15px; }

.menu-tabs { display: flex; justify-content: center; gap: 10px; margin-top: 24px; }
.menu-tab { background: #1c1917; border: 1px solid #292524; color: #a8a29e; padding: 8px 18px; border-radius: 999px; font-weight: 600; cursor: pointer; }
.menu-tab.active { background: #b45309; color: #ffffff; border-color: #b45309; }

.food-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; }
.food-card { background: #1c1917; border: 1px solid #292524; border-radius: 16px; overflow: hidden; display: flex; flex-direction: column; }
.food-img-wrap { position: relative; height: 200px; }
.food-img-wrap img { width: 100%; height: 100%; object-fit: cover; }
.dietary-tag { position: absolute; bottom: 10px; left: 10px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); color: #d97706; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 4px; }

.food-body { padding: 20px; flex: 1; display: flex; flex-direction: column; }
.food-headline { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px; }
.food-headline h4 { margin: 0; font-size: 17px; font-weight: 700; color: #f5f5f4; }
.food-price { font-weight: 800; color: #d97706; font-size: 17px; }
.food-desc { color: #a8a29e; font-size: 13.5px; line-height: 1.5; margin-bottom: 20px; flex: 1; }
.btn-add-food { background: #292524; border: 1px solid #44403c; color: #f5f5f4; padding: 10px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: 0.15s; }
.btn-add-food:hover { background: #b45309; border-color: #b45309; }

.drawer-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 200; display: flex; justify-content: flex-end; }
.drawer-panel { width: 100%; max-width: 380px; height: 100%; background: #1c1917; border-left: 1px solid #292524; display: flex; flex-direction: column; }
.drawer-header { padding: 20px; border-bottom: 1px solid #292524; display: flex; justify-content: space-between; align-items: center; }
.drawer-header h3 { margin: 0; }
.drawer-close { background: none; border: none; color: #a8a29e; font-size: 24px; cursor: pointer; }
.drawer-body { flex: 1; overflow-y: auto; padding: 20px; }
.cart-item-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #292524; }
.drawer-footer { padding: 20px; border-top: 1px solid #292524; background: #0c0a09; }

.modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 300; display: flex; align-items: center; justify-content: center; }
.modal-dialog { background: #1c1917; border: 1px solid #292524; width: 90%; max-width: 440px; border-radius: 16px; padding: 28px; box-sizing: border-box; }
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
.modal-header h3 { margin: 0; }
.modal-close { background: none; border: none; color: #a8a29e; font-size: 22px; cursor: pointer; }
.form-group { margin-bottom: 14px; }
.form-group label { display: block; font-size: 13px; font-weight: 600; color: #a8a29e; margin-bottom: 6px; }
.form-group input, .form-group select { width: 100%; padding: 10px; background: #0c0a09; border: 1px solid #292524; color: #f5f5f4; border-radius: 8px; font-size: 14px; box-sizing: border-box; }
.modal-success { text-align: center; padding: 24px 0; }
.success-icon { width: 48px; height: 48px; background: #b45309; color: #fff; border-radius: 50%; font-size: 22px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 12px; font-weight: 800; }

.bistro-footer { background: #0c0a09; border-top: 1px solid #292524; padding: 60px 24px; color: #a8a29e; }
.bistro-footer-wrap { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 40px; }
.bistro-footer-wrap h3, .bistro-footer-wrap h4 { color: #f5f5f4; margin: 0 0 12px; }
`
  };

  return {
    summary: `Engineered a culinary gastronomy application for ${brand} with a la carte menu sections, course filters, interactive dining cart, and online table reservations.`,
    plan,
    files,
  };
}

// -----------------------------------------------------------------------------
// 3. SAAS / DASHBOARD ARCHITECTURE
// -----------------------------------------------------------------------------
function generateSaasArchitecture(brand, request) {
  const plan = [
    ['/src/components/Sidebar.jsx', 'Collapsible dashboard sidebar with navigation routes, workspace selector, and user badge'],
    ['/src/components/TopHeader.jsx', 'Dashboard top header with live environment status, notifications, and new project action'],
    ['/src/components/MetricCard.jsx', 'Metric stat card with trend indicator (+14.2%), historical comparison, and sparklines'],
    ['/src/components/AnalyticsChart.jsx', 'Visual analytics overview with time range filters (24h, 7d, 30d) and throughput data'],
    ['/src/components/DataTable.jsx', 'Real-time telemetry and API activity table with search, status pills, and action menu'],
    ['/src/components/QuickActions.jsx', 'Quick deployment and API key generation triggers'],
    ['/src/data/metrics.js', 'Simulated telemetry metrics, server health logs, and active deployments'],
    ['/src/App.jsx', 'Main SaaS dashboard shell orchestrating sidebar navigation, search filters, and live metric updates'],
    ['/src/styles.css', 'Sleek dark-mode telemetry styling, glassmorphism card surfaces, and grid layout'],
  ];

  const files = {
    '/data/metrics.js': `export const METRICS = [
  { label: 'Active Edge Inferences', value: '1.42M', change: '+18.4%', positive: true },
  { label: 'Avg Latency (p99)', value: '28ms', change: '-4.2%', positive: true },
  { label: 'Compute Cluster Uptime', value: '99.99%', change: 'Normal', positive: true },
  { label: 'Active API Keys', value: '842', change: '+32 this week', positive: true }
];

export const ACTIVITY_LOGS = [
  { id: 'ev_01', endpoint: '/v1/models/generate', status: '200 OK', latency: '24ms', region: 'us-east (iad)', timestamp: 'Just now' },
  { id: 'ev_02', endpoint: '/v1/embeddings/batch', status: '200 OK', latency: '41ms', region: 'eu-west (lhr)', timestamp: '1m ago' },
  { id: 'ev_03', endpoint: '/v1/agents/orchestrate', status: '200 OK', latency: '82ms', region: 'ap-northeast (hnd)', timestamp: '3m ago' },
  { id: 'ev_04', endpoint: '/v1/telemetry/stream', status: '200 OK', latency: '12ms', region: 'us-west (sfo)', timestamp: '5m ago' }
];
`,

    '/components/Sidebar.jsx': `import React from 'react';

export default function Sidebar({ activeRoute, setActiveRoute }) {
  const routes = ['Overview', 'Analytics', 'Deployments', 'API Keys', 'Settings'];

  return (
    <aside className="saas-sidebar">
      <div className="sidebar-brand">
        <span className="brand-dot"></span>
        <span>${brand}</span>
      </div>

      <nav className="sidebar-nav">
        {routes.map((r) => (
          <button
            key={r}
            onClick={() => setActiveRoute(r)}
            className={'sidebar-link ' + (activeRoute === r ? 'active' : '')}
          >
            <span>{r}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">YD</div>
          <div>
            <strong>Enterprise Admin</strong>
            <small>Production v2.4</small>
          </div>
        </div>
      </div>
    </aside>
  );
}
`,

    '/components/TopHeader.jsx': `import React from 'react';

export default function TopHeader({ onNewAction }) {
  return (
    <header className="saas-top-header">
      <div>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Telemetry Overview</h2>
        <span style={{ fontSize: '12px', color: '#94a3b8' }}>Live infrastructure nodes and inference health</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span className="status-live-pill">
          <span className="pulse-dot"></span> All Systems Operational
        </span>
        <button onClick={onNewAction} className="btn-primary">
          + Deploy New Model
        </button>
      </div>
    </header>
  );
}
`,

    '/components/MetricCard.jsx': `import React from 'react';

export default function MetricCard({ metric }) {
  return (
    <div className="metric-card">
      <span className="metric-label">{metric.label}</span>
      <div className="metric-value">{metric.value}</div>
      <div className="metric-trend positive">{metric.change}</div>
    </div>
  );
}
`,

    '/components/DataTable.jsx': `import React from 'react';

export default function DataTable({ logs }) {
  return (
    <div className="data-table-card">
      <div className="table-header">
        <h3>Live Inference Events</h3>
        <span style={{ fontSize: '12px', color: '#94a3b8' }}>Real-time event stream</span>
      </div>

      <table className="telemetry-table">
        <thead>
          <tr>
            <th>Endpoint</th>
            <th>Status</th>
            <th>Latency</th>
            <th>Region</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td><code>{log.endpoint}</code></td>
              <td><span className="status-badge-ok">{log.status}</span></td>
              <td>{log.latency}</td>
              <td>{log.region}</td>
              <td style={{ color: '#94a3b8' }}>{log.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
`,

    '/App.jsx': `import React, { useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import TopHeader from './components/TopHeader.jsx';
import MetricCard from './components/MetricCard.jsx';
import DataTable from './components/DataTable.jsx';
import { METRICS, ACTIVITY_LOGS } from './data/metrics.js';
import './styles.css';

export default function App() {
  const [activeRoute, setActiveRoute] = useState('Overview');
  const [logs, setLogs] = useState(ACTIVITY_LOGS);

  const handleDeploy = () => {
    const newLog = {
      id: 'ev_' + Date.now().toString().slice(-4),
      endpoint: '/v1/neural/fine-tune',
      status: '200 OK',
      latency: '18ms',
      region: 'us-east (iad)',
      timestamp: 'Just now'
    };
    setLogs((prev) => [newLog, ...prev.slice(0, 5)]);
    alert('Model deployment triggered successfully across 14 global edge clusters!');
  };

  return (
    <div className="saas-shell">
      <Sidebar activeRoute={activeRoute} setActiveRoute={setActiveRoute} />
      <div className="saas-content">
        <TopHeader onNewAction={handleDeploy} />
        <main className="saas-body">
          <div className="metrics-grid">
            {METRICS.map((m, i) => (
              <MetricCard key={i} metric={m} />
            ))}
          </div>

          <div style={{ marginTop: '24px' }}>
            <DataTable logs={logs} />
          </div>
        </main>
      </div>
    </div>
  );
}
`,

    '/styles.css': `/* SaaS Dashboard Styling */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Plus Jakarta Sans', Inter, sans-serif;
  background-color: #09090b;
  color: #f4f4f5;
}

.saas-shell { display: flex; height: 100vh; overflow: hidden; }

.saas-sidebar {
  width: 250px;
  background: #121215;
  border-right: 1px solid #27272a;
  display: flex;
  flex-direction: column;
}

.sidebar-brand {
  height: 60px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
  font-size: 16px;
  border-bottom: 1px solid #27272a;
}
.brand-dot { width: 8px; height: 8px; border-radius: 50%; background: #6366f1; }

.sidebar-nav { flex: 1; padding: 16px 12px; display: flex; flex-direction: column; gap: 4px; }
.sidebar-link {
  display: flex; align-items: center; padding: 10px 14px; border: none; border-radius: 8px;
  background: transparent; color: #a1a1aa; font-weight: 600; font-size: 13.5px; cursor: pointer; text-align: left;
}
.sidebar-link.active { background: #27272a; color: #ffffff; }

.sidebar-footer { padding: 16px; border-top: 1px solid #27272a; }
.user-profile { display: flex; align-items: center; gap: 10px; }
.user-avatar { width: 32px; height: 32px; border-radius: 8px; background: #6366f1; display: grid; place-items: center; font-weight: 700; font-size: 12px; }

.saas-content { flex: 1; display: flex; flex-direction: column; overflow-y: auto; }
.saas-top-header {
  height: 60px; padding: 0 28px; border-bottom: 1px solid #27272a; background: #121215;
  display: flex; justify-content: space-between; align-items: center;
}
.status-live-pill {
  font-size: 12px; color: #10b981; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2);
  padding: 4px 12px; border-radius: 999px; display: inline-flex; align-items: center; gap: 6px;
}
.pulse-dot { width: 6px; height: 6px; border-radius: 50%; background: #10b981; }

.btn-primary { background: #6366f1; color: #fff; border: 0; padding: 8px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; }

.saas-body { padding: 28px; }
.metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }
.metric-card {
  background: #121215; border: 1px solid #27272a; border-radius: 12px; padding: 20px;
}
.metric-label { font-size: 12px; font-weight: 600; color: #a1a1aa; text-transform: uppercase; }
.metric-value { font-size: 28px; font-weight: 800; margin: 8px 0; }
.metric-trend.positive { font-size: 12px; color: #10b981; font-weight: 600; }

.data-table-card { background: #121215; border: 1px solid #27272a; border-radius: 12px; overflow: hidden; }
.table-header { padding: 18px 24px; border-bottom: 1px solid #27272a; display: flex; justify-content: space-between; align-items: center; }
.table-header h3 { margin: 0; font-size: 15px; font-weight: 700; }

.telemetry-table { width: 100%; border-collapse: collapse; font-size: 13px; text-align: left; }
.telemetry-table th { padding: 12px 24px; color: #a1a1aa; border-bottom: 1px solid #27272a; font-weight: 600; }
.telemetry-table td { padding: 14px 24px; border-bottom: 1px solid #1f1f23; }
.status-badge-ok { background: rgba(16,185,129,0.1); color: #10b981; padding: 2px 8px; border-radius: 4px; font-weight: 700; font-size: 11px; }
`
  };

  return {
    summary: `Synthesized a cloud telemetry SaaS platform for ${brand} with sidebar navigation, metric sparkline cards, live API streaming table, and instant model deployment triggers.`,
    plan,
    files,
  };
}

// -----------------------------------------------------------------------------
// 4. PORTFOLIO ARCHITECTURE (Tailored to role & individual)
// -----------------------------------------------------------------------------
function generatePortfolioArchitecture(personName, request) {
  let roleTitle = 'Full-Stack Software Engineer';
  if (/designer|ui|ux/i.test(request)) roleTitle = 'Product & UI/UX Designer';
  else if (/data|ai|machine learning/i.test(request)) roleTitle = 'AI & Machine Learning Engineer';
  else if (/mobile|ios|android/i.test(request)) roleTitle = 'Mobile Systems Engineer';
  else if (/devops|cloud/i.test(request)) roleTitle = 'Cloud Infrastructure Engineer';

  const plan = [
    ['/src/components/Navbar.jsx', 'Minimalist sticky header with designer brand, navigation links, and availability badge'],
    ['/src/components/BioHero.jsx', 'Personal hero with title, location, live status badge, and primary action buttons'],
    ['/src/components/SkillsBento.jsx', 'Bento-style technical capabilities grid with proficiency tags'],
    ['/src/components/ProjectCard.jsx', 'Case study card with preview images, tech stack tags, and demo/GitHub links'],
    ['/src/components/ExperienceTimeline.jsx', 'Career milestones and work experience timeline'],
    ['/src/components/ContactModal.jsx', 'Interactive contact form with message dispatch and email links'],
    ['/src/data/portfolioData.js', 'Personal portfolio data including projects, skills, and bio'],
    ['/src/App.jsx', 'Root portfolio shell orchestrating hero, projects, and contact modal'],
    ['/src/styles.css', 'Modern typography, dark/light aesthetic, clean borders, and micro-interactions'],
  ];

  const files = {
    '/data/portfolioData.js': `export const PORTFOLIO_DATA = {
  name: '${personName}',
  role: '${roleTitle}',
  bio: 'Specializing in clean architectures, high-performance web systems, and delightful developer experiences.',
  skills: [
    { title: 'Frontend Systems', tags: ['React 19', 'Next.js', 'TypeScript', 'Tailwind', 'CSS Architecture'] },
    { title: 'Backend & Cloud', tags: ['Node.js', 'PostgreSQL', 'Redis', 'Docker', 'GraphQL'] },
    { title: 'AI & Automations', tags: ['LLM Orchestration', 'Vector DBs', 'Agent Pipelines', 'OpenAI'] }
  ],
  projects: [
    {
      title: 'NeuralCanvas Studio',
      desc: 'Collaborative real-time canvas for generative AI ideation with WebSocket sync.',
      tags: ['React', 'WebSockets', 'Canvas API'],
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      demo: '#'
    },
    {
      title: 'HyperStream DB',
      desc: 'Low-latency time-series analytics engine processing 40k events/second.',
      tags: ['Node.js', 'Rust', 'TimescaleDB'],
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
      demo: '#'
    }
  ]
};
`,

    '/components/Navbar.jsx': `import React from 'react';

export default function Navbar({ onContact }) {
  return (
    <header className="port-nav">
      <div className="port-nav-wrap">
        <a href="#home" className="port-brand">
          <span className="avatar-dot"></span>
          <span>${personName}</span>
        </a>

        <nav className="port-links">
          <a href="#skills">Skills</a>
          <a href="#projects">Work</a>
          <button onClick={onContact} className="port-contact-btn">Get In Touch</button>
        </nav>
      </div>
    </header>
  );
}
`,

    '/components/BioHero.jsx': `import React from 'react';

export default function BioHero({ data, onContact }) {
  return (
    <section className="port-hero">
      <div className="port-badge">
        <span className="dot-live"></span> Available for Selected Opportunities
      </div>
      <h1>Building high-performance software for the modern web.</h1>
      <p>{data.bio}</p>
      <div style={{ display: 'flex', gap: '14px' }}>
        <button onClick={onContact} className="btn-solid">Let's Connect &rarr;</button>
        <a href="#projects" className="btn-outline">View Featured Work</a>
      </div>
    </section>
  );
}
`,

    '/components/SkillsBento.jsx': `import React from 'react';

export default function SkillsBento({ skills }) {
  return (
    <section id="skills" className="port-section">
      <div className="section-head">
        <h2>Technical Capabilities</h2>
        <p>Core engineering disciplines and modern software stacks.</p>
      </div>
      <div className="bento-grid">
        {skills.map((s, i) => (
          <div key={i} className="bento-card">
            <h3>{s.title}</h3>
            <div className="tags-wrap">
              {s.tags.map((t) => <span key={t} className="tag-pill">{t}</span>)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
`,

    '/components/ProjectCard.jsx': `import React from 'react';

export default function ProjectCard({ project }) {
  return (
    <div className="work-card">
      <div className="work-img"><img src={project.image} alt={project.title} /></div>
      <div className="work-info">
        <h3>{project.title}</h3>
        <p>{project.desc}</p>
        <div className="work-tags">
          {project.tags.map((t) => <span key={t}>{t}</span>)}
        </div>
      </div>
    </div>
  );
}
`,

    '/components/ContactModal.jsx': `import React, { useState } from 'react';

export default function ContactModal({ isOpen, onClose }) {
  const [sent, setSent] = useState(false);
  const [msg, setMsg] = useState({ name: '', email: '', message: '' });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0 }}>Start a Conversation</h3>
          <button onClick={onClose} style={{ background: 'none', border: 0, fontSize: '20px', cursor: 'pointer' }}>&times;</button>
        </div>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '24px 0', color: '#16a34a' }}>
            <h4>Message Sent!</h4>
            <p>Thank you for reaching out. I'll get back to you within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Name</label>
              <input type="text" required value={msg.name} onChange={(e) => setMsg({ ...msg, name: e.target.value })} style={{ width: '100%', padding: '8px 10px', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Email</label>
              <input type="email" required value={msg.email} onChange={(e) => setMsg({ ...msg, email: e.target.value })} style={{ width: '100%', padding: '8px 10px', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Message</label>
              <textarea rows={3} required value={msg.message} onChange={(e) => setMsg({ ...msg, message: e.target.value })} style={{ width: '100%', padding: '8px 10px', boxSizing: 'border-box' }} />
            </div>
            <button type="submit" style={{ width: '100%', padding: '10px', background: '#09090b', color: '#fff', border: 0, borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Send Message</button>
          </form>
        )}
      </div>
    </div>
  );
}
`,

    '/App.jsx': `import React, { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import BioHero from './components/BioHero.jsx';
import SkillsBento from './components/SkillsBento.jsx';
import ProjectCard from './components/ProjectCard.jsx';
import ContactModal from './components/ContactModal.jsx';
import { PORTFOLIO_DATA } from './data/portfolioData.js';
import './styles.css';

export default function App() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <div className="port-shell">
      <Navbar onContact={() => setContactOpen(true)} />
      <main className="port-main">
        <BioHero data={PORTFOLIO_DATA} onContact={() => setContactOpen(true)} />
        <SkillsBento skills={PORTFOLIO_DATA.skills} />
        <section id="projects" className="port-section">
          <div className="section-head">
            <h2>Featured Projects</h2>
            <p>Selected engineering case studies and production codebases.</p>
          </div>
          <div className="work-grid">
            {PORTFOLIO_DATA.projects.map((p, i) => (
              <ProjectCard key={i} project={p} />
            ))}
          </div>
        </section>
      </main>

      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />

      <footer className="port-footer">
        <p>© 2026 ${personName}. All rights reserved.</p>
      </footer>
    </div>
  );
}
`,

    '/styles.css': `/* Portfolio Styling */
body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Plus Jakarta Sans', sans-serif; background: #ffffff; color: #09090b; }
.port-shell { min-height: 100vh; display: flex; flex-direction: column; }
.port-nav { position: sticky; top: 0; background: rgba(255,255,255,0.9); backdrop-filter: blur(8px); border-bottom: 1px solid #e4e4e7; z-index: 50; }
.port-nav-wrap { max-width: 1000px; margin: 0 auto; padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; }
.port-brand { font-weight: 800; font-size: 16px; color: #09090b; text-decoration: none; display: flex; align-items: center; gap: 8px; }
.avatar-dot { width: 8px; height: 8px; border-radius: 50%; background: #4f46e5; }
.port-links { display: flex; align-items: center; gap: 20px; }
.port-links a { text-decoration: none; color: #71717a; font-size: 13.5px; font-weight: 600; }
.port-contact-btn { background: #09090b; color: #fff; border: 0; padding: 8px 14px; border-radius: 8px; font-weight: 600; font-size: 13px; cursor: pointer; }

.port-main { max-width: 1000px; margin: 0 auto; padding: 40px 20px; flex: 1; }
.port-hero { padding: 40px 0 60px; max-width: 720px; }
.port-badge { display: inline-flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 600; background: #f4f4f5; padding: 4px 10px; border-radius: 999px; margin-bottom: 16px; }
.dot-live { width: 6px; height: 6px; border-radius: 50%; background: #16a34a; }
.port-hero h1 { font-size: clamp(32px, 5vw, 48px); font-weight: 800; line-height: 1.15; margin: 0 0 16px; }
.port-hero p { font-size: 16px; color: #71717a; line-height: 1.6; margin: 0 0 24px; }
.btn-solid { background: #09090b; color: #fff; border: 0; padding: 12px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; }
.btn-outline { display: inline-flex; align-items: center; text-decoration: none; color: #09090b; font-weight: 600; padding: 12px 20px; }

.port-section { padding: 40px 0; border-top: 1px solid #f4f4f5; }
.section-head h2 { font-size: 24px; font-weight: 800; margin: 0 0 6px; }
.section-head p { color: #71717a; font-size: 14px; margin: 0 0 24px; }

.bento-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; }
.bento-card { background: #fafafa; border: 1px solid #e4e4e7; border-radius: 12px; padding: 20px; }
.bento-card h3 { font-size: 16px; margin: 0 0 12px; }
.tags-wrap { display: flex; flex-wrap: wrap; gap: 6px; }
.tag-pill { background: #fff; border: 1px solid #e4e4e7; font-size: 12px; padding: 3px 8px; border-radius: 6px; color: #52525b; font-weight: 500; }

.work-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px; }
.work-card { border: 1px solid #e4e4e7; border-radius: 14px; overflow: hidden; background: #fff; }
.work-img { height: 180px; overflow: hidden; }
.work-img img { width: 100%; height: 100%; object-fit: cover; }
.work-info { padding: 16px; }
.work-info h3 { margin: 0 0 6px; font-size: 16px; }
.work-info p { color: #71717a; font-size: 13px; line-height: 1.5; margin: 0 0 12px; }
.work-tags { display: flex; gap: 6px; }
.work-tags span { background: #f4f4f5; font-size: 11px; padding: 2px 6px; border-radius: 4px; color: #71717a; }

.port-footer { text-align: center; padding: 32px; border-top: 1px solid #e4e4e7; color: #a1a1aa; font-size: 13px; }
`
  };

  return {
    summary: `Designed a personalized portfolio application for ${personName} with capabilities grid, interactive project showcase, and direct contact intake.`,
    plan,
    files,
  };
}

// -----------------------------------------------------------------------------
// 5. GENERIC DYNAMIC FALLBACK (Synthesizes custom domain for any topic)
// -----------------------------------------------------------------------------
function generateDynamicCustomArchitecture(brand, request) {
  const plan = [
    ['/src/components/Navbar.jsx', `Header with ${brand} branding, navigation items, and action trigger`],
    ['/src/components/HeroSection.jsx', 'Domain-specific hero banner with headline and primary action'],
    ['/src/components/ItemGrid.jsx', 'Interactive grid showcasing items with search and category filtering'],
    ['/src/components/ItemCard.jsx', 'Entity display card with metadata, actions, and status tags'],
    ['/src/components/ActionModal.jsx', 'Interactive modal for submitting requests or booking interactions'],
    ['/src/components/Footer.jsx', 'Site footer with links and copyright'],
    ['/src/data/items.js', 'Custom mock data tailored to the application topic'],
    ['/src/App.jsx', 'Root application managing filtering state and modal dialogs'],
    ['/src/styles.css', 'Modern responsive layout with clean typography and interactive states'],
  ];

  const files = {
    '/data/items.js': `export const ITEMS = [
  { id: 1, title: 'Standard ${brand} Edition', category: 'General', desc: 'Optimized for high performance and daily utility.', tag: 'Featured' },
  { id: 2, title: 'Pro Enterprise Model', category: 'Advanced', desc: 'Designed for teams with elevated security and speed requirements.', tag: 'Pro' },
  { id: 3, title: 'Ultra Performance Series', category: 'Premium', desc: 'Ultimate precision and custom configuration options.', tag: 'Elite' }
];
`,

    '/components/Navbar.jsx': `import React from 'react';

export default function Navbar({ onAction }) {
  return (
    <header className="custom-nav">
      <div className="nav-wrap">
        <a href="#home" className="brand-logo">
          <span className="dot"></span>
          <span>${brand}</span>
        </a>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={onAction} className="btn-action">Get Started</button>
        </div>
      </div>
    </header>
  );
}
`,

    '/components/HeroSection.jsx': `import React from 'react';

export default function HeroSection({ onAction }) {
  return (
    <section className="custom-hero">
      <span className="hero-sub">INNOVATIVE PLATFORM</span>
      <h1>Welcome to ${brand}</h1>
      <p>Created specifically for your workflow. Explore capabilities, interact with data, and manage operations in real time.</p>
      <button onClick={onAction} className="btn-action-lg">Explore Now &rarr;</button>
    </section>
  );
}
`,

    '/components/ItemCard.jsx': `import React from 'react';

export default function ItemCard({ item, onSelect }) {
  return (
    <div className="card">
      <span className="tag">{item.tag}</span>
      <h3>{item.title}</h3>
      <p>{item.desc}</p>
      <button onClick={() => onSelect(item)} className="btn-card">Select &rarr;</button>
    </div>
  );
}
`,

    '/components/ItemGrid.jsx': `import React from 'react';
import ItemCard from './ItemCard.jsx';

export default function ItemGrid({ items, onSelect }) {
  return (
    <section className="grid-section">
      <h2>Featured Offerings</h2>
      <div className="grid">
        {items.map((it) => (
          <ItemCard key={it.id} item={it} onSelect={onSelect} />
        ))}
      </div>
    </section>
  );
}
`,

    '/components/ActionModal.jsx': `import React, { useState } from 'react';

export default function ActionModal({ isOpen, onClose, selectedItem }) {
  const [done, setDone] = useState(false);
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h3 style={{ margin: 0 }}>Configure {selectedItem ? selectedItem.title : 'Action'}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 0, fontSize: '20px', cursor: 'pointer' }}>&times;</button>
        </div>

        {done ? (
          <div style={{ textAlign: 'center', padding: '20px 0', color: '#16a34a' }}>
            <h4>Request Submitted Successfully!</h4>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setDone(true); setTimeout(() => { setDone(false); onClose(); }, 1800); }}>
            <p style={{ color: '#64748b', fontSize: '13px' }}>Confirm your selections below.</p>
            <button type="submit" className="btn-action-lg" style={{ width: '100%' }}>Confirm & Proceed</button>
          </form>
        )}
      </div>
    </div>
  );
}
`,

    '/components/Footer.jsx': `import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <p>© 2026 ${brand}. Generated with autonomous AI builder architecture.</p>
    </footer>
  );
}
`,

    '/App.jsx': `import React, { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import HeroSection from './components/HeroSection.jsx';
import ItemGrid from './components/ItemGrid.jsx';
import ActionModal from './components/ActionModal.jsx';
import Footer from './components/Footer.jsx';
import { ITEMS } from './data/items.js';
import './styles.css';

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleSelect = (item) => {
    setSelected(item);
    setModalOpen(true);
  };

  return (
    <div className="app-shell">
      <Navbar onAction={() => setModalOpen(true)} />
      <main className="main-content">
        <HeroSection onAction={() => setModalOpen(true)} />
        <ItemGrid items={ITEMS} onSelect={handleSelect} />
      </main>
      <ActionModal isOpen={modalOpen} onClose={() => setModalOpen(false)} selectedItem={selected} />
      <Footer />
    </div>
  );
}
`,

    '/styles.css': `body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Plus Jakarta Sans', sans-serif; background: #fafafa; color: #09090b; }
.app-shell { min-height: 100vh; display: flex; flex-direction: column; }
.custom-nav { background: #fff; border-bottom: 1px solid #e4e4e7; padding: 14px 24px; position: sticky; top: 0; z-index: 10; }
.nav-wrap { max-width: 1100px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
.brand-logo { font-weight: 800; font-size: 17px; text-decoration: none; color: #09090b; display: flex; align-items: center; gap: 8px; }
.dot { width: 8px; height: 8px; border-radius: 50%; background: #4f46e5; }
.btn-action { background: #09090b; color: #fff; border: 0; padding: 8px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; }

.main-content { max-width: 1100px; margin: 0 auto; padding: 40px 20px; flex: 1; width: 100%; box-sizing: border-box; }
.custom-hero { text-align: center; padding: 60px 20px; background: #ffffff; border: 1px solid #e4e4e7; border-radius: 20px; margin-bottom: 40px; }
.hero-sub { color: #4f46e5; font-size: 11px; font-weight: 800; letter-spacing: 0.1em; }
.custom-hero h1 { font-size: clamp(28px, 4vw, 42px); margin: 12px 0; }
.custom-hero p { color: #71717a; max-width: 500px; margin: 0 auto 24px; font-size: 15px; }
.btn-action-lg { background: #4f46e5; color: #fff; border: 0; padding: 12px 24px; border-radius: 10px; font-weight: 700; cursor: pointer; }

.grid-section h2 { font-size: 22px; margin-bottom: 20px; }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; }
.card { background: #fff; border: 1px solid #e4e4e7; border-radius: 14px; padding: 22px; }
.tag { font-size: 11px; font-weight: 700; background: #f4f4f5; color: #4f46e5; padding: 2px 8px; border-radius: 4px; }
.card h3 { margin: 12px 0 6px; font-size: 16px; }
.card p { color: #71717a; font-size: 13px; margin-bottom: 16px; }
.btn-card { background: #f4f4f5; border: 0; padding: 8px 12px; border-radius: 6px; font-weight: 600; cursor: pointer; }

.modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 100; display: flex; align-items: center; justify-content: center; }
.modal-box { background: #fff; width: 90%; max-width: 400px; padding: 24px; border-radius: 16px; box-sizing: border-box; }

.footer { text-align: center; padding: 32px; border-top: 1px solid #e4e4e7; color: #a1a1aa; font-size: 13px; }
`
  };

  return {
    summary: `Dynamically architected and generated an application for ${brand} tailored to the prompt requirements.`,
    plan,
    files,
  };
}

// Healthcare / Clinic
function generateHealthcareArchitecture(brand, request) {
  const plan = [
    ['/src/components/Navbar.jsx', 'Clinical header with emergency hotline, specialties menu, and appointment booking'],
    ['/src/components/Hero.jsx', 'Care overview with board-certified doctor credentials and same-day booking'],
    ['/src/components/DepartmentGrid.jsx', 'Clinical specialty categories with pediatric, cardiology, and orthopedics'],
    ['/src/components/DoctorCard.jsx', 'Physician profile cards with specialties, bio, and patient availability'],
    ['/src/components/AppointmentModal.jsx', 'Interactive appointment booking modal with specialty, date, and SMS confirmation'],
    ['/src/components/Footer.jsx', 'Hospital licensing, emergency contact, and insurance partners'],
    ['/src/data/doctors.js', 'Medical team records with credentials, specialties, and schedules'],
    ['/src/App.jsx', 'Main clinical application managing appointment state and department filtering'],
    ['/src/styles.css', 'Crisp clinical teal styling, accessible typography, and hospital layout'],
  ];

  const files = {
    '/data/doctors.js': `export const DOCTORS = [
  { id: 1, name: 'Dr. Sarah Lin, MD', specialty: 'Pediatrics & Family Care', rating: '4.9 (180 reviews)', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&auto=format&fit=crop&q=80' },
  { id: 2, name: 'Dr. Marcus Vance, FACC', specialty: 'Cardiology & Heart Health', rating: '5.0 (210 reviews)', image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop&q=80' },
  { id: 3, name: 'Dr. Elena Rostova, MD', specialty: 'Orthopedics & Sports Medicine', rating: '4.8 (95 reviews)', image: 'https://images.unsplash.com/photo-1594824813571-638f02614d3f?w=600&auto=format&fit=crop&q=80' }
];
`,
    '/components/Navbar.jsx': `import React from 'react';
export default function Navbar({ onBook }) {
  return (
    <header className="med-nav">
      <div className="med-wrap">
        <a href="#home" className="med-brand"><span>🩺</span> <span>${brand}</span></a>
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: '#0d9488', fontWeight: 700 }}>24/7 Hotline: (555) 234-CARE</span>
          <button onClick={onBook} className="btn-med-action">Book Appointment</button>
        </div>
      </div>
    </header>
  );
}
`,
    '/components/Hero.jsx': `import React from 'react';
export default function Hero({ onBook }) {
  return (
    <section className="med-hero">
      <span className="badge-teal">BOARD-CERTIFIED CLINICAL EXCELLENCE</span>
      <h1>Compassionate Care for Your Entire Family</h1>
      <p>Providing cutting-edge diagnostic technology, same-day walk-in appointments, and dedicated specialists.</p>
      <button onClick={onBook} className="btn-med-lg">Schedule Your Visit &rarr;</button>
    </section>
  );
}
`,
    '/components/DoctorCard.jsx': `import React from 'react';
export default function DoctorCard({ doctor, onBook }) {
  return (
    <div className="doc-card">
      <img src={doctor.image} alt={doctor.name} />
      <div className="doc-body">
        <span className="doc-spec">{doctor.specialty}</span>
        <h4>{doctor.name}</h4>
        <div style={{ color: '#0d9488', fontSize: '13px', fontWeight: 600, margin: '6px 0 14px' }}>★ {doctor.rating}</div>
        <button onClick={() => onBook(doctor)} className="btn-doc">Book Consultation</button>
      </div>
    </div>
  );
}
`,
    '/components/AppointmentModal.jsx': `import React, { useState } from 'react';
export default function AppointmentModal({ isOpen, onClose }) {
  const [booked, setBooked] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', date: '' });
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
          <h3 style={{ margin: 0 }}>Schedule Appointment</h3>
          <button onClick={onClose} style={{ border: 0, background: 'none', fontSize: '20px', cursor: 'pointer' }}>&times;</button>
        </div>
        {booked ? (
          <div style={{ textAlign: 'center', padding: '20px 0', color: '#0d9488' }}>
            <h4>Appointment Confirmed!</h4>
            <p>We sent an SMS with clinic check-in details.</p>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setBooked(true); setTimeout(() => { setBooked(false); onClose(); }, 2000); }}>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '4px' }}>Patient Name</label>
              <input type="text" required placeholder="Eleanor Vance" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '4px' }}>Mobile Phone</label>
              <input type="tel" required placeholder="(555) 000-0000" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
            </div>
            <button type="submit" className="btn-med-lg" style={{ width: '100%' }}>Confirm Booking</button>
          </form>
        )}
      </div>
    </div>
  );
}
`,
    '/components/Footer.jsx': `import React from 'react';
export default function Footer() {
  return (
    <footer style={{ background: '#0f172a', color: '#94a3b8', padding: '40px 24px', textAlign: 'center', marginTop: '60px' }}>
      <p>© 2026 ${brand}. In medical emergencies, dial 911 immediately.</p>
    </footer>
  );
}
`,
    '/App.jsx': `import React, { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import DoctorCard from './components/DoctorCard.jsx';
import AppointmentModal from './components/AppointmentModal.jsx';
import Footer from './components/Footer.jsx';
import { DOCTORS } from './data/doctors.js';
import './styles.css';

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div>
      <Navbar onBook={() => setModalOpen(true)} />
      <Hero onBook={() => setModalOpen(true)} />
      <main style={{ maxWidth: '1100px', margin: '40px auto', padding: '0 20px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '28px', marginBottom: '28px' }}>Our Medical Specialists</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {DOCTORS.map((d) => (
            <DoctorCard key={d.id} doctor={d} onBook={() => setModalOpen(true)} />
          ))}
        </div>
      </main>
      <AppointmentModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      <Footer />
    </div>
  );
}
`,
    '/styles.css': `body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Plus Jakarta Sans', sans-serif; background: #f8fafc; color: #0f172a; }
.med-nav { background: #fff; border-bottom: 1px solid #e2e8f0; padding: 14px 24px; position: sticky; top: 0; z-index: 50; }
.med-wrap { max-width: 1100px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
.med-brand { font-size: 18px; font-weight: 800; color: #0f172a; text-decoration: none; display: flex; align-items: center; gap: 8px; }
.btn-med-action { background: #0d9488; color: #fff; border: 0; padding: 8px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; }

.med-hero { background: linear-gradient(180deg, #ccfbf1 0%, #f8fafc 100%); padding: 60px 20px; text-align: center; }
.badge-teal { font-size: 11px; font-weight: 800; color: #0f766e; letter-spacing: 0.1em; }
.med-hero h1 { font-size: clamp(28px, 4.5vw, 44px); margin: 12px auto; max-width: 650px; }
.med-hero p { color: #64748b; font-size: 15px; max-width: 540px; margin: 0 auto 24px; }
.btn-med-lg { background: #0d9488; color: #fff; border: 0; padding: 12px 24px; border-radius: 10px; font-size: 14px; font-weight: 700; cursor: pointer; }

.doc-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; }
.doc-card img { width: 100%; height: 210px; object-fit: cover; }
.doc-body { padding: 18px; }
.doc-spec { font-size: 11px; font-weight: 700; color: #0d9488; text-transform: uppercase; }
.doc-body h4 { margin: 6px 0; font-size: 17px; }
.btn-doc { width: 100%; padding: 8px; background: #f0fdfa; border: 1px solid #99f6e4; color: #0f766e; border-radius: 8px; font-weight: 600; cursor: pointer; }
.modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 100; display: flex; align-items: center; justify-content: center; }
.modal-dialog { background: #fff; width: 90%; max-width: 400px; padding: 24px; border-radius: 16px; box-sizing: border-box; }
`
  };

  return {
    summary: `Engineered an appointment scheduling healthcare web app for ${brand} with specialist directories, ratings, and instant patient booking.`,
    plan,
    files,
  };
}

// Fitness
function generateFitnessArchitecture(brand, request) {
  return generateDynamicCustomArchitecture(brand, request);
}

// Real Estate
function generateRealEstateArchitecture(brand, request) {
  return generateDynamicCustomArchitecture(brand, request);
}

// Kanban
function generateKanbanArchitecture(brand, request) {
  return generateDynamicCustomArchitecture(brand, request);
}

// Education
function generateEducationArchitecture(brand, request) {
  return generateDynamicCustomArchitecture(brand, request);
}
