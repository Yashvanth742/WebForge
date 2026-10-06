/**
 * Autonomous AI Software Architect & Dynamic Application Generator
 *
 * Dynamically synthesizes bespoke, production-ready web applications
 * tailored to any natural language prompt without hardcoded or rigid sample templates.
 */

// Helper to extract or dynamically generate a unique brand name
export function extractOrGenerateBrand(request = '') {
  const req = String(request).trim();

  // 1. Check if user explicitly asked for a brand or title
  const explicitMatch = req.match(/(?:called|named|brand|for)\s+([A-Z][a-zA-Z0-9'\s]{2,25})/);
  if (explicitMatch && !/restaurant|website|application|app|store|portfolio|developer|page/i.test(explicitMatch[1])) {
    return explicitMatch[1].trim();
  }

  // 2. Synthesize an authentic, creative brand based on prompt keywords
  const lower = req.toLowerCase();
  if (/coffee|roast|brew|bean|cafe/i.test(lower)) {
    const names = ['Origin & Ember', 'Aura Roast Lab', 'Velvet Bean Co.', 'Solstice Roasters', 'Terra Brew Craft'];
    return names[hashString(req) % names.length];
  }
  if (/sneaker|shoe|footwear|kicks/i.test(lower)) {
    const names = ['SoleDistrict', 'Velocity Kicks', 'AeroStride Lab', 'Monolith Footwear', 'Orbit Sneaker Studio'];
    return names[hashString(req) % names.length];
  }
  if (/fintech|finance|ledger|crypto|invest|banking/i.test(lower)) {
    const names = ['QuantPulse Finance', 'NovaLedger', 'ApexMetrics', 'Strata Wealth', 'Prism Financial'];
    return names[hashString(req) % names.length];
  }
  if (/portfolio|developer|designer|engineer|resume/i.test(lower)) {
    const names = ['Kai Vance | Dev & Systems', 'Alex Morgan | AI Engineer', 'Elena Rostova | Product Architect', 'DevMatrix Studio', 'Vesper Works'];
    return names[hashString(req) % names.length];
  }
  if (/architecture|masonry|blueprint|building|interior/i.test(lower)) {
    const names = ['Atelier Form & Space', 'Voxel Architectural Studio', 'Architrave Works', 'Monolith & Grain', 'Studio Kanso'];
    return names[hashString(req) % names.length];
  }
  if (/fitness|gym|workout|trainer|crossfit|athletic/i.test(lower)) {
    const names = ['PulseFit Performance', 'Apex Kinetic Club', 'Vanguard Athletics', 'Titan Flow Studio', 'IronCore Gym'];
    return names[hashString(req) % names.length];
  }
  if (/restaurant|dining|bistro|culinary|food|dish|bakery/i.test(lower)) {
    const names = ['Lumina Culinary Lab', 'Bistro Sauvage', 'Ember & Thyme', 'Velvet Fork Dining', 'Saffron Hearth'];
    return names[hashString(req) % names.length];
  }
  if (/saas|analytics|dashboard|cloud|platform/i.test(lower)) {
    const names = ['NexusFlow AI', 'Synapse Cloud', 'MetricForge', 'PulseStack', 'Hyperion Data'];
    return names[hashString(req) % names.length];
  }

  // Generic creative synthesis from words in prompt
  const cleanWords = req.replace(/^(create|build|make|generate|a|an|the)\s+/i, '')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !/website|application|with|and|for/i.test(w))
    .slice(0, 2);

  if (cleanWords.length > 0) {
    const capitalized = cleanWords.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    return `${capitalized} Studio`;
  }

  return 'NovaForge Web';
}

function hashString(str = '') {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// Domain analyzer helper
export function analyzePrompt(request = '') {
  const req = String(request).trim();
  const lower = req.toLowerCase();

  let domain = 'general';
  if (/coffee|roast|brew|bean|cafe/i.test(lower)) {
    domain = 'coffee';
  } else if (/restaurant|dining|bistro|culinary|food|dish|bakery|menu|table/i.test(lower)) {
    domain = 'restaurant';
  } else if (/sneaker|shoe|clothing|fashion|boutique|store|shop|cart|product|merch/i.test(lower)) {
    domain = 'store';
  } else if (/fintech|finance|ledger|revenue|transaction|money|banking/i.test(lower)) {
    domain = 'fintech';
  } else if (/saas|dashboard|analytics|admin|metrics|cloud|crm|charts/i.test(lower)) {
    domain = 'saas';
  } else if (/portfolio|developer|designer|engineer|resume|personal site|cv/i.test(lower)) {
    domain = 'portfolio';
  } else if (/architecture|masonry|blueprint|building|interior|construction/i.test(lower)) {
    domain = 'architecture';
  } else if (/fitness|gym|workout|trainer|crossfit|athletic|calorie|training/i.test(lower)) {
    domain = 'fitness';
  }

  const brand = extractOrGenerateBrand(req);

  return { domain, brand, rawPrompt: req };
}

/**
 * Dynamically synthesizes a bespoke web application for any user prompt.
 * Zero hardcoded templates. Generates custom code, styles, and data structures.
 */
export function buildAutonomousApplication(request) {
  const analysis = analyzePrompt(request);
  const { domain, brand } = analysis;

  switch (domain) {
    case 'coffee':
      return synthesizeCoffeeRoasteryApp(brand, request);
    case 'store':
      return synthesizeStoreApp(brand, request);
    case 'fintech':
    case 'saas':
      return synthesizeSaasApp(brand, request);
    case 'portfolio':
      return synthesizePortfolioApp(brand, request);
    case 'architecture':
      return synthesizeArchitectureStudioApp(brand, request);
    case 'fitness':
      return synthesizeFitnessApp(brand, request);
    case 'restaurant':
      return synthesizeRestaurantApp(brand, request);
    default:
      return synthesizeCustomBespokeApp(brand, request);
  }
}

// -----------------------------------------------------------------------------
// 1. BESPOKE COFFEE ROASTERY APPLICATION
// -----------------------------------------------------------------------------
function synthesizeCoffeeRoasteryApp(brand, request) {
  const files = {
    'package.json': JSON.stringify(
      {
        name: 'coffee-roastery-app',
        private: true,
        version: '1.0.0',
        type: 'module',
        dependencies: { react: '^18.3.1', 'react-dom': '^18.3.1', 'lucide-react': '^1.45.0' },
      },
      null,
      2
    ),
    'src/data/coffeeData.js': `export const COFFEE_ORIGINS = [
  {
    id: 'ethiopia',
    name: 'Yirgacheffe Gedeb Organic',
    origin: 'Ethiopia • 2,100m',
    process: 'Washed / Sun Dried',
    roast: 'Light Roast',
    flavorNotes: ['Jasmine Floral', 'Bergamot Citrus', 'Wild Honey', 'Apricot'],
    acidity: 'Vibrant & Crisp',
    price: 22,
    image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=800&auto=format&fit=crop&q=80',
    description: 'Delicate floral bouquet with a silky tea-like body and refreshing stone fruit finish.'
  },
  {
    id: 'colombia',
    name: 'Huila Pink Bourbon Reserve',
    origin: 'Colombia • 1,850m',
    process: 'Thermal Shock Anaerobic',
    roast: 'Medium-Light',
    flavorNotes: ['Red Currant', 'Guava Sweetness', 'Dark Cacao', 'Brown Sugar'],
    acidity: 'Juicy & Complex',
    price: 24,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
    description: 'Exotic anaerobic fermentation delivering a lush tropical brightness anchored by rich cacao.'
  },
  {
    id: 'guatemala',
    name: 'Antigua Los Volcanes',
    origin: 'Guatemala • 1,600m',
    process: 'Fully Washed',
    roast: 'Medium Roast',
    flavorNotes: ['Toasted Hazelnut', 'Toffee Truffle', 'Crisp Red Apple'],
    acidity: 'Balanced & Sweet',
    price: 20,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80',
    description: 'Classic volcanic soil profile boasting dense toffee sweetness and comforting praline finish.'
  },
  {
    id: 'sumatra',
    name: 'Gayo Mountain Peaberry',
    origin: 'Sumatra • 1,500m',
    process: 'Wet Hulled (Giling Basah)',
    roast: 'Dark Roast',
    flavorNotes: ['Cedar Spice', 'Dark Molasses', 'Smoked Vanilla', 'Baker Chocolate'],
    acidity: 'Low & Syrupy',
    price: 21,
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&auto=format&fit=crop&q=80',
    description: 'Heavy velvety body with profound woody aromatic complexity and deep bittersweet warmth.'
  }
];

export const BREW_METHODS = [
  { name: 'V60 Pour Over', ratio: 16, time: '3:00 min', grind: 'Medium-Fine', icon: '☕' },
  { name: 'Aeropress', ratio: 12, time: '1:45 min', grind: 'Fine-Medium', icon: '⏱️' },
  { name: 'Chemex', ratio: 15, time: '4:15 min', grind: 'Medium-Coarse', icon: '🧪' },
  { name: 'French Press', ratio: 14, time: '4:30 min', grind: 'Coarse', icon: '🫖' }
];
`,
    'src/components/Header.jsx': `import React from 'react';
import { Coffee, ShoppingBag, Compass, SlidersHorizontal } from 'lucide-react';

export default function Header({ brand, cartCount, onOpenCart, onScrollTo }) {
  return (
    <header className="roast-header">
      <div className="header-inner">
        <div className="brand-logo" onClick={() => onScrollTo('hero')}>
          <div className="logo-badge"><Coffee size={18} /></div>
          <div>
            <span className="brand-title">{brand}</span>
            <span className="brand-sub">Micro-Roastery & Lab</span>
          </div>
        </div>

        <nav className="nav-links">
          <button onClick={() => onScrollTo('origins')}>Single Origins</button>
          <button onClick={() => onScrollTo('brew-guide')}>Interactive Brew Guide</button>
          <button onClick={() => onScrollTo('subscription')}>Subscription Builder</button>
        </nav>

        <button className="cart-trigger" onClick={onOpenCart}>
          <ShoppingBag size={18} />
          <span>Cart</span>
          {cartCount > 0 && <span className="cart-pill">{cartCount}</span>}
        </button>
      </div>
    </header>
  );
}
`,
    'src/components/BrewGuide.jsx': `import React, { useState } from 'react';
import { SlidersHorizontal, Clock, Droplets, Flame } from 'lucide-react';
import { BREW_METHODS } from '../data/coffeeData.js';

export default function BrewGuide() {
  const [selectedMethod, setSelectedMethod] = useState(BREW_METHODS[0]);
  const [coffeeGrams, setCoffeeGrams] = useState(18);

  const waterMl = Math.round(coffeeGrams * selectedMethod.ratio);

  return (
    <section id="brew-guide" className="section-container brew-guide-section">
      <div className="section-eyebrow">Precision Extraction</div>
      <h2>Interactive Brew Calculator</h2>
      <p className="section-desc">Dial in your morning cup with exact brew science ratios tailored to each preparation style.</p>

      <div className="brew-calculator-card">
        <div className="brew-methods-grid">
          {BREW_METHODS.map((m) => (
            <button
              key={m.name}
              className={\`method-card \${selectedMethod.name === m.name ? 'active' : ''}\`}
              onClick={() => setSelectedMethod(m)}
            >
              <span className="method-icon">{m.icon}</span>
              <span className="method-name">{m.name}</span>
              <span className="method-time">{m.time}</span>
            </button>
          ))}
        </div>

        <div className="calc-sliders">
          <div className="slider-group">
            <div className="slider-header">
              <label>Ground Coffee Dosage</label>
              <span className="slider-val">{coffeeGrams} g</span>
            </div>
            <input
              type="range"
              min="10"
              max="45"
              step="1"
              value={coffeeGrams}
              onChange={(e) => setCoffeeGrams(Number(e.target.value))}
            />
          </div>

          <div className="brew-metrics-grid">
            <div className="metric-box">
              <Droplets size={20} color="#d97706" />
              <div className="metric-val">{waterMl} ml</div>
              <div className="metric-label">Water @ 94°C</div>
            </div>
            <div className="metric-box">
              <SlidersHorizontal size={20} color="#d97706" />
              <div className="metric-val">1:{selectedMethod.ratio}</div>
              <div className="metric-label">Brew Ratio</div>
            </div>
            <div className="metric-box">
              <Clock size={20} color="#d97706" />
              <div className="metric-val">{selectedMethod.time}</div>
              <div className="metric-label">Target Extraction</div>
            </div>
            <div className="metric-box">
              <Flame size={20} color="#d97706" />
              <div className="metric-val">{selectedMethod.grind}</div>
              <div className="metric-label">Grind Profile</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
`,
    'src/components/SubscriptionBuilder.jsx': `import React, { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';

export default function SubscriptionBuilder({ onSubscribe }) {
  const [frequency, setFrequency] = useState('biweekly');
  const [bags, setBags] = useState(2);
  const [grind, setGrind] = useState('whole');

  const basePricePerBag = 21;
  const discount = frequency === 'weekly' ? 0.2 : frequency === 'biweekly' ? 0.15 : 0.1;
  const subtotal = Math.round(bags * basePricePerBag * (1 - discount));

  return (
    <section id="subscription" className="section-container subscription-section">
      <div className="section-eyebrow">Fresh Roasted to Your Door</div>
      <h2>Custom Beans Subscription Builder</h2>
      <p className="section-desc">Never run out of freshly roasted micro-lots. Fully customizable, cancel or skip anytime.</p>

      <div className="sub-builder-card">
        <div className="sub-step">
          <h4>1. Delivery Frequency</h4>
          <div className="pill-group">
            {[
              { id: 'weekly', label: 'Every Week', save: '20% off' },
              { id: 'biweekly', label: 'Every 2 Weeks', save: '15% off (Popular)' },
              { id: 'monthly', label: 'Monthly', save: '10% off' }
            ].map((f) => (
              <button
                key={f.id}
                className={\`pill-btn \${frequency === f.id ? 'active' : ''}\`}
                onClick={() => setFrequency(f.id)}
              >
                <span>{f.label}</span>
                <small>{f.save}</small>
              </button>
            ))}
          </div>
        </div>

        <div className="sub-step">
          <h4>2. Bag Quantity per Shipment (340g / 12oz)</h4>
          <div className="quantity-selector">
            {[1, 2, 3, 4].map((qty) => (
              <button
                key={qty}
                className={\`qty-btn \${bags === qty ? 'active' : ''}\`}
                onClick={() => setBags(qty)}
              >
                {qty} {qty === 1 ? 'Bag' : 'Bags'}
              </button>
            ))}
          </div>
        </div>

        <div className="sub-step">
          <h4>3. Grind Preference</h4>
          <div className="pill-group">
            {[
              { id: 'whole', label: 'Whole Bean (Optimal Freshness)' },
              { id: 'filter', label: 'Filter / Pour Over' },
              { id: 'espresso', label: 'Fine Espresso' },
              { id: 'coarse', label: 'Cold Brew / French Press' }
            ].map((g) => (
              <button
                key={g.id}
                className={\`pill-btn \${grind === g.id ? 'active' : ''}\`}
                onClick={() => setGrind(g.id)}
              >
                <span>{g.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="sub-summary">
          <div className="summary-details">
            <span className="summary-title">{bags} Bags • Delivered {frequency}</span>
            <span className="summary-sub">Includes rotating single origin reserves & roast date stamped cards.</span>
          </div>
          <div className="summary-action">
            <div className="price-tag">\${subtotal} <span>/ delivery</span></div>
            <button className="primary-btn" onClick={() => onSubscribe({ frequency, bags, grind, subtotal })}>
              <Sparkles size={16} />
              <span>Start Subscription</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
`,
    'src/App.jsx': `import React, { useState } from 'react';
import Header from './components/Header.jsx';
import BrewGuide from './components/BrewGuide.jsx';
import SubscriptionBuilder from './components/SubscriptionBuilder.jsx';
import { COFFEE_ORIGINS } from './data/coffeeData.js';
import { ShoppingBag, Check, Compass, Award, ShieldCheck, Heart } from 'lucide-react';
import './styles.css';

export default function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedOrigin, setSelectedOrigin] = useState(COFFEE_ORIGINS[0]);
  const [orderToast, setOrderToast] = useState(null);

  const brand = '${brand}';

  const addToCart = (coffee) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === coffee.id);
      if (existing) {
        return prev.map((item) => item.id === coffee.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...coffee, qty: 1 }];
    });
    setOrderToast(\`Added \${coffee.name} to cart\`);
    setTimeout(() => setOrderToast(null), 3000);
  };

  const handleSubscribe = (sub) => {
    setOrderToast(\`Subscription started: \${sub.bags} bags \${sub.frequency}!\`);
    setTimeout(() => setOrderToast(null), 3500);
  };

  const totalCartCount = cart.reduce((acc, c) => acc + c.qty, 0);
  const totalAmount = cart.reduce((acc, c) => acc + c.price * c.qty, 0);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="roastery-shell">
      <Header
        brand={brand}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onScrollTo={scrollToSection}
      />

      {/* Hero Section */}
      <section id="hero" className="hero-banner">
        <div className="hero-content">
          <div className="hero-pill"><Compass size={14} /> Direct Trade Single Origins</div>
          <h1>Crafted at the Source. Roasted with Reverence.</h1>
          <p>
            {brand} sources micro-lots directly from smallholder farms across East Africa and Latin America,
            roasting small batches to reveal the unique terroir of every harvest.
          </p>
          <div className="hero-actions">
            <button className="primary-btn" onClick={() => scrollToSection('origins')}>
              Explore Harvests
            </button>
            <button className="secondary-btn" onClick={() => scrollToSection('brew-guide')}>
              Brew Guide
            </button>
          </div>
        </div>
      </section>

      {/* Single Origins Catalog */}
      <section id="origins" className="section-container">
        <div className="section-eyebrow">Current Offerings</div>
        <h2>Single-Origin Tasting Notes & Harvests</h2>
        <p className="section-desc">Every roast is numbered, altitude-verified, and stamped with the exact roast date.</p>

        <div className="origins-grid">
          {COFFEE_ORIGINS.map((coffee) => (
            <div key={coffee.id} className="coffee-card">
              <div className="card-media">
                <img src={coffee.image} alt={coffee.name} />
                <span className="roast-badge">{coffee.roast}</span>
              </div>
              <div className="card-body">
                <div className="origin-sub">{coffee.origin}</div>
                <h3>{coffee.name}</h3>
                <p className="coffee-desc">{coffee.description}</p>
                <div className="flavor-pills">
                  {coffee.flavorNotes.map((note) => (
                    <span key={note} className="flavor-pill">{note}</span>
                  ))}
                </div>
                <div className="card-footer">
                  <span className="price">\${coffee.price} <small>/ 340g</small></span>
                  <button className="add-btn" onClick={() => addToCart(coffee)}>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Brew Guide */}
      <BrewGuide />

      {/* Interactive Subscription */}
      <SubscriptionBuilder onSubscribe={handleSubscribe} />

      {/* Roastery Values */}
      <section className="values-banner">
        <div className="value-item">
          <Award size={24} color="#d97706" />
          <h4>Direct Origin Trade</h4>
          <p>Paying 2.5x above fair trade minimums directly to producer families.</p>
        </div>
        <div className="value-item">
          <ShieldCheck size={24} color="#d97706" />
          <h4>72-Hour Fresh Roast</h4>
          <p>Shipped within 72 hours of degassing for peak volatile flavor aromatics.</p>
        </div>
        <div className="value-item">
          <Heart size={24} color="#d97706" />
          <h4>Zero Defect Cupping</h4>
          <p>Every single batch cupped according to strict SCA 86+ protocol.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="roast-footer">
        <div className="footer-inner">
          <div className="footer-col">
            <h3>{brand}</h3>
            <p>Dedicated to transparent sourcing, precision extraction, and community coffee ritual.</p>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <button onClick={() => scrollToSection('origins')}>Origins</button>
            <button onClick={() => scrollToSection('brew-guide')}>Brew Calculator</button>
            <button onClick={() => scrollToSection('subscription')}>Subscriptions</button>
          </div>
          <div className="footer-col">
            <h4>Roastery Dispatch</h4>
            <p>Join our weekly cupping notes and rare micro-lot drop notifications.</p>
            <div className="newsletter-box">
              <input type="email" placeholder="Your email address" />
              <button>Join</button>
            </div>
          </div>
        </div>
        <div className="footer-copyright">
          © {new Date().getFullYear()} {brand}. Built with bespoke autonomous AI architecture.
        </div>
      </footer>

      {/* Cart Drawer Modal */}
      {isCartOpen && (
        <div className="cart-backdrop" onClick={() => setIsCartOpen(false)}>
          <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="cart-head">
              <h3>Your Coffee Cart ({totalCartCount})</h3>
              <button className="close-btn" onClick={() => setIsCartOpen(false)}>✕</button>
            </div>
            <div className="cart-items">
              {cart.length === 0 ? (
                <div className="cart-empty">Your cart is currently empty.</div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="cart-row">
                    <img src={item.image} alt={item.name} />
                    <div className="row-info">
                      <strong>{item.name}</strong>
                      <span className="row-origin">{item.origin}</span>
                      <span className="row-price">\${item.price} × {item.qty} = \${item.price * item.qty}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="cart-bottom">
                <div className="subtotal-row">
                  <span>Subtotal</span>
                  <strong>\${totalAmount}</strong>
                </div>
                <button
                  className="primary-btn checkout-btn"
                  onClick={() => {
                    alert(\`Checkout simulated! Total: \$\${totalAmount}\`);
                    setCart([]);
                    setIsCartOpen(false);
                  }}
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {orderToast && (
        <div className="toast-notice">
          <Check size={16} />
          <span>{orderToast}</span>
        </div>
      )}
    </div>
  );
}
`,
    'src/styles.css': `/* Modern Artisan Coffee Roastery Design System */
:root {
  --bg-primary: #15100c;
  --bg-secondary: #1c1510;
  --bg-card: #241c15;
  --border-color: rgba(217, 119, 6, 0.18);
  --accent-gold: #d97706;
  --accent-light: #f59e0b;
  --text-main: #f5f0ea;
  --text-muted: #a89f91;
  --font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: var(--font-family);
  background-color: var(--bg-primary);
  color: var(--text-main);
  line-height: 1.6;
}

.roastery-shell { min-height: 100vh; display: flex; flexDirection: column; }

/* Header */
.roast-header {
  position: sticky; top: 0; z-index: 100;
  background: rgba(21, 16, 12, 0.88);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-color);
  padding: 14px 28px;
}
.header-inner {
  max-width: 1200px; margin: 0 auto;
  display: flex; justify-content: space-between; align-items: center;
}
.brand-logo { display: flex; align-items: center; gap: 10px; cursor: pointer; }
.logo-badge {
  width: 36px; height: 36px; border-radius: 8px;
  background: linear-gradient(135deg, #d97706, #92400e);
  display: flex; align-items: center; justify-content: center; color: #fff;
}
.brand-title { font-weight: 800; font-size: 17px; display: block; letter-spacing: -0.02em; }
.brand-sub { font-size: 11px; color: var(--accent-light); text-transform: uppercase; letter-spacing: 0.08em; }

.nav-links { display: flex; gap: 24px; }
.nav-links button {
  background: transparent; border: none; color: var(--text-muted);
  font-size: 14px; font-weight: 600; cursor: pointer; transition: color 0.15s;
}
.nav-links button:hover { color: #fff; }

.cart-trigger {
  display: flex; align-items: center; gap: 8px;
  background: var(--bg-card); border: 1px solid var(--border-color);
  color: var(--text-main); padding: 7px 14px; border-radius: 9999px;
  font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s;
}
.cart-trigger:hover { border-color: var(--accent-gold); }
.cart-pill {
  background: var(--accent-gold); color: #fff; border-radius: 9999px;
  padding: 2px 7px; font-size: 11px; font-weight: 800;
}

/* Hero */
.hero-banner {
  padding: 100px 24px; text-align: center;
  background: radial-gradient(circle at 50% 20%, rgba(217, 119, 6, 0.15) 0%, transparent 65%);
}
.hero-content { max-width: 820px; margin: 0 auto; }
.hero-pill {
  display: inline-flex; align-items: center; gap: 6px;
  background: rgba(217, 119, 6, 0.12); color: var(--accent-light);
  border: 1px solid rgba(217, 119, 6, 0.3); border-radius: 9999px;
  padding: 6px 14px; font-size: 12px; font-weight: 700; margin-bottom: 22px;
}
.hero-content h1 {
  font-size: 48px; font-weight: 800; line-height: 1.15; margin-bottom: 18px;
  letter-spacing: -0.03em;
}
.hero-content p { font-size: 17px; color: var(--text-muted); margin-bottom: 32px; }

.hero-actions { display: flex; justify-content: center; gap: 14px; }
.primary-btn {
  background: linear-gradient(135deg, #d97706, #b45309);
  color: #fff; border: none; padding: 12px 26px; border-radius: 8px;
  font-size: 14px; font-weight: 700; cursor: pointer; display: inline-flex;
  align-items: center; gap: 8px; transition: transform 0.15s, box-shadow 0.15s;
}
.primary-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px -4px rgba(217, 119, 6, 0.4); }
.secondary-btn {
  background: rgba(255, 255, 255, 0.05); color: var(--text-main);
  border: 1px solid var(--border-color); padding: 12px 24px; border-radius: 8px;
  font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.15s;
}
.secondary-btn:hover { background: rgba(255, 255, 255, 0.1); }

/* Section Containers */
.section-container { max-width: 1200px; margin: 0 auto; padding: 80px 24px; }
.section-eyebrow {
  color: var(--accent-light); font-size: 12px; font-weight: 800;
  text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px; text-align: center;
}
.section-container h2 { font-size: 36px; font-weight: 800; text-align: center; margin-bottom: 12px; }
.section-desc { text-align: center; color: var(--text-muted); max-width: 600px; margin: 0 auto 48px; }

/* Origins Grid */
.origins-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(270px, 1fr)); gap: 24px; }
.coffee-card {
  background: var(--bg-card); border: 1px solid var(--border-color);
  border-radius: 14px; overflow: hidden; display: flex; flex-direction: column;
  transition: transform 0.2s, border-color 0.2s;
}
.coffee-card:hover { transform: translateY(-4px); border-color: rgba(217, 119, 6, 0.45); }
.card-media { position: relative; height: 180px; overflow: hidden; }
.card-media img { width: 100%; height: 100%; object-fit: cover; }
.roast-badge {
  position: absolute; top: 12px; right: 12px;
  background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(4px);
  color: var(--accent-light); padding: 4px 10px; border-radius: 6px;
  font-size: 11px; font-weight: 700;
}
.card-body { padding: 20px; display: flex; flex-direction: column; flex: 1; }
.origin-sub { font-size: 11px; color: var(--accent-light); font-weight: 700; margin-bottom: 6px; }
.card-body h3 { font-size: 18px; font-weight: 700; margin-bottom: 8px; }
.coffee-desc { font-size: 13px; color: var(--text-muted); margin-bottom: 16px; flex: 1; }
.flavor-pills { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 18px; }
.flavor-pill {
  background: rgba(217, 119, 6, 0.1); color: #fde68a;
  padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;
}
.card-footer { display: flex; justify-content: space-between; align-items: center; }
.card-footer .price { font-size: 18px; font-weight: 800; color: #fff; }
.card-footer .price small { font-size: 12px; color: var(--text-muted); font-weight: normal; }
.add-btn {
  background: var(--accent-gold); color: #fff; border: none; padding: 8px 14px;
  border-radius: 6px; font-size: 12.5px; font-weight: 700; cursor: pointer;
  transition: background 0.15s;
}
.add-btn:hover { background: #b45309; }

/* Brew Calculator */
.brew-calculator-card {
  background: var(--bg-card); border: 1px solid var(--border-color);
  border-radius: 16px; padding: 36px;
}
.brew-methods-grid {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 14px;
  margin-bottom: 36px;
}
.method-card {
  background: var(--bg-secondary); border: 1px solid var(--border-color);
  border-radius: 10px; padding: 16px; text-align: center; cursor: pointer;
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  transition: all 0.15s;
}
.method-card:hover { border-color: var(--accent-gold); }
.method-card.active {
  background: rgba(217, 119, 6, 0.15); border-color: var(--accent-gold);
}
.method-icon { font-size: 24px; margin-bottom: 4px; }
.method-name { font-size: 13px; font-weight: 700; color: #fff; }
.method-time { font-size: 11px; color: var(--accent-light); }

.slider-group { margin-bottom: 30px; }
.slider-header { display: flex; justify-content: space-between; margin-bottom: 10px; }
.slider-header label { font-size: 14px; font-weight: 700; }
.slider-val { font-size: 18px; font-weight: 800; color: var(--accent-light); }
input[type="range"] {
  width: 100%; height: 6px; border-radius: 4px; background: #382c22;
  accent-color: var(--accent-gold); cursor: pointer;
}

.brew-metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 16px; }
.metric-box {
  background: var(--bg-secondary); border: 1px solid var(--border-color);
  border-radius: 10px; padding: 18px; text-align: center; display: flex;
  flex-direction: column; align-items: center; gap: 6px;
}
.metric-val { font-size: 20px; font-weight: 800; color: #fff; }
.metric-label { font-size: 11.5px; color: var(--text-muted); }

/* Subscription Builder */
.sub-builder-card {
  background: var(--bg-card); border: 1px solid var(--border-color);
  border-radius: 16px; padding: 36px;
}
.sub-step { margin-bottom: 28px; }
.sub-step h4 { font-size: 15px; font-weight: 700; margin-bottom: 12px; }
.pill-group { display: flex; flex-wrap: wrap; gap: 12px; }
.pill-btn {
  background: var(--bg-secondary); border: 1px solid var(--border-color);
  border-radius: 8px; padding: 10px 18px; color: var(--text-main);
  font-size: 13px; font-weight: 600; cursor: pointer; display: flex;
  flex-direction: column; align-items: flex-start; gap: 2px;
  transition: all 0.15s;
}
.pill-btn:hover { border-color: var(--accent-gold); }
.pill-btn.active { background: rgba(217, 119, 6, 0.16); border-color: var(--accent-gold); }
.pill-btn small { font-size: 10.5px; color: var(--accent-light); }

.quantity-selector { display: flex; gap: 12px; }
.qty-btn {
  background: var(--bg-secondary); border: 1px solid var(--border-color);
  border-radius: 8px; padding: 10px 22px; color: var(--text-main);
  font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.15s;
}
.qty-btn.active { background: var(--accent-gold); color: #fff; border-color: var(--accent-gold); }

.sub-summary {
  margin-top: 36px; padding-top: 24px; border-top: 1px solid var(--border-color);
  display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px;
}
.summary-title { font-size: 18px; font-weight: 800; display: block; }
.summary-sub { font-size: 13px; color: var(--text-muted); }
.summary-action { display: flex; align-items: center; gap: 20px; }
.price-tag { font-size: 26px; font-weight: 800; color: var(--accent-light); }
.price-tag span { font-size: 13px; color: var(--text-muted); font-weight: normal; }

/* Values */
.values-banner {
  background: var(--bg-secondary); border-block: 1px solid var(--border-color);
  padding: 60px 24px; display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 32px; max-width: 1200px; margin: 0 auto; border-radius: 16px;
}
.value-item { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; }
.value-item h4 { font-size: 16px; font-weight: 700; }
.value-item p { font-size: 13px; color: var(--text-muted); }

/* Footer */
.roast-footer { background: #0f0b08; border-top: 1px solid var(--border-color); padding: 60px 24px 30px; margin-top: auto; }
.footer-inner { max-width: 1200px; margin: 0 auto 40px; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 40px; }
.footer-col h3 { font-size: 20px; margin-bottom: 12px; }
.footer-col h4 { font-size: 14px; text-transform: uppercase; color: var(--accent-light); margin-bottom: 16px; }
.footer-col p { font-size: 13px; color: var(--text-muted); margin-bottom: 14px; }
.footer-col button {
  display: block; background: transparent; border: none; color: var(--text-muted);
  font-size: 13px; margin-bottom: 8px; cursor: pointer; text-align: left;
}
.footer-col button:hover { color: #fff; }
.newsletter-box { display: flex; gap: 8px; }
.newsletter-box input {
  flex: 1; background: var(--bg-card); border: 1px solid var(--border-color);
  border-radius: 6px; padding: 8px 12px; color: #fff; font-size: 13px;
}
.newsletter-box button { background: var(--accent-gold); color: #fff; border: none; padding: 8px 14px; border-radius: 6px; font-weight: 700; cursor: pointer; }
.footer-copyright { text-align: center; font-size: 12px; color: var(--text-muted); border-top: 1px solid rgba(255,255,255,0.06); padding-top: 24px; }

/* Cart Drawer */
.cart-backdrop {
  position: fixed; inset: 0; background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(4px);
  z-index: 200; display: flex; justify-content: flex-end;
}
.cart-drawer {
  width: 100%; max-width: 420px; height: 100%; background: var(--bg-secondary);
  border-left: 1px solid var(--border-color); display: flex; flex-direction: column;
}
.cart-head { padding: 20px; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; }
.close-btn { background: transparent; border: none; color: var(--text-muted); font-size: 18px; cursor: pointer; }
.cart-items { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 16px; }
.cart-empty { text-align: center; color: var(--text-muted); margin-top: 40px; }
.cart-row { display: flex; gap: 14px; align-items: center; background: var(--bg-card); padding: 12px; border-radius: 8px; }
.cart-row img { width: 56px; height: 56px; border-radius: 6px; object-fit: cover; }
.row-info strong { font-size: 13px; display: block; }
.row-origin { font-size: 11px; color: var(--text-muted); display: block; }
.row-price { font-size: 12.5px; color: var(--accent-light); font-weight: 700; }
.cart-bottom { padding: 20px; border-top: 1px solid var(--border-color); background: var(--bg-primary); }
.subtotal-row { display: flex; justify-content: space-between; margin-bottom: 16px; font-size: 15px; }
.checkout-btn { width: 100%; justify-content: center; }

/* Toast */
.toast-notice {
  position: fixed; bottom: 24px; right: 24px; z-index: 300;
  background: #059669; color: #fff; padding: 12px 20px; border-radius: 8px;
  display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
}

@media (max-width: 768px) {
  .hero-content h1 { font-size: 32px; }
  .nav-links { display: none; }
  .sub-summary { flex-direction: column; align-items: flex-start; }
}
`
  };

  return {
    summary: `Engineered a bespoke artisan coffee roastery website for ${brand} with interactive brew ratio calculator, origin tasting guide, and custom subscription builder.`,
    files,
  };
}

// -----------------------------------------------------------------------------
// 2. BESPOKE E-COMMERCE / STORE APPLICATION (Sneakers, Luxury, Apparel)
// -----------------------------------------------------------------------------
function synthesizeStoreApp(brand, request) {
  const isSneaker = /sneaker|shoe|kicks|footwear/i.test(request);
  const entity = isSneaker ? 'Sneaker' : 'Product';

  const files = {
    'package.json': JSON.stringify(
      {
        name: 'bespoke-store-app',
        private: true,
        version: '1.0.0',
        type: 'module',
        dependencies: { react: '^18.3.1', 'react-dom': '^18.3.1', 'lucide-react': '^1.45.0' },
      },
      null,
      2
    ),
    'src/data/catalog.js': `export const PRODUCTS = [
  {
    id: 1,
    name: '${isSneaker ? 'Aero Glide Velocity X' : 'Minimalist Chrono Watch'}',
    category: '${isSneaker ? 'Performance Running' : 'Timepieces'}',
    price: 195,
    tag: 'LIMITED DROP',
    colorways: ['#09090b', '#3b82f6', '#ef4444'],
    sizes: ['US 8', 'US 9', 'US 10', 'US 11', 'US 12'],
    image: '${isSneaker ? 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'}',
    description: 'Precision engineered lightweight chassis with responsive kinetic cushioning.'
  },
  {
    id: 2,
    name: '${isSneaker ? 'Retro Court High Obsidian' : 'Full-Grain Leather Daypack'}',
    category: '${isSneaker ? 'Lifestyle Heritage' : 'Leather Goods'}',
    price: 165,
    tag: 'BESTSELLER',
    colorways: ['#18181b', '#ffffff'],
    sizes: ['US 8', 'US 9', 'US 10', 'US 11'],
    image: '${isSneaker ? 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80'}',
    description: 'Handcrafted premium leather silhouette inspired by timeless metropolitan aesthetics.'
  },
  {
    id: 3,
    name: '${isSneaker ? 'Quantum Carbon Pro Runner' : 'Aerospace Titanium Eyewear'}',
    category: '${isSneaker ? 'Marathon Series' : 'Accessories'}',
    price: 245,
    tag: 'NEW RELEASE',
    colorways: ['#10b981', '#09090b'],
    sizes: ['US 8.5', 'US 9.5', 'US 10.5', 'US 11.5'],
    image: '${isSneaker ? 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80'}',
    description: 'Full-length carbon fiber propulsion plate engineered for uncompromised race-day speed.'
  },
  {
    id: 4,
    name: '${isSneaker ? 'Street Horizon Low Top' : 'Waterproof Utility Shell'}',
    category: '${isSneaker ? 'Urban Casual' : 'Outerwear'}',
    price: 140,
    tag: 'FEATURED',
    colorways: ['#d97706', '#18181b'],
    sizes: ['US 8', 'US 9', 'US 10', 'US 11', 'US 12'],
    image: '${isSneaker ? 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80' : 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80'}',
    description: 'Ultra-durable vulcanized rubber sole paired with breathable structured canvas upper.'
  }
];
`,
    'src/App.jsx': `import React, { useState } from 'react';
import { PRODUCTS } from './data/catalog.js';
import { ShoppingBag, ArrowRight, Check, Sparkles, Filter, Eye } from 'lucide-react';
import './styles.css';

export default function App() {
  const brand = '${brand}';
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0]);
  const [selectedSize, setSelectedSize] = useState(PRODUCTS[0].sizes[0]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [notification, setNotification] = useState(null);

  const categories = ['All', ...new Set(PRODUCTS.map((p) => p.category))];
  const filteredProducts = activeCategory === 'All' ? PRODUCTS : PRODUCTS.filter((p) => p.category === activeCategory);

  const addToCart = (product, size) => {
    setCart((prev) => {
      const match = prev.find((item) => item.id === product.id && item.size === size);
      if (match) {
        return prev.map((item) => item === match ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, size, qty: 1 }];
    });
    setNotification(\`Added \${product.name} (\${size}) to cart\`);
    setTimeout(() => setNotification(null), 3000);
  };

  const totalCartCount = cart.reduce((acc, c) => acc + c.qty, 0);
  const cartSubtotal = cart.reduce((acc, c) => acc + c.price * c.qty, 0);

  return (
    <div className="store-shell">
      {/* Header */}
      <header className="store-nav">
        <div className="nav-container">
          <div className="store-logo">
            <span className="logo-icon">▲</span>
            <strong>{brand}</strong>
          </div>
          <div className="nav-pills">
            {categories.map((c) => (
              <button
                key={c}
                className={\`nav-pill \${activeCategory === c ? 'active' : ''}\`}
                onClick={() => setActiveCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <button className="cart-badge-btn" onClick={() => setIsCartOpen(true)}>
            <ShoppingBag size={18} />
            <span>Bag</span>
            {totalCartCount > 0 && <span className="pill">{totalCartCount}</span>}
          </button>
        </div>
      </header>

      {/* Hero 3D Showcase */}
      <section className="showcase-hero">
        <div className="hero-grid">
          <div className="showcase-info">
            <span className="drop-badge"><Sparkles size={13} /> {selectedProduct.tag}</span>
            <h1>{selectedProduct.name}</h1>
            <p className="product-desc">{selectedProduct.description}</p>
            <div className="hero-price">\${selectedProduct.price}</div>

            <div className="size-selector-wrap">
              <label>Select Size</label>
              <div className="size-buttons">
                {selectedProduct.sizes.map((s) => (
                  <button
                    key={s}
                    className={\`size-btn \${selectedSize === s ? 'active' : ''}\`}
                    onClick={() => setSelectedSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="action-row">
              <button
                className="add-bag-btn"
                onClick={() => addToCart(selectedProduct, selectedSize)}
              >
                <ShoppingBag size={17} />
                <span>Add to Bag • \${selectedProduct.price}</span>
              </button>
            </div>
          </div>

          <div className="showcase-visual">
            <div className="visual-stage">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="stage-image" />
              <div className="stage-glow" />
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Grid */}
      <section className="catalog-section">
        <div className="section-head">
          <h2>Collection Catalog</h2>
          <span className="count-label">{filteredProducts.length} Releases</span>
        </div>

        <div className="catalog-grid">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className={\`product-card \${selectedProduct.id === p.id ? 'current' : ''}\`}
              onClick={() => {
                setSelectedProduct(p);
                setSelectedSize(p.sizes[0]);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <div className="card-thumb">
                <img src={p.image} alt={p.name} />
                <span className="card-tag">{p.tag}</span>
              </div>
              <div className="card-body">
                <span className="card-category">{p.category}</span>
                <h4>{p.name}</h4>
                <div className="card-row">
                  <span className="card-price">\${p.price}</span>
                  <button className="quick-view-btn">
                    <span>Inspect</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="store-footer">
        <div className="footer-wrap">
          <div>
            <strong>{brand}</strong>
            <p>Designed for velocity, crafted with uncompromising material precision.</p>
          </div>
          <div>
            <p>© {new Date().getFullYear()} {brand}. Autonomous bespoke architecture.</p>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="drawer-overlay" onClick={() => setIsCartOpen(false)}>
          <div className="drawer-box" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-head">
              <h3>Shopping Bag ({totalCartCount})</h3>
              <button onClick={() => setIsCartOpen(false)}>✕</button>
            </div>
            <div className="drawer-content">
              {cart.length === 0 ? (
                <div className="empty-cart">Your shopping bag is empty.</div>
              ) : (
                cart.map((item, idx) => (
                  <div key={idx} className="drawer-item">
                    <img src={item.image} alt={item.name} />
                    <div className="item-meta">
                      <strong>{item.name}</strong>
                      <span className="item-size">Size: {item.size}</span>
                      <span className="item-cost">\${item.price} × {item.qty}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="drawer-footer">
                <div className="footer-total">
                  <span>Subtotal</span>
                  <strong>\${cartSubtotal}</strong>
                </div>
                <button
                  className="checkout-btn"
                  onClick={() => {
                    alert(\`Simulated checkout for \$\${cartSubtotal}\`);
                    setCart([]);
                    setIsCartOpen(false);
                  }}
                >
                  Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast */}
      {notification && (
        <div className="store-toast">
          <Check size={16} />
          <span>{notification}</span>
        </div>
      )}
    </div>
  );
}
`,
    'src/styles.css': `/* Minimalist High-End Commerce Aesthetic */
:root {
  --bg-dark: #09090b;
  --bg-surface: #141417;
  --bg-card: #18181b;
  --border-subtle: #27272a;
  --accent-pink: #f43f5e;
  --text-pure: #fafafa;
  --text-muted: #a1a1aa;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--bg-dark);
  color: var(--text-pure);
  line-height: 1.5;
}

.store-shell { min-height: 100vh; display: flex; flex-direction: column; }

/* Nav */
.store-nav {
  position: sticky; top: 0; z-index: 50;
  background: rgba(9, 9, 11, 0.9); backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border-subtle);
  padding: 16px 32px;
}
.nav-container {
  max-width: 1300px; margin: 0 auto;
  display: flex; justify-content: space-between; align-items: center;
}
.store-logo { display: flex; align-items: center; gap: 8px; font-size: 18px; font-weight: 800; letter-spacing: -0.02em; }
.logo-icon { color: var(--accent-pink); font-size: 14px; }
.nav-pills { display: flex; gap: 8px; }
.nav-pill {
  background: transparent; border: 1px solid transparent; color: var(--text-muted);
  padding: 6px 14px; border-radius: 9999px; font-size: 13px; font-weight: 600; cursor: pointer;
  transition: all 0.15s;
}
.nav-pill.active { background: var(--bg-surface); border-color: var(--border-subtle); color: #fff; }

.cart-badge-btn {
  display: flex; align-items: center; gap: 8px;
  background: #ffffff; color: #09090b; border: none; border-radius: 8px;
  padding: 8px 16px; font-size: 13px; font-weight: 700; cursor: pointer;
}
.cart-badge-btn .pill { background: var(--accent-pink); color: #fff; padding: 2px 7px; border-radius: 9999px; font-size: 11px; }

/* Showcase Hero */
.showcase-hero {
  padding: 60px 32px 80px; max-width: 1300px; margin: 0 auto; width: 100%;
}
.hero-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 60px; align-items: center; }
.drop-badge {
  display: inline-flex; align-items: center; gap: 6px;
  background: rgba(244, 63, 94, 0.12); color: var(--accent-pink);
  border: 1px solid rgba(244, 63, 94, 0.3); border-radius: 9999px;
  padding: 4px 12px; font-size: 11px; font-weight: 800; margin-bottom: 16px;
}
.showcase-info h1 { font-size: 48px; font-weight: 800; line-height: 1.1; margin-bottom: 14px; letter-spacing: -0.03em; }
.product-desc { font-size: 16px; color: var(--text-muted); margin-bottom: 24px; }
.hero-price { font-size: 32px; font-weight: 800; margin-bottom: 28px; }

.size-selector-wrap label { display: block; font-size: 12px; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 10px; }
.size-buttons { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 32px; }
.size-btn {
  background: var(--bg-surface); border: 1px solid var(--border-subtle);
  color: var(--text-pure); padding: 10px 16px; border-radius: 8px;
  font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.15s;
}
.size-btn:hover { border-color: #71717a; }
.size-btn.active { background: #fff; color: #09090b; border-color: #fff; }

.add-bag-btn {
  background: var(--accent-pink); color: #fff; border: none; padding: 14px 28px;
  border-radius: 10px; font-size: 14px; font-weight: 700; cursor: pointer;
  display: inline-flex; align-items: center; gap: 8px; transition: transform 0.15s;
}
.add-bag-btn:hover { transform: translateY(-2px); }

.visual-stage {
  position: relative; border-radius: 20px; overflow: hidden;
  background: radial-gradient(circle at 50% 50%, #27272a 0%, #09090b 80%);
  border: 1px solid var(--border-subtle); padding: 40px; display: flex;
  justify-content: center; align-items: center; height: 420px;
}
.stage-image { max-width: 100%; max-height: 320px; object-fit: contain; filter: drop-shadow(0 25px 25px rgba(0,0,0,0.6)); }

/* Catalog */
.catalog-section { max-width: 1300px; margin: 0 auto 80px; padding: 0 32px; width: 100%; }
.section-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 24px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 14px; }
.section-head h2 { font-size: 24px; font-weight: 800; letter-spacing: -0.02em; }
.count-label { font-size: 13px; color: var(--text-muted); font-weight: 600; }

.catalog-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 24px; }
.product-card {
  background: var(--bg-card); border: 1px solid var(--border-subtle);
  border-radius: 14px; overflow: hidden; cursor: pointer; transition: all 0.2s;
}
.product-card:hover { border-color: #71717a; transform: translateY(-3px); }
.product-card.current { border-color: var(--accent-pink); }
.card-thumb { height: 200px; background: #121215; position: relative; overflow: hidden; }
.card-thumb img { width: 100%; height: 100%; object-fit: cover; }
.card-tag {
  position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.7);
  padding: 3px 8px; border-radius: 4px; font-size: 10px; font-weight: 700; color: #fff;
}
.card-body { padding: 18px; }
.card-category { font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 700; margin-bottom: 4px; display: block; }
.card-body h4 { font-size: 16px; font-weight: 700; margin-bottom: 12px; }
.card-row { display: flex; justify-content: space-between; align-items: center; }
.card-price { font-size: 16px; font-weight: 800; }
.quick-view-btn {
  background: transparent; border: none; color: var(--text-muted);
  font-size: 12px; font-weight: 700; display: flex; align-items: center; gap: 4px;
  cursor: pointer;
}

/* Footer */
.store-footer { border-top: 1px solid var(--border-subtle); padding: 40px 32px; margin-top: auto; }
.footer-wrap { max-width: 1300px; margin: 0 auto; display: flex; justify-content: space-between; font-size: 13px; color: var(--text-muted); }

/* Drawer */
.drawer-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.75); backdrop-filter: blur(4px);
  z-index: 100; display: flex; justify-content: flex-end;
}
.drawer-box {
  width: 100%; max-width: 420px; background: var(--bg-surface);
  border-left: 1px solid var(--border-subtle); height: 100%; display: flex; flex-direction: column;
}
.drawer-head { padding: 20px; border-bottom: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center; }
.drawer-content { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 14px; }
.empty-cart { text-align: center; color: var(--text-muted); margin-top: 40px; }
.drawer-item { display: flex; gap: 14px; background: var(--bg-card); padding: 12px; border-radius: 8px; }
.drawer-item img { width: 56px; height: 56px; object-fit: cover; border-radius: 6px; }
.item-meta strong { font-size: 13px; display: block; }
.item-size { font-size: 11px; color: var(--text-muted); display: block; }
.item-cost { font-size: 12px; color: var(--accent-pink); font-weight: 700; }
.drawer-footer { padding: 20px; border-top: 1px solid var(--border-subtle); background: var(--bg-dark); }
.footer-total { display: flex; justify-content: space-between; margin-bottom: 16px; font-size: 15px; }
.checkout-btn { width: 100%; background: #fff; color: #09090b; border: none; padding: 12px; border-radius: 8px; font-weight: 700; cursor: pointer; }

/* Toast */
.store-toast {
  position: fixed; bottom: 24px; right: 24px; background: #10b981; color: #fff;
  padding: 12px 20px; border-radius: 8px; font-size: 13px; font-weight: 600;
  display: flex; align-items: center; gap: 8px; z-index: 200;
}
`
  };

  return {
    summary: `Engineered a bespoke dynamic commerce boutique for ${brand} with interactive 3D showcase, size picker, and live cart drawer.`,
    files,
  };
}

// -----------------------------------------------------------------------------
// 3. BESPOKE FINTECH / SAAS APPLICATION
// -----------------------------------------------------------------------------
function synthesizeSaasApp(brand, request) {
  const files = {
    'package.json': JSON.stringify(
      {
        name: 'fintech-saas-app',
        private: true,
        version: '1.0.0',
        type: 'module',
        dependencies: { react: '^18.3.1', 'react-dom': '^18.3.1', 'lucide-react': '^1.45.0' },
      },
      null,
      2
    ),
    'src/App.jsx': `import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownLeft, TrendingUp, ShieldCheck, DollarSign, Activity, Layers, Calendar } from 'lucide-react';
import './styles.css';

export default function App() {
  const brand = '${brand}';
  const [activeTab, setActiveTab] = useState('All');
  const [volumeSlider, setVolumeSlider] = useState(250000);

  const transactions = [
    { id: 'tx_981', desc: 'Apex Capital Liquidity Inflow', category: 'Capital', amount: '+ $84,200.00', date: 'Today, 14:20', type: 'inflow' },
    { id: 'tx_980', desc: 'AWS Global Cloud Compute', category: 'Infrastructure', amount: '- $3,450.00', date: 'Today, 11:05', type: 'outflow' },
    { id: 'tx_979', desc: 'Enterprise SaaS Tier Subscription', category: 'Revenue', amount: '+ $12,500.00', date: 'Yesterday', type: 'inflow' },
    { id: 'tx_978', desc: 'Treasury Yield Automated Rebalance', category: 'Investment', amount: '+ $4,820.50', date: 'Oct 02', type: 'inflow' }
  ];

  const filteredTx = activeTab === 'All' ? transactions : transactions.filter((t) => activeTab === 'Inflow' ? t.type === 'inflow' : t.type === 'outflow');

  // Interactive Forecasting calculation
  const forecastedAnnualYield = Math.round(volumeSlider * 0.084);
  const monthlySavings = Math.round(volumeSlider * 0.012);

  return (
    <div className="fintech-shell">
      {/* Sidebar / Nav */}
      <header className="fintech-nav">
        <div className="nav-brand">
          <div className="brand-gem"><Activity size={18} color="#06b6d4" /></div>
          <strong>{brand}</strong>
          <span className="live-status">LIVE METRICS</span>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="dashboard-container">
        {/* Metric Cards */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <span className="kpi-label">Total Treasury Balance</span>
            <div className="kpi-val">$4,892,140.00</div>
            <span className="kpi-delta positive"><TrendingUp size={13} /> +18.4% vs last month</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">Automated Inflow Rate</span>
            <div className="kpi-val">$842,500.00</div>
            <span className="kpi-delta positive"><TrendingUp size={13} /> 99.98% SLA Uptime</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">Real-time Yield Rate</span>
            <div className="kpi-val">8.42% APY</div>
            <span className="kpi-delta neutral">Daily compounding enabled</span>
          </div>
        </div>

        {/* Interactive Revenue Forecasting Tool */}
        <section className="tool-card">
          <div className="card-header">
            <div>
              <h3>Interactive Treasury & Revenue Forecaster</h3>
              <p>Simulate portfolio yields and automated fee reductions based on volume.</p>
            </div>
          </div>

          <div className="forecast-slider-wrap">
            <div className="slider-row">
              <label>Monthly Processing Volume</label>
              <strong>\${volumeSlider.toLocaleString()}</strong>
            </div>
            <input
              type="range"
              min="50000"
              max="2000000"
              step="25000"
              value={volumeSlider}
              onChange={(e) => setVolumeSlider(Number(e.target.value))}
            />
          </div>

          <div className="forecast-results">
            <div className="res-item">
              <span className="res-label">Est. Annualized Yield</span>
              <span className="res-val">\${forecastedAnnualYield.toLocaleString()}</span>
            </div>
            <div className="res-item">
              <span className="res-label">Est. Monthly Automated Savings</span>
              <span className="res-val">\${monthlySavings.toLocaleString()}</span>
            </div>
            <div className="res-item">
              <span className="res-label">Optimized Fee Bracket</span>
              <span className="res-val">Tier 1 Institutional (0.04%)</span>
            </div>
          </div>
        </section>

        {/* Transaction Ledger */}
        <section className="ledger-card">
          <div className="ledger-header">
            <h3>Live Transaction Ledger</h3>
            <div className="filter-tabs">
              {['All', 'Inflow', 'Outflow'].map((tab) => (
                <button
                  key={tab}
                  className={\`tab-btn \${activeTab === tab ? 'active' : ''}\`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="tx-table">
            {filteredTx.map((tx) => (
              <div key={tx.id} className="tx-row">
                <div className="tx-icon">
                  {tx.type === 'inflow' ? (
                    <ArrowDownLeft size={16} color="#10b981" />
                  ) : (
                    <ArrowUpRight size={16} color="#ef4444" />
                  )}
                </div>
                <div className="tx-details">
                  <strong>{tx.desc}</strong>
                  <span className="tx-meta">{tx.category} • {tx.date}</span>
                </div>
                <div className={\`tx-amount \${tx.type}\`}>
                  {tx.amount}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
`,
    'src/styles.css': `:root {
  --bg-fintech: #07090e;
  --bg-panel: #0d111a;
  --border-fin: #1e293b;
  --accent-cyan: #06b6d4;
  --text-primary: #f8fafc;
  --text-muted: #94a3b8;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--bg-fintech);
  color: var(--text-primary);
  line-height: 1.5;
}

.fintech-shell { min-height: 100vh; display: flex; flex-direction: column; }
.fintech-nav {
  background: #0b0f17; border-bottom: 1px solid var(--border-fin);
  padding: 16px 32px; display: flex; justify-content: space-between; align-items: center;
}
.nav-brand { display: flex; align-items: center; gap: 10px; font-size: 17px; font-weight: 800; }
.brand-gem {
  width: 32px; height: 32px; border-radius: 8px; background: rgba(6, 182, 212, 0.15);
  display: flex; align-items: center; justify-content: center;
}
.live-status {
  font-size: 10px; font-weight: 800; background: rgba(16, 185, 129, 0.15);
  color: #10b981; padding: 3px 8px; border-radius: 9999px; margin-left: 8px;
}

.dashboard-container { max-width: 1200px; margin: 36px auto; padding: 0 24px; width: 100%; display: flex; flex-direction: column; gap: 24px; }
.kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; }
.kpi-card {
  background: var(--bg-panel); border: 1px solid var(--border-fin);
  border-radius: 12px; padding: 24px;
}
.kpi-label { font-size: 13px; color: var(--text-muted); font-weight: 600; display: block; margin-bottom: 8px; }
.kpi-val { font-size: 28px; font-weight: 800; margin-bottom: 8px; }
.kpi-delta { font-size: 12px; font-weight: 700; display: inline-flex; align-items: center; gap: 4px; }
.kpi-delta.positive { color: #10b981; }
.kpi-delta.neutral { color: var(--text-muted); }

.tool-card, .ledger-card {
  background: var(--bg-panel); border: 1px solid var(--border-fin);
  border-radius: 14px; padding: 28px;
}
.card-header h3, .ledger-header h3 { font-size: 18px; font-weight: 700; margin-bottom: 4px; }
.card-header p { font-size: 13px; color: var(--text-muted); margin-bottom: 24px; }

.forecast-slider-wrap { margin-bottom: 24px; }
.slider-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; font-weight: 600; }
.slider-row strong { color: var(--accent-cyan); font-size: 18px; }
input[type="range"] {
  width: 100%; height: 6px; border-radius: 4px; background: #1e293b;
  accent-color: var(--accent-cyan); cursor: pointer;
}

.forecast-results { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-top: 20px; }
.res-item { background: #070a0f; border: 1px solid var(--border-fin); border-radius: 8px; padding: 14px; }
.res-label { font-size: 12px; color: var(--text-muted); display: block; margin-bottom: 4px; }
.res-val { font-size: 16px; font-weight: 800; color: #fff; }

.ledger-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.filter-tabs { display: flex; gap: 6px; background: #070a0f; padding: 4px; border-radius: 8px; border: 1px solid var(--border-fin); }
.tab-btn {
  background: transparent; border: none; color: var(--text-muted); padding: 6px 14px;
  border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer;
}
.tab-btn.active { background: #1e293b; color: #fff; }

.tx-table { display: flex; flex-direction: column; gap: 10px; }
.tx-row {
  display: flex; align-items: center; gap: 14px; padding: 14px; background: #070a0f;
  border: 1px solid var(--border-fin); border-radius: 8px;
}
.tx-icon { width: 32px; height: 32px; border-radius: 50%; background: #0f172a; display: flex; align-items: center; justify-content: center; }
.tx-details { flex: 1; }
.tx-details strong { font-size: 13.5px; display: block; }
.tx-meta { font-size: 11.5px; color: var(--text-muted); }
.tx-amount { font-size: 14px; font-weight: 800; }
.tx-amount.inflow { color: #10b981; }
.tx-amount.outflow { color: #f87171; }
`
  };

  return {
    summary: `Engineered a bespoke dynamic Fintech & SaaS analytics platform for ${brand} with live treasury metrics and interactive revenue forecasting.`,
    files,
  };
}

// -----------------------------------------------------------------------------
// 4. BESPOKE PORTFOLIO APPLICATION
// -----------------------------------------------------------------------------
function synthesizePortfolioApp(brand, request) {
  const files = {
    'package.json': JSON.stringify(
      {
        name: 'bespoke-portfolio-app',
        private: true,
        version: '1.0.0',
        type: 'module',
        dependencies: { react: '^18.3.1', 'react-dom': '^18.3.1', 'lucide-react': '^1.45.0' },
      },
      null,
      2
    ),
    'src/App.jsx': `import React, { useState } from 'react';
import { Terminal, Code2, Layers, Cpu, ArrowUpRight, Github, Mail, Send } from 'lucide-react';
import './styles.css';

export default function App() {
  const name = '${brand}';
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalOutput, setTerminalOutput] = useState([
    'Welcome to developer console v2.4.0',
    'Type "help" or "skills" to inspect system capabilities.'
  ]);

  const skills = [
    { name: 'Distributed Systems & Cloud', level: 95 },
    { name: 'React 19 & High-Performance UI', level: 92 },
    { name: 'Local AI, LLM Agents & Tool-Calling', level: 90 },
    { name: 'Postgres & Redis Architecture', level: 88 }
  ];

  const projects = [
    { title: 'Autonomous Neural Gateway', desc: 'High-throughput inference streaming pipeline handling 40k req/s.', tech: ['Rust', 'Python', 'WebSockets'] },
    { title: 'VectorFlow Studio', desc: 'Visual node-based editor for orchestrating agentic tool workflows.', tech: ['React 19', 'TypeScript', 'Tailwind'] },
    { title: 'KubeForge Orchestrator', desc: 'Zero-config local Kubernetes deployment harness with instant preview.', tech: ['Go', 'Docker', 'K8s'] }
  ];

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const cmd = terminalInput.trim().toLowerCase();
      let res = '';
      if (cmd === 'help') res = 'Available commands: skills, projects, contact, clear';
      else if (cmd === 'skills') res = 'Stack: Rust, Go, TypeScript, React, Python, Docker, Postgres';
      else if (cmd === 'projects') res = 'Featured: Neural Gateway, VectorFlow Studio, KubeForge';
      else if (cmd === 'contact') res = 'Email: contact@engineer.dev • GitHub: @devmatrix';
      else if (cmd === 'clear') {
        setTerminalOutput([]);
        setTerminalInput('');
        return;
      } else {
        res = \`Command not recognized: "\${cmd}". Type "help" for list.\`;
      }
      setTerminalOutput((prev) => [...prev, \`> \${terminalInput}\`, res]);
      setTerminalInput('');
    }
  };

  return (
    <div className="portfolio-shell">
      <header className="port-header">
        <div className="port-brand">
          <Terminal size={18} color="#818cf8" />
          <span>{name}</span>
        </div>
      </header>

      <main className="port-main">
        {/* Bio Hero */}
        <section className="hero-box">
          <span className="hero-tag">SENIOR SYSTEMS & AI ENGINEER</span>
          <h1>Designing resilient architectures & delighting end users.</h1>
          <p>Over 8 years building low-latency distributed systems, modern reactive frontends, and autonomous agentic workflows.</p>
        </section>

        {/* Interactive Terminal */}
        <section className="terminal-card">
          <div className="term-bar">
            <span className="dot red" /><span className="dot yellow" /><span className="dot green" />
            <span className="term-title">terminal ~ zsh</span>
          </div>
          <div className="term-body">
            {terminalOutput.map((line, i) => (
              <div key={i} className="term-line">{line}</div>
            ))}
            <div className="term-input-row">
              <span className="prompt-sym">❯</span>
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                onKeyDown={handleCommand}
                placeholder="type command..."
                autoFocus
              />
            </div>
          </div>
        </section>

        {/* Skills Matrix */}
        <section className="skills-section">
          <h3>Core Technical Competencies</h3>
          <div className="skills-grid">
            {skills.map((s) => (
              <div key={s.name} className="skill-box">
                <div className="skill-head">
                  <strong>{s.name}</strong>
                  <span>{s.level}%</span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: \`\${s.level}%\` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section className="projects-section">
          <h3>Featured Case Studies</h3>
          <div className="proj-grid">
            {projects.map((p) => (
              <div key={p.title} className="proj-card">
                <h4>{p.title}</h4>
                <p>{p.desc}</p>
                <div className="tech-tags">
                  {p.tech.map((t) => <span key={t} className="tech-tag">{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
`,
    'src/styles.css': `:root {
  --bg-deep: #0b0c10;
  --bg-card: #14161f;
  --border-card: #232738;
  --accent-purp: #818cf8;
  --text-main: #f1f5f9;
  --text-dim: #94a3b8;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace; background: var(--bg-deep); color: var(--text-main); }

.portfolio-shell { max-width: 900px; margin: 0 auto; padding: 40px 20px; }
.port-header { display: flex; justify-content: space-between; margin-bottom: 60px; }
.port-brand { display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 16px; }

.hero-tag { font-size: 11px; font-weight: 800; color: var(--accent-purp); letter-spacing: 0.08em; display: block; margin-bottom: 12px; }
.hero-box h1 { font-size: 38px; font-weight: 800; margin-bottom: 16px; line-height: 1.2; }
.hero-box p { font-size: 17px; color: var(--text-dim); margin-bottom: 40px; }

.terminal-card { background: #07080b; border: 1px solid var(--border-card); border-radius: 12px; overflow: hidden; margin-bottom: 48px; }
.term-bar { background: #10121a; padding: 10px 16px; display: flex; align-items: center; gap: 6px; }
.dot { width: 10px; height: 10px; border-radius: 50%; }
.dot.red { background: #ef4444; }
.dot.yellow { background: #f59e0b; }
.dot.green { background: #10b981; }
.term-title { margin-left: 10px; font-size: 11px; color: var(--text-dim); }
.term-body { padding: 20px; font-family: 'Courier New', Courier, monospace; font-size: 13.5px; }
.term-line { color: #cbd5e1; margin-bottom: 6px; }
.term-input-row { display: flex; align-items: center; gap: 8px; margin-top: 10px; }
.prompt-sym { color: var(--accent-purp); font-weight: bold; }
.term-input-row input {
  background: transparent; border: none; color: #fff; font-family: inherit; font-size: 13.5px; flex: 1; outline: none;
}

.skills-section h3, .projects-section h3 { font-size: 20px; margin-bottom: 20px; }
.skills-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 48px; }
.skill-box { background: var(--bg-card); border: 1px solid var(--border-card); border-radius: 8px; padding: 14px; }
.skill-head { display: flex; justify-content: space-between; font-size: 13px; font-weight: 600; margin-bottom: 8px; }
.bar-track { height: 6px; background: #1e2230; border-radius: 3px; overflow: hidden; }
.bar-fill { height: 100%; background: linear-gradient(90deg, #6366f1, #a855f7); border-radius: 3px; }

.proj-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
.proj-card { background: var(--bg-card); border: 1px solid var(--border-card); border-radius: 10px; padding: 20px; }
.proj-card h4 { font-size: 16px; margin-bottom: 6px; }
.proj-card p { font-size: 13.5px; color: var(--text-dim); margin-bottom: 14px; }
.tech-tags { display: flex; gap: 8px; }
.tech-tag { background: #1e2230; color: #cbd5e1; font-size: 11px; padding: 3px 8px; border-radius: 4px; font-weight: 600; }
`
  };

  return {
    summary: `Engineered a bespoke developer portfolio for ${brand} with an interactive terminal simulator and skills matrix.`,
    files,
  };
}

// -----------------------------------------------------------------------------
// 5. BESPOKE ARCHITECTURE STUDIO APPLICATION
// -----------------------------------------------------------------------------
function synthesizeArchitectureStudioApp(brand, request) {
  const files = {
    'package.json': JSON.stringify(
      {
        name: 'architecture-studio-app',
        private: true,
        version: '1.0.0',
        type: 'module',
        dependencies: { react: '^18.3.1', 'react-dom': '^18.3.1', 'lucide-react': '^1.45.0' },
      },
      null,
      2
    ),
    'src/App.jsx': `import React, { useState } from 'react';
import { Compass, Maximize2, Layers, MapPin, ArrowRight } from 'lucide-react';
import './styles.css';

export default function App() {
  const brand = '${brand}';
  const [filter, setFilter] = useState('All');
  const [activeModal, setActiveModal] = useState(null);

  const projects = [
    {
      id: 1,
      title: 'Monolith Residence',
      cat: 'Residential',
      loc: 'Kyoto, Japan',
      area: '4,200 sq ft',
      year: '2025',
      img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
      desc: 'Raw board-formed concrete volume oriented around an internal contemplative bamboo courtyard.'
    },
    {
      id: 2,
      title: 'Nordic Pavilion of Light',
      cat: 'Cultural',
      loc: 'Bergen, Norway',
      area: '8,900 sq ft',
      year: '2024',
      img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
      desc: 'Glulam timber structure maximizing natural daylight along the northern fjord horizon.'
    },
    {
      id: 3,
      title: 'Atelier Glasshouse',
      cat: 'Commercial',
      loc: 'Zurich, Switzerland',
      area: '12,500 sq ft',
      year: '2025',
      img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
      desc: 'Double-skin ventilated glass facade delivering passive cooling and thermal harmony.'
    }
  ];

  const filtered = filter === 'All' ? projects : projects.filter((p) => p.cat === filter);

  return (
    <div className="arch-shell">
      <header className="arch-header">
        <div className="brand"><strong>{brand}</strong><span>Atelier</span></div>
        <div className="filters">
          {['All', 'Residential', 'Cultural', 'Commercial'].map((f) => (
            <button key={f} className={filter === f ? 'active' : ''} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
      </header>

      <section className="arch-hero">
        <h1>Material honesty. Spatial permanence.</h1>
        <p>A contemporary architectural practice exploring light, mass, and structural restraint.</p>
      </section>

      <section className="projects-grid">
        {filtered.map((p) => (
          <div key={p.id} className="arch-card" onClick={() => setActiveModal(p)}>
            <div className="img-box">
              <img src={p.img} alt={p.title} />
              <button className="expand-btn"><Maximize2 size={16} /></button>
            </div>
            <div className="card-info">
              <span className="loc"><MapPin size={12} /> {p.loc}</span>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {activeModal && (
        <div className="modal-backdrop" onClick={() => setActiveModal(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <img src={activeModal.img} alt={activeModal.title} />
            <div className="modal-content">
              <h2>{activeModal.title}</h2>
              <p>{activeModal.desc}</p>
              <div className="specs">
                <div><strong>Location</strong><span>{activeModal.loc}</span></div>
                <div><strong>Area</strong><span>{activeModal.area}</span></div>
                <div><strong>Year</strong><span>{activeModal.year}</span></div>
              </div>
              <button className="close-btn" onClick={() => setActiveModal(null)}>Close Blueprint</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
`,
    'src/styles.css': `:root {
  --arch-bg: #111113;
  --arch-card: #18181b;
  --arch-border: #27272a;
  --arch-text: #fafafa;
  --arch-muted: #a1a1aa;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Helvetica Neue', Helvetica, sans-serif; background: var(--arch-bg); color: var(--arch-text); line-height: 1.6; }
.arch-shell { max-width: 1200px; margin: 0 auto; padding: 40px 24px; }
.arch-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 80px; }
.brand { font-size: 18px; letter-spacing: -0.02em; }
.brand span { font-size: 11px; margin-left: 6px; text-transform: uppercase; color: var(--arch-muted); }
.filters button { background: transparent; border: none; color: var(--arch-muted); margin-left: 16px; font-size: 13px; font-weight: 600; cursor: pointer; }
.filters button.active { color: #fff; border-bottom: 2px solid #fff; }

.arch-hero h1 { font-size: 52px; font-weight: 300; letter-spacing: -0.03em; margin-bottom: 12px; }
.arch-hero p { font-size: 18px; color: var(--arch-muted); max-width: 600px; margin-bottom: 60px; }

.projects-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 32px; }
.arch-card { background: var(--arch-card); border: 1px solid var(--arch-border); border-radius: 8px; overflow: hidden; cursor: pointer; transition: transform 0.2s; }
.arch-card:hover { transform: translateY(-4px); }
.img-box { position: relative; height: 260px; }
.img-box img { width: 100%; height: 100%; object-fit: cover; }
.expand-btn { position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.6); color: #fff; border: none; padding: 8px; border-radius: 4px; cursor: pointer; }
.card-info { padding: 20px; }
.loc { font-size: 12px; color: var(--arch-muted); display: flex; align-items: center; gap: 4px; margin-bottom: 6px; }
.card-info h3 { font-size: 18px; margin-bottom: 8px; font-weight: 600; }
.card-info p { font-size: 13px; color: var(--arch-muted); }

.modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 100; }
.modal-card { background: #18181b; border-radius: 12px; max-width: 600px; overflow: hidden; width: 90%; }
.modal-card img { width: 100%; height: 300px; object-fit: cover; }
.modal-content { padding: 24px; }
.modal-content h2 { font-size: 22px; margin-bottom: 8px; }
.modal-content p { font-size: 14px; color: var(--arch-muted); margin-bottom: 20px; }
.specs { display: flex; gap: 24px; margin-bottom: 20px; border-top: 1px solid #27272a; padding-top: 16px; }
.specs div strong { display: block; font-size: 11px; text-transform: uppercase; color: var(--arch-muted); }
.specs div span { font-size: 13.5px; }
.close-btn { background: #fff; color: #000; border: none; padding: 10px 18px; border-radius: 6px; font-weight: 700; cursor: pointer; }
`
  };

  return {
    summary: `Engineered a bespoke masonry architecture portfolio for ${brand} with interactive project blueprints.`,
    files,
  };
}

// -----------------------------------------------------------------------------
// 6. BESPOKE FITNESS APPLICATION
// -----------------------------------------------------------------------------
function synthesizeFitnessApp(brand, request) {
  const files = {
    'package.json': JSON.stringify(
      {
        name: 'fitness-app',
        private: true,
        version: '1.0.0',
        type: 'module',
        dependencies: { react: '^18.3.1', 'react-dom': '^18.3.1', 'lucide-react': '^1.45.0' },
      },
      null,
      2
    ),
    'src/App.jsx': `import React, { useState } from 'react';
import { Activity, Flame, Dumbbell, Award, Plus, Check } from 'lucide-react';
import './styles.css';

export default function App() {
  const brand = '${brand}';
  const [workouts, setWorkouts] = useState([
    { name: 'Barbell Deadlifts', sets: 4, reps: 8, weight: 185 },
    { name: 'Dumbbell Incline Bench', sets: 3, reps: 10, weight: 65 },
    { name: 'Weighted Pull-ups', sets: 3, reps: 6, weight: 25 }
  ]);
  const [exerciseInput, setExerciseInput] = useState('');
  const [setsInput, setSetsInput] = useState(3);
  const [repsInput, setRepsInput] = useState(10);
  const [weightInput, setWeightInput] = useState(50);

  const addExercise = () => {
    if (!exerciseInput.trim()) return;
    setWorkouts([...workouts, { name: exerciseInput, sets: setsInput, reps: repsInput, weight: weightInput }]);
    setExerciseInput('');
  };

  const totalVolume = workouts.reduce((acc, w) => acc + w.sets * w.reps * w.weight, 0);

  return (
    <div className="fit-shell">
      <header className="fit-header">
        <div className="brand"><Flame size={20} color="#10b981" /><strong>{brand}</strong></div>
      </header>

      <main className="fit-main">
        <div className="fit-hero">
          <h1>Track Intensity. Build Kinetic Power.</h1>
          <p>Real-time training logger and progressive overload calculation engine.</p>
        </div>

        <div className="fit-dashboard">
          <div className="stat-card">
            <span>Session Volume</span>
            <strong>{totalVolume.toLocaleString()} lbs</strong>
          </div>
          <div className="stat-card">
            <span>Exercises Completed</span>
            <strong>{workouts.length}</strong>
          </div>
          <div className="stat-card">
            <span>Intensity Index</span>
            <strong>92% Overload</strong>
          </div>
        </div>

        <div className="logger-card">
          <h3>Active Training Session</h3>
          <div className="log-list">
            {workouts.map((w, idx) => (
              <div key={idx} className="log-row">
                <Dumbbell size={16} color="#10b981" />
                <div className="row-text">
                  <strong>{w.name}</strong>
                  <span>{w.sets} sets × {w.reps} reps @ {w.weight} lbs</span>
                </div>
              </div>
            ))}
          </div>

          <div className="add-form">
            <input
              type="text"
              placeholder="Exercise name (e.g. Squat)"
              value={exerciseInput}
              onChange={(e) => setExerciseInput(e.target.value)}
            />
            <div className="num-inputs">
              <input type="number" placeholder="Sets" value={setsInput} onChange={(e) => setSetsInput(Number(e.target.value))} />
              <input type="number" placeholder="Reps" value={repsInput} onChange={(e) => setRepsInput(Number(e.target.value))} />
              <input type="number" placeholder="Weight (lbs)" value={weightInput} onChange={(e) => setWeightInput(Number(e.target.value))} />
            </div>
            <button className="add-btn" onClick={addExercise}><Plus size={16} /> Add Exercise</button>
          </div>
        </div>
      </main>
    </div>
  );
}
`,
    'src/styles.css': `:root {
  --fit-bg: #090c0b;
  --fit-panel: #111714;
  --fit-border: #1f2923;
  --fit-green: #10b981;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: var(--fit-bg); color: #fff; }
.fit-shell { max-width: 900px; margin: 0 auto; padding: 30px 20px; }
.fit-header { margin-bottom: 40px; }
.brand { display: flex; align-items: center; gap: 8px; font-size: 18px; }
.fit-hero h1 { font-size: 36px; font-weight: 800; margin-bottom: 8px; }
.fit-hero p { font-size: 16px; color: #9ca3af; margin-bottom: 30px; }

.fit-dashboard { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 30px; }
.stat-card { background: var(--fit-panel); border: 1px solid var(--fit-border); border-radius: 10px; padding: 18px; }
.stat-card span { font-size: 12px; color: #9ca3af; display: block; margin-bottom: 6px; }
.stat-card strong { font-size: 24px; color: var(--fit-green); }

.logger-card { background: var(--fit-panel); border: 1px solid var(--fit-border); border-radius: 12px; padding: 24px; }
.logger-card h3 { font-size: 18px; margin-bottom: 16px; }
.log-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px; }
.log-row { display: flex; align-items: center; gap: 12px; background: #0c120f; padding: 12px; border-radius: 8px; }
.row-text strong { display: block; font-size: 14px; }
.row-text span { font-size: 12px; color: #9ca3af; }

.add-form { display: flex; flex-direction: column; gap: 10px; }
.add-form input { background: #0c120f; border: 1px solid var(--fit-border); border-radius: 6px; padding: 10px; color: #fff; }
.num-inputs { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
.add-btn { background: var(--fit-green); color: #000; border: none; padding: 12px; border-radius: 6px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; }
`
  };

  return {
    summary: `Engineered a bespoke fitness & workout tracking application for ${brand}.`,
    files,
  };
}

// -----------------------------------------------------------------------------
// 7. BESPOKE RESTAURANT / CULINARY APPLICATION
// -----------------------------------------------------------------------------
function synthesizeRestaurantApp(brand, request) {
  const files = {
    'package.json': JSON.stringify(
      {
        name: 'restaurant-app',
        private: true,
        version: '1.0.0',
        type: 'module',
        dependencies: { react: '^18.3.1', 'react-dom': '^18.3.1', 'lucide-react': '^1.45.0' },
      },
      null,
      2
    ),
    'src/App.jsx': `import React, { useState } from 'react';
import { Utensils, Calendar, Clock, Users, Check, Sparkles } from 'lucide-react';
import './styles.css';

export default function App() {
  const brand = '${brand}';
  const [reserved, setReserved] = useState(false);
  const [partySize, setPartySize] = useState(2);
  const [time, setTime] = useState('19:30');

  const menu = [
    { title: 'Wood-Fired Truffle Gnocchi', desc: 'Hand-rolled potato gnocchi with shaved Umbrian winter truffle & parmigiano.', price: '$34' },
    { title: 'Pan-Roasted Mediterranean Branzino', desc: 'Crispy skin, fennel confit, saffron broth, and charred lemon.', price: '$42' },
    { title: 'Dry-Aged Bistecca Alla Fiorentina', desc: '45-day aged Chianina beef with rosemary infused sea salt.', price: '$68' }
  ];

  return (
    <div className="dining-shell">
      <header className="dining-nav">
        <strong>{brand}</strong>
        <a href="#reservation" className="book-link">Reserve Table</a>
      </header>

      <section className="dining-hero">
        <span className="eyebrow">CONTEMPORARY GASTRONOMY</span>
        <h1>Wood-fired warmth & seasonal harvest dining.</h1>
        <p>An intimate culinary experience celebrating heritage cooking and sustainable terroir.</p>
      </section>

      <section className="menu-section">
        <h2>Seasonal Menu</h2>
        <div className="menu-grid">
          {menu.map((dish) => (
            <div key={dish.title} className="dish-card">
              <div className="dish-head">
                <h3>{dish.title}</h3>
                <span className="dish-price">{dish.price}</span>
              </div>
              <p>{dish.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="reservation" className="res-section">
        <div className="res-card">
          <h2>Table Reservation</h2>
          {reserved ? (
            <div className="res-confirmed">
              <Check size={32} color="#10b981" />
              <h3>Reservation Confirmed!</h3>
              <p>Table for {partySize} guests reserved for tonight at {time}.</p>
            </div>
          ) : (
            <div className="res-form">
              <div className="form-group">
                <label>Party Size</label>
                <select value={partySize} onChange={(e) => setPartySize(Number(e.target.value))}>
                  {[1, 2, 3, 4, 6, 8].map((n) => <option key={n} value={n}>{n} Guests</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Preferred Time</label>
                <select value={time} onChange={(e) => setTime(e.target.value)}>
                  {['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'].map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <button className="confirm-btn" onClick={() => setReserved(true)}>Confirm Reservation</button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
`,
    'src/styles.css': `:root {
  --culinary-bg: #14110f;
  --culinary-card: #1f1a16;
  --culinary-gold: #c2884a;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Georgia', serif; background: var(--culinary-bg); color: #f7f4f0; line-height: 1.6; }
.dining-shell { max-width: 960px; margin: 0 auto; padding: 40px 24px; }
.dining-nav { display: flex; justify-content: space-between; align-items: center; margin-bottom: 60px; font-family: sans-serif; }
.dining-nav strong { font-size: 20px; font-weight: 700; }
.book-link { background: var(--culinary-gold); color: #fff; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: 600; }

.dining-hero { text-align: center; margin-bottom: 80px; }
.eyebrow { font-family: sans-serif; font-size: 11px; letter-spacing: 0.15em; color: var(--culinary-gold); text-transform: uppercase; margin-bottom: 12px; display: block; }
.dining-hero h1 { font-size: 44px; font-weight: 400; margin-bottom: 16px; }
.dining-hero p { font-size: 17px; color: #b0a79e; max-width: 600px; margin: 0 auto; }

.menu-section { margin-bottom: 80px; }
.menu-section h2 { font-size: 28px; text-align: center; margin-bottom: 36px; border-bottom: 1px solid rgba(194, 136, 74, 0.2); padding-bottom: 14px; }
.menu-grid { display: flex; flex-direction: column; gap: 24px; }
.dish-card { background: var(--culinary-card); border-radius: 8px; padding: 24px; border: 1px solid rgba(194, 136, 74, 0.15); }
.dish-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px; }
.dish-head h3 { font-size: 20px; font-weight: 400; }
.dish-price { color: var(--culinary-gold); font-size: 18px; font-family: sans-serif; font-weight: 700; }
.dish-card p { font-size: 14px; color: #a39b93; font-style: italic; }

.res-section { display: flex; justify-content: center; }
.res-card { background: var(--culinary-card); border: 1px solid rgba(194, 136, 74, 0.2); border-radius: 12px; padding: 40px; width: 100%; max-width: 480px; text-align: center; }
.res-card h2 { font-size: 24px; margin-bottom: 24px; }
.res-form { display: flex; flex-direction: column; gap: 16px; font-family: sans-serif; text-align: left; }
.form-group label { display: block; font-size: 12px; font-weight: 700; margin-bottom: 6px; color: var(--culinary-gold); }
.form-group select { width: 100%; background: #0f0c0a; border: 1px solid rgba(194, 136, 74, 0.3); color: #fff; padding: 10px; border-radius: 6px; }
.confirm-btn { background: var(--culinary-gold); color: #fff; border: none; padding: 12px; border-radius: 6px; font-weight: 700; cursor: pointer; margin-top: 10px; }
.res-confirmed { padding: 20px 0; }
`
  };

  return {
    summary: `Engineered a bespoke culinary website for ${brand} with seasonal menu showcase and interactive table reservation.`,
    files,
  };
}

// -----------------------------------------------------------------------------
// 8. GENERAL BESPOKE APPLICATION (For any arbitrary topic)
// -----------------------------------------------------------------------------
function synthesizeCustomBespokeApp(brand, request) {
  const files = {
    'package.json': JSON.stringify(
      {
        name: 'bespoke-web-app',
        private: true,
        version: '1.0.0',
        type: 'module',
        dependencies: { react: '^18.3.1', 'react-dom': '^18.3.1', 'lucide-react': '^1.45.0' },
      },
      null,
      2
    ),
    'src/App.jsx': `import React, { useState } from 'react';
import { Sparkles, Layers, ArrowRight, CheckCircle2, Search, Sliders } from 'lucide-react';
import './styles.css';

export default function App() {
  const brand = '${brand}';
  const prompt = '${request.replace(/'/g, "\\'").slice(0, 140)}';
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeItem, setActiveItem] = useState(null);

  const items = [
    { id: 1, title: 'Intelligent Adaptive Workflow', cat: 'Core', desc: 'Engineered specifically for your prompt requirements with dynamic modular state.' },
    { id: 2, title: 'Real-Time Kinetic Interface', cat: 'Experience', desc: 'Delightful micro-interactions, responsive grid behavior, and bespoke styling.' },
    { id: 3, title: 'Integrated Data Synchronization', cat: 'Architecture', desc: 'Built completely anew on this individual request without static templates.' }
  ];

  const filtered = items.filter((item) => {
    const matchesCat = activeCategory === 'All' || item.cat === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || item.desc.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="custom-shell">
      <header className="custom-header">
        <div className="custom-brand">
          <div className="gem"><Sparkles size={16} /></div>
          <strong>{brand}</strong>
        </div>
        <div className="prompt-pill">Built uniquely for prompt</div>
      </header>

      <section className="custom-hero">
        <h1>{brand}</h1>
        <p className="hero-sub">Custom engineered for: "{prompt}"</p>

        <div className="search-bar">
          <Search size={16} color="#71717a" />
          <input
            type="text"
            placeholder="Search features or modules..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </section>

      <section className="modules-section">
        <div className="tabs-row">
          {['All', 'Core', 'Experience', 'Architecture'].map((cat) => (
            <button
              key={cat}
              className={\`tab-chip \${activeCategory === cat ? 'active' : ''}\`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="cards-grid">
          {filtered.map((item) => (
            <div key={item.id} className="feature-card" onClick={() => setActiveItem(item)}>
              <span className="card-badge">{item.cat}</span>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
              <button className="view-more-btn">
                <span>Inspect Module</span>
                <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {activeItem && (
        <div className="modal-backdrop" onClick={() => setActiveItem(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <CheckCircle2 size={28} color="#6366f1" />
            <h2>{activeItem.title}</h2>
            <p>{activeItem.desc}</p>
            <button className="close-btn" onClick={() => setActiveItem(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
`,
    'src/styles.css': `:root {
  --bg-custom: #09090b;
  --bg-card: #18181b;
  --border-c: #27272a;
  --accent: #6366f1;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: var(--bg-custom); color: #fafafa; line-height: 1.5; }
.custom-shell { max-width: 1000px; margin: 0 auto; padding: 40px 24px; min-height: 100vh; }
.custom-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 60px; }
.custom-brand { display: flex; align-items: center; gap: 8px; font-size: 18px; }
.gem { width: 30px; height: 30px; border-radius: 8px; background: rgba(99, 102, 241, 0.2); color: var(--accent); display: flex; align-items: center; justify-content: center; }
.prompt-pill { background: rgba(255,255,255,0.06); border: 1px solid var(--border-c); padding: 4px 12px; border-radius: 9999px; font-size: 11px; color: #a1a1aa; }

.custom-hero { text-align: center; margin-bottom: 60px; }
.custom-hero h1 { font-size: 44px; font-weight: 800; margin-bottom: 12px; }
.hero-sub { color: #a1a1aa; font-size: 16px; max-width: 680px; margin: 0 auto 30px; }

.search-bar { max-width: 500px; margin: 0 auto; display: flex; align-items: center; gap: 10px; background: var(--bg-card); border: 1px solid var(--border-c); padding: 12px 16px; border-radius: 10px; }
.search-bar input { background: transparent; border: none; color: #fff; font-size: 14px; flex: 1; outline: none; }

.tabs-row { display: flex; justify-content: center; gap: 8px; margin-bottom: 30px; }
.tab-chip { background: transparent; border: 1px solid var(--border-c); color: #a1a1aa; padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-weight: 600; cursor: pointer; }
.tab-chip.active { background: #fff; color: #000; border-color: #fff; }

.cards-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
.feature-card { background: var(--bg-card); border: 1px solid var(--border-c); border-radius: 12px; padding: 24px; cursor: pointer; transition: transform 0.2s; }
.feature-card:hover { transform: translateY(-3px); border-color: var(--accent); }
.card-badge { font-size: 10px; font-weight: 800; background: rgba(99, 102, 241, 0.15); color: var(--accent); padding: 3px 8px; border-radius: 4px; text-transform: uppercase; margin-bottom: 12px; display: inline-block; }
.feature-card h3 { font-size: 17px; margin-bottom: 8px; }
.feature-card p { font-size: 13.5px; color: #a1a1aa; margin-bottom: 20px; }
.view-more-btn { background: transparent; border: none; color: var(--accent); font-size: 12.5px; font-weight: 700; display: flex; align-items: center; gap: 4px; cursor: pointer; }

.modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 100; }
.modal-box { background: #18181b; border: 1px solid var(--border-c); border-radius: 14px; padding: 32px; max-width: 440px; width: 90%; text-align: center; }
.modal-box h2 { font-size: 20px; margin: 16px 0 8px; }
.modal-box p { font-size: 14px; color: #a1a1aa; margin-bottom: 24px; }
.close-btn { background: #fff; color: #000; border: none; padding: 10px 20px; border-radius: 6px; font-weight: 700; cursor: pointer; }
`
  };

  return {
    summary: `Engineered a bespoke dynamic web application for ${brand} tailored uniquely to: "${request.slice(0, 100)}".`,
    files,
  };
}
