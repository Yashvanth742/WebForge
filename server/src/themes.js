/**
 * Dynamic Multi-Theme Website Generator
 * Produces complete, theme-specific, interactive React websites
 * based on the user's prompt (Restaurant, E-Commerce, Fitness, SaaS, Agency, Portfolio).
 */

export function generateThemedWebsite(request) {
  const req = String(request || '').toLowerCase();

  // 1. Restaurant / Food / Cafe / Bistro
  if (/restaurant|cafe|bakery|food|dining|bistro|pizza|coffee|menu|culinary|bar/i.test(req)) {
    return generateRestaurantTheme(request);
  }

  // 2. E-Commerce / Store / Products / Fashion / Luxury
  if (/ecommerce|e-commerce|store|shop|watch|fashion|shoes|product|clothing|retail|boutique|merch/i.test(req)) {
    return generateEcommerceTheme(request);
  }

  // 3. Gym / Fitness / Trainer / Workout
  if (/gym|fitness|workout|trainer|crossfit|yoga|health club|bodybuilding|pilates/i.test(req)) {
    return generateFitnessTheme(request);
  }

  // 4. SaaS / AI Platform / Tech / Software
  if (/saas|software|platform|dashboard|ai tool|analytics|cloud|crm|api/i.test(req)) {
    return generateSaasTheme(request);
  }

  // 5. Creative Agency / Studio / Marketing
  if (/agency|marketing|creative studio|consulting|design studio|branding/i.test(req)) {
    return generateAgencyTheme(request);
  }

  // 6. Default: Developer / Creator Portfolio (customized to the title in the prompt)
  return generatePortfolioTheme(request);
}

// -----------------------------------------------------------------------------
// 1. RESTAURANT THEME
// -----------------------------------------------------------------------------
function generateRestaurantTheme(request) {
  const plan = [
    ['/App.jsx', 'Main application rendering navigation, hero, menu, chef story, reservation, and footer.'],
    ['/styles.css', 'Warm culinary styling, Google fonts, appetizing food cards, and reservation form styles.'],
    ['/components/Header.jsx', 'Navigation bar with restaurant brand, menu links, and table booking button.'],
    ['/components/Hero.jsx', 'High-impact culinary hero with ambiance imagery and reservation CTA.'],
    ['/components/Features.jsx', 'Culinary pillars: farm-to-table ingredients, wood-fired kitchen, sommelier wine list.'],
    ['/components/Projects.jsx', 'Interactive food menu showcasing signature dishes, prices, and dietary tags.'],
    ['/components/Testimonials.jsx', 'Food critic reviews and diner testimonials.'],
    ['/components/Contact.jsx', 'Interactive table reservation form with date, time, party size, and confirmation.'],
    ['/components/Footer.jsx', 'Restaurant hours, location address, contact phone, and social links.'],
  ];

  const files = {
    '/App.jsx': `import React, { useState } from 'react';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Features from './components/Features.jsx';
import Projects from './components/Projects.jsx';
import Testimonials from './components/Testimonials.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import './styles.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="site-wrapper restaurant-theme">
      <Header />
      <main>
        <Hero />
        <Features />
        <Projects activeTab={activeTab} setActiveTab={setActiveTab} />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
`,

    '/components/Header.jsx': `import React from 'react';

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-container">
        <a href="#home" className="site-brand">
          <span className="brand-icon">🍷</span>
          <span className="brand-name">L'Aura <span>Bistro</span></span>
        </a>
        <nav className="header-nav">
          <a href="#menu">Menu</a>
          <a href="#about">Our Story</a>
          <a href="#reviews">Reviews</a>
          <a href="#reservations">Reservations</a>
        </nav>
        <a href="#reservations" className="cta-button">Reserve Table</a>
      </div>
    </header>
  );
}
`,

    '/components/Hero.jsx': `import React from 'react';

export default function Hero() {
  return (
    <section id="home" className="hero-section">
      <div className="hero-container">
        <div className="hero-badge">
          <span className="badge-dot"></span>
          <span>Michelin Selected 2026 • Artisanal Dining</span>
        </div>
        <h1 className="hero-title">
          Artisanal Cuisine & <span className="gradient-text">Memorable Gatherings</span>
        </h1>
        <p className="hero-subtitle">
          Experience seasonal gastronomy rooted in Mediterranean traditions and wood-fired mastery.
        </p>
        <div className="hero-actions">
          <a href="#reservations" className="btn-primary">Book a Table &rarr;</a>
          <a href="#menu" className="btn-secondary">Explore Menu</a>
        </div>
      </div>
    </section>
  );
}
`,

    '/components/Features.jsx': `import React from 'react';

export default function Features() {
  const highlights = [
    { title: 'Farm-to-Table', desc: '100% organic produce sourced directly from regional biodynamic farms.', tag: 'Fresh' },
    { title: 'Wood-Fired Hearth', desc: 'Ancient olive wood embers that impart deep aromatic smokiness to our prime cuts.', tag: 'Craft' },
    { title: 'Sommelier Cellar', desc: 'Over 350 natural and reserve wines curated by Master Sommelier Paul Laurent.', tag: 'Cellar' },
  ];

  return (
    <section id="about" className="skills-section">
      <div className="section-container">
        <div className="section-header">
          <span className="section-eyebrow">Our Philosophy</span>
          <h2>Crafted with passion, served with grace</h2>
          <p>Every plate is a tribute to pure ingredients and time-honored culinary heritage.</p>
        </div>
        <div className="skills-grid">
          {highlights.map((h, i) => (
            <div key={i} className="skill-card">
              <span className="skill-tag">{h.tag}</span>
              <h3>{h.title}</h3>
              <p>{h.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`,

    '/components/Projects.jsx': `import React from 'react';

export default function Projects({ activeTab, setActiveTab }) {
  const dishes = [
    {
      title: 'Truffle Tagliatelle',
      desc: 'Handmade semolina pasta, 36-month aged Parmigiano Reggiano, shaved Black Norcia truffle.',
      price: '$34',
      tags: ['Signature', 'Handmade'],
      image: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=600&auto=format&fit=crop&q=80',
    },
    {
      title: 'Wood-Fired Prime Ribeye',
      desc: 'Dry-aged for 45 days, roasted over olive wood embers, served with charred bone marrow glaze.',
      price: '$58',
      tags: ['Wood-Fired', 'Prime'],
      image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=600&auto=format&fit=crop&q=80',
    },
    {
      title: 'Mediterranean Sea Bass',
      desc: 'Pan-seared wild sea bass with saffron velouté, baby fennel, and crispy leeks.',
      price: '$42',
      tags: ['Wild Catch', 'Gluten-Free'],
      image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <section id="menu" className="projects-section">
      <div className="section-container">
        <div className="section-header">
          <span className="section-eyebrow">A La Carte</span>
          <h2>Signature Dishes</h2>
          <p>Carefully composed seasonal creations to awaken your palate.</p>
        </div>
        <div className="projects-grid">
          {dishes.map((dish, i) => (
            <div key={i} className="project-card">
              <div className="project-img-wrap">
                <img src={dish.image} alt={dish.title} />
              </div>
              <div className="project-info">
                <div className="project-tags">
                  {dish.tags.map((t, idx) => (
                    <span key={idx}>{t}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3>{dish.title}</h3>
                  <strong style={{ fontSize: '18px', color: '#b45309' }}>{dish.price}</strong>
                </div>
                <p>{dish.desc}</p>
                <a href="#reservations" className="project-link">Reserve to Taste &rarr;</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`,

    '/components/Testimonials.jsx': `import React from 'react';

export default function Testimonials() {
  const reviews = [
    {
      quote: "L'Aura Bistro delivers the most evocative dining experience in the city. The truffle tagliatelle is perfection.",
      author: 'Eater Gourmet Guide',
      role: 'Culinary Critic',
    },
    {
      quote: 'An unforgettable evening. The sommelier wine pairings and attentive warmth made our anniversary extraordinary.',
      author: 'Jonathan & Claire Bennett',
      role: 'Verified Diners',
    },
  ];

  return (
    <section id="reviews" className="testimonials-section">
      <div className="section-container">
        <div className="section-header">
          <span className="section-eyebrow">Guest Impressions</span>
          <h2>Praised by Critics & Food Lovers</h2>
        </div>
        <div className="testimonials-grid">
          {reviews.map((rev, i) => (
            <div key={i} className="testimonial-card">
              <p className="testimonial-quote">"{rev.quote}"</p>
              <div className="testimonial-author">
                <strong>{rev.author}</strong>
                <span>{rev.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`,

    '/components/Contact.jsx': `import React, { useState } from 'react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', date: '', guests: '2', requests: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="reservations" className="contact-section">
      <div className="section-container">
        <div className="contact-card">
          <div className="contact-intro">
            <span className="section-eyebrow">Reservations</span>
            <h2>Book Your Table</h2>
            <p>Join us for an evening of exceptional flavors. For parties of 6 or more, please call us directly.</p>
            <div style={{ marginTop: '24px', fontSize: '14px', color: '#64748b' }}>
              <p>📍 142 Heritage Boulevard, Old Town</p>
              <p>📞 (555) 234-8900</p>
              <p>⏰ Tuesday – Sunday: 5:00 PM – 11:00 PM</p>
            </div>
          </div>
          <div className="contact-form-wrapper">
            {submitted ? (
              <div className="success-message">
                <h3>Reservation Confirmed!</h3>
                <p>We look forward to hosting you on {form.date || 'your selected date'}. A confirmation has been sent to {form.email}.</p>
                <button onClick={() => setSubmitted(false)}>Make Another Booking</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div>
                  <label>Full Name</label>
                  <input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Alexander Wright" />
                </div>
                <div>
                  <label>Email Address</label>
                  <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="alex@example.com" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label>Date</label>
                    <input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                  </div>
                  <div>
                    <label>Party Size</label>
                    <select value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="4">4 Guests</option>
                      <option value="6">6 Guests</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label>Special Requests</label>
                  <textarea rows={2} value={form.requests} onChange={(e) => setForm({ ...form, requests: e.target.value })} placeholder="Allergies, anniversaries, or seating preferences…" />
                </div>
                <button type="submit" className="submit-button" style={{ backgroundColor: '#b45309' }}>Confirm Table Reservation</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
`,

    '/components/Footer.jsx': `import React from 'react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <strong>L'Aura <span>Bistro</span></strong>
          <p>Artisanal culinary craft & wood-fired dining.</p>
        </div>
        <div className="footer-links">
          <a href="#menu">Menu</a>
          <a href="#about">Story</a>
          <a href="#reservations">Reservations</a>
          <a href="#home">Back to Top</a>
        </div>
        <div className="footer-copy">
          <p>© 2026 L'Aura Bistro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
`,

    '/styles.css': getRestaurantStyles(),
  };

  return {
    summary: `Designed a gourmet culinary dining web application for: "${request}" with interactive reservation booking and a la carte menus.`,
    plan,
    files,
  };
}

// -----------------------------------------------------------------------------
// 2. E-COMMERCE THEME
// -----------------------------------------------------------------------------
function generateEcommerceTheme(request) {
  const plan = [
    ['/App.jsx', 'Main storefront app with shopping cart state, catalog filter, and checkout modal.'],
    ['/styles.css', 'Modern e-commerce styling, sleek product cards, badges, and responsive shopping cart.'],
    ['/components/Header.jsx', 'Sticky navbar with brand logo, currency selector, and interactive cart count.'],
    ['/components/Hero.jsx', 'Premium product showcase hero with tagline, ratings, and featured item CTA.'],
    ['/components/Features.jsx', 'Value props: Swiss precision, titanium grade-5 durability, worldwide insured shipping.'],
    ['/components/Projects.jsx', 'Product catalog with interactive Add-to-Cart buttons and price tags.'],
    ['/components/Testimonials.jsx', 'Verified buyer reviews with star ratings.'],
    ['/components/Contact.jsx', 'Newsletter subscription and VIP collector inquiry form.'],
    ['/components/Footer.jsx', 'Store customer service links, security trust seals, and copyright.'],
  ];

  const files = {
    '/App.jsx': `import React, { useState } from 'react';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Features from './components/Features.jsx';
import Projects from './components/Projects.jsx';
import Testimonials from './components/Testimonials.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import './styles.css';

export default function App() {
  const [cartCount, setCartCount] = useState(0);

  const handleAddToCart = () => {
    setCartCount(prev => prev + 1);
  };

  return (
    <div className="site-wrapper ecommerce-theme">
      <Header cartCount={cartCount} />
      <main>
        <Hero onAddToCart={handleAddToCart} />
        <Features />
        <Projects onAddToCart={handleAddToCart} />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
`,

    '/components/Header.jsx': `import React from 'react';

export default function Header({ cartCount }) {
  return (
    <header className="site-header">
      <div className="header-container">
        <a href="#home" className="site-brand">
          <span className="brand-name">Vanguard <span>Chronos</span></span>
        </a>
        <nav className="header-nav">
          <a href="#catalog">Collection</a>
          <a href="#craft">Craftsmanship</a>
          <a href="#reviews">Reviews</a>
          <a href="#contact">VIP Club</a>
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button className="cta-button" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🛒 Cart</span>
            <span style={{ backgroundColor: '#ffffff', color: '#09090b', borderRadius: '999px', padding: '2px 7px', fontSize: '11px', fontWeight: 800 }}>
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
`,

    '/components/Hero.jsx': `import React from 'react';

export default function Hero({ onAddToCart }) {
  return (
    <section id="home" className="hero-section">
      <div className="hero-container">
        <div className="hero-badge">
          <span className="badge-dot"></span>
          <span>Limited Series • Precision Timepieces</span>
        </div>
        <h1 className="hero-title">
          Engineered Precision. <span className="gradient-text">Timeless Luxury.</span>
        </h1>
        <p className="hero-subtitle">
          Forged from Grade-5 Titanium and powered by certified Swiss automatic movements.
        </p>
        <div className="hero-actions">
          <a href="#catalog" className="btn-primary">Shop Collection &rarr;</a>
          <button onClick={onAddToCart} className="btn-secondary">Quick Add Vanguard 01 ($450)</button>
        </div>
      </div>
    </section>
  );
}
`,

    '/components/Features.jsx': `import React from 'react';

export default function Features() {
  const specs = [
    { title: 'Grade-5 Titanium', desc: 'Ultra-lightweight aerospace alloy with scratch-resistant DLC coating.', tag: 'Material' },
    { title: 'Automatic Movement', desc: 'Swiss caliber with 72-hour power reserve and anti-magnetic silicon hairspring.', tag: 'Movement' },
    { title: 'Sapphire Crystal', desc: 'Double-domed sapphire with 5-layer internal anti-reflective coating.', tag: 'Optical' },
  ];

  return (
    <section id="craft" className="skills-section">
      <div className="section-container">
        <div className="section-header">
          <span className="section-eyebrow">Engineering</span>
          <h2>Built for Generations</h2>
          <p>Every timepiece undergoes 200 hours of rigorous chronometric certification.</p>
        </div>
        <div className="skills-grid">
          {specs.map((s, i) => (
            <div key={i} className="skill-card">
              <span className="skill-tag">{s.tag}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`,

    '/components/Projects.jsx': `import React from 'react';

export default function Projects({ onAddToCart }) {
  const products = [
    {
      title: 'Vanguard Chrono Stealth',
      desc: 'Matte black DLC titanium case with luminous indices and Kevlar hybrid strap.',
      price: '$450',
      badge: 'Best Seller',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    },
    {
      title: 'Oceanmaster Diver 300',
      desc: '300m water resistance, ceramic unidirectional bezel, and helium escape valve.',
      price: '$580',
      badge: 'Professional',
      image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&auto=format&fit=crop&q=80',
    },
    {
      title: 'Heritage Automatic Silver',
      desc: 'Sunburst silver dial, exhibition caseback, and Italian vegetable-tanned leather.',
      price: '$380',
      badge: 'Classic',
      image: 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=600&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <section id="catalog" className="projects-section">
      <div className="section-container">
        <div className="section-header">
          <span className="section-eyebrow">Store Catalog</span>
          <h2>The Featured Collection</h2>
          <p>All timepieces include a 5-year international warranty and worldwide priority shipping.</p>
        </div>
        <div className="projects-grid">
          {products.map((prod, i) => (
            <div key={i} className="project-card">
              <div className="project-img-wrap">
                <img src={prod.image} alt={prod.title} />
              </div>
              <div className="project-info">
                <div className="project-tags">
                  <span>{prod.badge}</span>
                  <span>In Stock</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3>{prod.title}</h3>
                  <strong style={{ fontSize: '20px', color: '#09090b' }}>{prod.price}</strong>
                </div>
                <p>{prod.desc}</p>
                <button onClick={onAddToCart} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Add to Cart 🛒
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`,

    '/components/Testimonials.jsx': `import React from 'react';

export default function Testimonials() {
  const reviews = [
    {
      quote: "The finishing on the Grade-5 Titanium case rivals luxury timepieces at ten times the price. Remarkable value.",
      author: 'David Sterling',
      role: 'Horology Journal Contributor',
    },
    {
      quote: 'Worn it every day for 6 months through diving, travel, and meetings. Still looks pristine and keeps perfect time.',
      author: 'Marcus Vance',
      role: 'Verified Buyer, San Francisco',
    },
  ];

  return (
    <section id="reviews" className="testimonials-section">
      <div className="section-container">
        <div className="section-header">
          <span className="section-eyebrow">Owner Reviews</span>
          <h2>Loved by Collectors Worldwide</h2>
        </div>
        <div className="testimonials-grid">
          {reviews.map((r, i) => (
            <div key={i} className="testimonial-card">
              <p className="testimonial-quote">"{r.quote}"</p>
              <div className="testimonial-author">
                <strong>{r.author}</strong>
                <span>{r.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`,

    '/components/Contact.jsx': `import React, { useState } from 'react';

export default function Contact() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    setSubscribed(true);
  };

  return (
    <section id="contact" className="contact-section">
      <div className="section-container">
        <div className="contact-card">
          <div className="contact-intro">
            <span className="section-eyebrow">VIP Membership</span>
            <h2>Join the Vanguard Guild</h2>
            <p>Receive exclusive invitations to private collection releases, collector events, and 10% off your first acquisition.</p>
          </div>
          <div className="contact-form-wrapper">
            {subscribed ? (
              <div className="success-message">
                <h3>Welcome to the Guild</h3>
                <p>Check {email} for your private welcome invitation and acquisition key.</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="contact-form">
                <div>
                  <label>Email Address</label>
                  <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="collector@example.com" />
                </div>
                <button type="submit" className="submit-button">Request Membership</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
`,

    '/components/Footer.jsx': `import React from 'react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <strong>Vanguard <span>Chronos</span></strong>
          <p>Chronometric luxury timepieces engineered for precision.</p>
        </div>
        <div className="footer-links">
          <a href="#catalog">Collection</a>
          <a href="#craft">Craft</a>
          <a href="#contact">VIP</a>
          <a href="#home">Top</a>
        </div>
        <div className="footer-copy">
          <p>© 2026 Vanguard Chronos Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
`,

    '/styles.css': getEcommerceStyles(),
  };

  return {
    summary: `Designed an interactive modern e-commerce storefront for: "${request}" with catalog browsing and cart management.`,
    plan,
    files,
  };
}

// -----------------------------------------------------------------------------
// 3. FITNESS / GYM THEME
// -----------------------------------------------------------------------------
function generateFitnessTheme(request) {
  const plan = [
    ['/App.jsx', 'Main fitness club application with class schedule and trial pass booking.'],
    ['/styles.css', 'High-energy athletic dark mode styling with neon crimson/amber accents.'],
    ['/components/Header.jsx', 'Sticky athletic header with facility links and free pass button.'],
    ['/components/Hero.jsx', 'Dynamic workout hero with athletic tagline and pass claim.'],
    ['/components/Features.jsx', 'Facility highlights: Olympic platforms, HIIT studio, recovery plunge pools.'],
    ['/components/Projects.jsx', 'Training programs: Strength & Conditioning, Hyrox Prep, Mobility.'],
    ['/components/Testimonials.jsx', 'Member transformation stories.'],
    ['/components/Contact.jsx', 'Free 3-Day VIP pass claim form.'],
    ['/components/Footer.jsx', 'Location map, opening hours, and athletic social links.'],
  ];

  const files = {
    '/App.jsx': `import React from 'react';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Features from './components/Features.jsx';
import Projects from './components/Projects.jsx';
import Testimonials from './components/Testimonials.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import './styles.css';

export default function App() {
  return (
    <div className="site-wrapper fitness-theme">
      <Header />
      <main>
        <Hero />
        <Features />
        <Projects />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
`,

    '/components/Header.jsx': `import React from 'react';

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-container">
        <a href="#home" className="site-brand">
          <span className="brand-name">TITAN <span>FITNESS</span></span>
        </a>
        <nav className="header-nav">
          <a href="#programs">Programs</a>
          <a href="#facilities">Facilities</a>
          <a href="#results">Results</a>
          <a href="#pass">Free Pass</a>
        </nav>
        <a href="#pass" className="cta-button" style={{ backgroundColor: '#ef4444' }}>Claim Free Pass</a>
      </div>
    </header>
  );
}
`,

    '/components/Hero.jsx': `import React from 'react';

export default function Hero() {
  return (
    <section id="home" className="hero-section">
      <div className="hero-container">
        <div className="hero-badge">
          <span className="badge-dot" style={{ backgroundColor: '#ef4444' }}></span>
          <span>Elite Training Facility • 24/7 Access</span>
        </div>
        <h1 className="hero-title">
          Unleash Your <span className="gradient-text">Ultimate Strength</span>
        </h1>
        <p className="hero-subtitle">
          World-class coaching, Eleiko Olympic equipment, and high-performance recovery suites.
        </p>
        <div className="hero-actions">
          <a href="#pass" className="btn-primary" style={{ backgroundColor: '#ef4444' }}>Start Free Trial &rarr;</a>
          <a href="#programs" className="btn-secondary">View Programs</a>
        </div>
      </div>
    </section>
  );
}
`,

    '/components/Features.jsx': `import React from 'react';

export default function Features() {
  const pillars = [
    { title: 'Olympic Lifting Arena', desc: '14 custom Eleiko platforms with calibrated competition plates and bars.', tag: 'Strength' },
    { title: 'Metabolic Conditioning', desc: 'High-intensity conditioning zones featuring ski ergs, assault runners, and turf lanes.', tag: 'Endurance' },
    { title: 'Cryo & Sauna Recovery', desc: 'Finnish cedar dry saunas and 3°C cold plunge tubs to accelerate muscular repair.', tag: 'Recovery' },
  ];

  return (
    <section id="facilities" className="skills-section">
      <div className="section-container">
        <div className="section-header">
          <span className="section-eyebrow">The Facility</span>
          <h2>Engineered for Peak Athletes</h2>
          <p>No distractions. Just the tools and culture required for personal transformation.</p>
        </div>
        <div className="skills-grid">
          {pillars.map((p, i) => (
            <div key={i} className="skill-card">
              <span className="skill-tag" style={{ color: '#ef4444', backgroundColor: '#fee2e2' }}>{p.tag}</span>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`,

    '/components/Projects.jsx': `import React from 'react';

export default function Projects() {
  const programs = [
    {
      title: 'Titan Hypertrophy Blueprint',
      desc: 'Periodized progressive overload program designed to maximize lean muscle mass and structural strength.',
      duration: '12 Weeks',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80',
    },
    {
      title: 'Hyrox Competition Training',
      desc: 'Race-specific conditioning combining functional strength stations with threshold aerobic endurance.',
      duration: '8 Weeks',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
    },
    {
      title: 'Athletic Mobility & Flow',
      desc: 'Targeted joint decompression, deep fascia mobility, and active range of motion enhancement.',
      duration: 'Ongoing',
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <section id="programs" className="projects-section">
      <div className="section-container">
        <div className="section-header">
          <span className="section-eyebrow">Training Programs</span>
          <h2>Targeted Coaching Tracks</h2>
        </div>
        <div className="projects-grid">
          {programs.map((prog, i) => (
            <div key={i} className="project-card">
              <div className="project-img-wrap">
                <img src={prog.image} alt={prog.title} />
              </div>
              <div className="project-info">
                <div className="project-tags">
                  <span>{prog.duration}</span>
                  <span>Coached</span>
                </div>
                <h3>{prog.title}</h3>
                <p>{prog.desc}</p>
                <a href="#pass" className="project-link" style={{ color: '#ef4444' }}>Join Program &rarr;</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`,

    '/components/Testimonials.jsx': `import React from 'react';

export default function Testimonials() {
  const stories = [
    {
      quote: "Dropped 14kg and hit a 200kg deadlift in 6 months. The coaches and the culture at Titan are second to none.",
      author: 'Marcus Vance',
      role: 'Member for 2 Years',
    },
    {
      quote: 'The recovery suites and Olympic platforms completely elevated my athletic performance for marathon prep.',
      author: 'Jessica Huang',
      role: 'Competitive Runner & Triathlete',
    },
  ];

  return (
    <section id="results" className="testimonials-section">
      <div className="section-container">
        <div className="section-header">
          <span className="section-eyebrow">Transformation</span>
          <h2>Real Member Results</h2>
        </div>
        <div className="testimonials-grid">
          {stories.map((s, i) => (
            <div key={i} className="testimonial-card">
              <p className="testimonial-quote">"{s.quote}"</p>
              <div className="testimonial-author">
                <strong>{s.author}</strong>
                <span>{s.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`,

    '/components/Contact.jsx': `import React, { useState } from 'react';

export default function Contact() {
  const [claimed, setClaimed] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });

  return (
    <section id="pass" className="contact-section">
      <div className="section-container">
        <div className="contact-card">
          <div className="contact-intro">
            <span className="section-eyebrow">Free Experience</span>
            <h2>Claim Your 3-Day VIP Pass</h2>
            <p>Experience everything Titan Fitness has to offer. Zero obligation, full access to weights, classes, and cold plunge.</p>
          </div>
          <div className="contact-form-wrapper">
            {claimed ? (
              <div className="success-message">
                <h3 style={{ color: '#ef4444' }}>VIP Pass Activated!</h3>
                <p>Show your digital pass on arrival. We've sent full facility details to {form.email}.</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setClaimed(true); }} className="contact-form">
                <div>
                  <label>Full Name</label>
                  <input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Alex Rivera" />
                </div>
                <div>
                  <label>Email Address</label>
                  <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="alex@example.com" />
                </div>
                <div>
                  <label>Phone Number</label>
                  <input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="(555) 000-0000" />
                </div>
                <button type="submit" className="submit-button" style={{ backgroundColor: '#ef4444' }}>Claim VIP Pass</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
`,

    '/components/Footer.jsx': `import React from 'react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <strong>TITAN <span>FITNESS</span></strong>
          <p>High-performance strength, conditioning & recovery club.</p>
        </div>
        <div className="footer-links">
          <a href="#programs">Programs</a>
          <a href="#facilities">Facilities</a>
          <a href="#pass">Free Pass</a>
          <a href="#home">Top</a>
        </div>
        <div className="footer-copy">
          <p>© 2026 Titan Fitness Inc. 24/7 Access.</p>
        </div>
      </div>
    </footer>
  );
}
`,

    '/styles.css': getFitnessStyles(),
  };

  return {
    summary: `Designed a high-intensity athletic club website for: "${request}" with program tracks and VIP pass booking.`,
    plan,
    files,
  };
}

// -----------------------------------------------------------------------------
// 4. SAAS / AI THEME
// -----------------------------------------------------------------------------
function generateSaasTheme(request) {
  const plan = [
    ['/App.jsx', 'Main SaaS product shell with features, interactive pricing switcher, and CTA.'],
    ['/styles.css', 'Modern dark-mode glassmorphism with vivid cyan and purple gradient accents.'],
    ['/components/Header.jsx', 'Sticky navbar with brand logo, docs links, and sign-in CTA.'],
    ['/components/Hero.jsx', 'High-impact AI product hero with live terminal snippet and start trial button.'],
    ['/components/Features.jsx', 'Core platform pillars: distributed pipelines, low latency, model fine-tuning.'],
    ['/components/Projects.jsx', 'Interactive feature cards showcasing dashboard capabilities and SDK.'],
    ['/components/Testimonials.jsx', 'Quotes from engineering leaders and founders.'],
    ['/components/Contact.jsx', 'Enterprise trial access request form.'],
    ['/components/Footer.jsx', 'Developer documentation links, API status, and copyright.'],
  ];

  const files = {
    '/App.jsx': `import React, { useState } from 'react';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Features from './components/Features.jsx';
import Projects from './components/Projects.jsx';
import Testimonials from './components/Testimonials.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import './styles.css';

export default function App() {
  return (
    <div className="site-wrapper saas-theme">
      <Header />
      <main>
        <Hero />
        <Features />
        <Projects />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
`,

    '/components/Header.jsx': `import React from 'react';

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-container">
        <a href="#home" className="site-brand">
          <span className="brand-name">⚡ Synapse <span>AI</span></span>
        </a>
        <nav className="header-nav">
          <a href="#features">Platform</a>
          <a href="#capabilities">Capabilities</a>
          <a href="#reviews">Enterprise</a>
          <a href="#contact">Pricing</a>
        </nav>
        <a href="#contact" className="cta-button" style={{ backgroundColor: '#6366f1' }}>Get Started Free</a>
      </div>
    </header>
  );
}
`,

    '/components/Hero.jsx': `import React from 'react';

export default function Hero() {
  return (
    <section id="home" className="hero-section">
      <div className="hero-container">
        <div className="hero-badge">
          <span className="badge-dot" style={{ backgroundColor: '#6366f1' }}></span>
          <span>Synapse v3.2 Released • Sub-50ms Inference</span>
        </div>
        <h1 className="hero-title">
          Autonomous AI Pipelines <span className="gradient-text">for Modern Teams</span>
        </h1>
        <p className="hero-subtitle">
          Deploy, fine-tune, and orchestrate generative intelligence pipelines with enterprise observability.
        </p>
        <div className="hero-actions">
          <a href="#contact" className="btn-primary" style={{ backgroundColor: '#6366f1' }}>Start Building Free &rarr;</a>
          <a href="#capabilities" className="btn-secondary">Explore Platform</a>
        </div>
      </div>
    </section>
  );
}
`,

    '/components/Features.jsx': `import React from 'react';

export default function Features() {
  const capabilities = [
    { title: 'Edge Model Routing', desc: 'Dynamically routes inference requests to the lowest-cost, fastest model globally.', tag: 'Latency' },
    { title: 'Vector Embeddings Cache', desc: 'Semantic in-memory caching that reduces repetitive LLM token costs by up to 78%.', tag: 'Efficiency' },
    { title: 'SOC-2 Type II Certified', desc: 'Zero data retention on public models with optional on-premise VPC deployment.', tag: 'Security' },
  ];

  return (
    <section id="features" className="skills-section">
      <div className="section-container">
        <div className="section-header">
          <span className="section-eyebrow">Architecture</span>
          <h2>Engineered for Scale</h2>
          <p>Handle millions of real-time requests without infrastructure headaches.</p>
        </div>
        <div className="skills-grid">
          {capabilities.map((c, i) => (
            <div key={i} className="skill-card">
              <span className="skill-tag" style={{ color: '#6366f1', backgroundColor: '#e0e7ff' }}>{c.tag}</span>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`,

    '/components/Projects.jsx': `import React from 'react';

export default function Projects() {
  const products = [
    {
      title: 'Prompt Flow Orchestrator',
      desc: 'Visual node-based graph editor for chaining agents, APIs, and retrieval pipelines.',
      tags: ['Drag & Drop', 'Real-time'],
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
    },
    {
      title: 'Model Evaluation Suite',
      desc: 'Automated benchmarking across accuracy, hallucination rate, and execution speed.',
      tags: ['Benchmarking', 'Analytics'],
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
    },
    {
      title: 'Enterprise Gateway',
      desc: 'Rate-limiting, audit trails, and unified token budgeting across all LLM providers.',
      tags: ['Governance', 'Security'],
      image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <section id="capabilities" className="projects-section">
      <div className="section-container">
        <div className="section-header">
          <span className="section-eyebrow">Capabilities</span>
          <h2>Integrated Intelligence Suite</h2>
        </div>
        <div className="projects-grid">
          {products.map((p, i) => (
            <div key={i} className="project-card">
              <div className="project-img-wrap">
                <img src={p.image} alt={p.title} />
              </div>
              <div className="project-info">
                <div className="project-tags">
                  {p.tags.map((t, idx) => (
                    <span key={idx}>{t}</span>
                  ))}
                </div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
                <a href="#contact" className="project-link" style={{ color: '#6366f1' }}>Learn More &rarr;</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`,

    '/components/Testimonials.jsx': `import React from 'react';

export default function Testimonials() {
  const reviews = [
    {
      quote: "Synapse cut our AI deployment cycles from 3 weeks to under an hour. The latency improvements are game changing.",
      author: 'Sarah Jenkins',
      role: 'VP of Engineering, CloudScale',
    },
    {
      quote: 'The semantic caching alone saved our company over $40,000 in monthly OpenAI token bills.',
      author: 'Marcus Vance',
      role: 'CTO, DataMesh AI',
    },
  ];

  return (
    <section id="reviews" className="testimonials-section">
      <div className="section-container">
        <div className="section-header">
          <span className="section-eyebrow">Social Proof</span>
          <h2>Trusted by AI Innovators</h2>
        </div>
        <div className="testimonials-grid">
          {reviews.map((r, i) => (
            <div key={i} className="testimonial-card">
              <p className="testimonial-quote">"{r.quote}"</p>
              <div className="testimonial-author">
                <strong>{r.author}</strong>
                <span>{r.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`,

    '/components/Contact.jsx': `import React, { useState } from 'react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', company: '' });

  return (
    <section id="contact" className="contact-section">
      <div className="section-container">
        <div className="contact-card">
          <div className="contact-intro">
            <span className="section-eyebrow">Enterprise Access</span>
            <h2>Request an API Key</h2>
            <p>Get immediate access to our sandbox environment with $100 in complimentary API credits.</p>
          </div>
          <div className="contact-form-wrapper">
            {submitted ? (
              <div className="success-message">
                <h3 style={{ color: '#6366f1' }}>API Key Generated!</h3>
                <p>We have dispatched your sandbox credentials to {form.email}.</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="contact-form">
                <div>
                  <label>Full Name</label>
                  <input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Alex Developer" />
                </div>
                <div>
                  <label>Work Email</label>
                  <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="alex@company.com" />
                </div>
                <div>
                  <label>Company / Organization</label>
                  <input required type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Acme Labs Inc." />
                </div>
                <button type="submit" className="submit-button" style={{ backgroundColor: '#6366f1' }}>Generate Sandbox Key</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
`,

    '/components/Footer.jsx': `import React from 'react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <strong>⚡ Synapse <span>AI</span></strong>
          <p>Autonomous AI infrastructure for high-scale engineering teams.</p>
        </div>
        <div className="footer-links">
          <a href="#features">Platform</a>
          <a href="#capabilities">Docs</a>
          <a href="#contact">Pricing</a>
          <a href="#home">Top</a>
        </div>
        <div className="footer-copy">
          <p>© 2026 Synapse Technologies. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
`,

    '/styles.css': getSaasStyles(),
  };

  return {
    summary: `Designed a cutting-edge AI SaaS platform landing page for: "${request}" with architecture showcase and API gateway.`,
    plan,
    files,
  };
}

// -----------------------------------------------------------------------------
// 5. CREATIVE AGENCY THEME
// -----------------------------------------------------------------------------
function generateAgencyTheme(request) {
  const plan = [
    ['/App.jsx', 'Main agency portfolio with services, case studies, and quote request.'],
    ['/styles.css', 'Bold brutalist modern design with high-contrast typography and smooth cards.'],
    ['/components/Header.jsx', 'Minimalist header with studio navigation and inquiry button.'],
    ['/components/Hero.jsx', 'High-impact agency headline with marquee awards and start project CTA.'],
    ['/components/Features.jsx', 'Agency disciplines: Brand Identity, UX/UI, Full-Stack Engineering.'],
    ['/components/Projects.jsx', 'Featured client case studies with outcome metrics.'],
    ['/components/Testimonials.jsx', 'Client leadership testimonials.'],
    ['/components/Contact.jsx', 'Project inquiry and RFP intake form.'],
    ['/components/Footer.jsx', 'Studio locations (NY, London, Tokyo), credits, and social links.'],
  ];

  const files = {
    '/App.jsx': `import React from 'react';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Features from './components/Features.jsx';
import Projects from './components/Projects.jsx';
import Testimonials from './components/Testimonials.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import './styles.css';

export default function App() {
  return (
    <div className="site-wrapper agency-theme">
      <Header />
      <main>
        <Hero />
        <Features />
        <Projects />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
`,

    '/components/Header.jsx': `import React from 'react';

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-container">
        <a href="#home" className="site-brand">
          <span className="brand-name">KINETIC <span>STUDIO</span></span>
        </a>
        <nav className="header-nav">
          <a href="#services">Services</a>
          <a href="#works">Case Studies</a>
          <a href="#clients">Clients</a>
          <a href="#contact">Contact</a>
        </nav>
        <a href="#contact" className="cta-button" style={{ backgroundColor: '#09090b' }}>Start Project</a>
      </div>
    </header>
  );
}
`,

    '/components/Hero.jsx': `import React from 'react';

export default function Hero() {
  return (
    <section id="home" className="hero-section">
      <div className="hero-container">
        <div className="hero-badge">
          <span className="badge-dot" style={{ backgroundColor: '#10b981' }}></span>
          <span>Awwwards Agency of the Year 2026</span>
        </div>
        <h1 className="hero-title">
          We Build Brands That Resonate & <span className="gradient-text">Products That Scale</span>
        </h1>
        <p className="hero-subtitle">
          A hybrid digital design and engineering studio partnering with pioneering founders worldwide.
        </p>
        <div className="hero-actions">
          <a href="#contact" className="btn-primary" style={{ backgroundColor: '#09090b' }}>Initiate Inquiry &rarr;</a>
          <a href="#works" className="btn-secondary">View Case Studies</a>
        </div>
      </div>
    </section>
  );
}
`,

    '/components/Features.jsx': `import React from 'react';

export default function Features() {
  const services = [
    { title: 'Brand Architecture', desc: 'Naming, verbal identity, design systems, and cohesive brand guidelines.', tag: 'Brand' },
    { title: 'Digital Product Design', desc: 'End-to-end UX research, wireframing, high-fidelity UI, and micro-interactions.', tag: 'Design' },
    { title: 'Full-Stack Engineering', desc: 'High-performance React/Next.js platforms with sub-second page loads and cloud scale.', tag: 'Build' },
  ];

  return (
    <section id="services" className="skills-section">
      <div className="section-container">
        <div className="section-header">
          <span className="section-eyebrow">Capabilities</span>
          <h2>Disciplines of Excellence</h2>
        </div>
        <div className="skills-grid">
          {services.map((s, i) => (
            <div key={i} className="skill-card">
              <span className="skill-tag" style={{ color: '#09090b', backgroundColor: '#f4f4f5' }}>{s.tag}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`,

    '/components/Projects.jsx': `import React from 'react';

export default function Projects() {
  const works = [
    {
      title: 'Aura Health Platform',
      desc: 'Complete brand repositioning and mobile-first telemetry application resulting in 3.4M active users.',
      tags: ['Branding', 'Mobile App'],
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
    },
    {
      title: 'Monolith Architectural Commerce',
      desc: 'Headless global e-commerce experience with 3D product visualizer and multi-currency checkout.',
      tags: ['3D WebGL', 'Headless'],
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <section id="works" className="projects-section">
      <div className="section-container">
        <div className="section-header">
          <span className="section-eyebrow">Portfolio</span>
          <h2>Selected Client Work</h2>
        </div>
        <div className="projects-grid">
          {works.map((w, i) => (
            <div key={i} className="project-card">
              <div className="project-img-wrap">
                <img src={w.image} alt={w.title} />
              </div>
              <div className="project-info">
                <div className="project-tags">
                  {w.tags.map((t, idx) => (
                    <span key={idx}>{t}</span>
                  ))}
                </div>
                <h3>{w.title}</h3>
                <p>{w.desc}</p>
                <a href="#contact" className="project-link" style={{ color: '#09090b' }}>View Case Study &rarr;</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`,

    '/components/Testimonials.jsx': `import React from 'react';

export default function Testimonials() {
  const testimonials = [
    {
      quote: "Kinetic Studio transformed our brand into an undisputed industry category leader. Their craft is breathtaking.",
      author: 'Elena Rostova',
      role: 'Chief Marketing Officer, HyperTrend',
    },
    {
      quote: 'The team was proactive, highly rigorous, and shipped our web application ahead of an aggressive deadline.',
      author: 'James Thorpe',
      role: 'Founder & CEO, Luminary',
    },
  ];

  return (
    <section id="clients" className="testimonials-section">
      <div className="section-container">
        <div className="section-header">
          <span className="section-eyebrow">Testimonials</span>
          <h2>Trusted by Category Leaders</h2>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card">
              <p className="testimonial-quote">"{t.quote}"</p>
              <div className="testimonial-author">
                <strong>{t.author}</strong>
                <span>{t.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`,

    '/components/Contact.jsx': `import React, { useState } from 'react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', budget: '$25k - $50k', details: '' });

  return (
    <section id="contact" className="contact-section">
      <div className="section-container">
        <div className="contact-card">
          <div className="contact-intro">
            <span className="section-eyebrow">Get Started</span>
            <h2>Let's Build Together</h2>
            <p>Tell us about your upcoming challenge or vision. We respond with initial concepts within 24 hours.</p>
          </div>
          <div className="contact-form-wrapper">
            {submitted ? (
              <div className="success-message">
                <h3>Proposal Request Received</h3>
                <p>Thank you, {form.name}. Our partner director will contact you at {form.email} shortly.</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="contact-form">
                <div>
                  <label>Your Name</label>
                  <input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Sarah Connor" />
                </div>
                <div>
                  <label>Work Email</label>
                  <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="sarah@brand.com" />
                </div>
                <div>
                  <label>Target Budget</label>
                  <select value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                    <option value="$10k - $25k">$10k - $25k</option>
                    <option value="$25k - $50k">$25k - $50k</option>
                    <option value="$50k - $100k">$50k - $100k</option>
                    <option value="$100k+">$100k+</option>
                  </select>
                </div>
                <div>
                  <label>Project Overview</label>
                  <textarea rows={3} value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} placeholder="Describe what you want to achieve…" />
                </div>
                <button type="submit" className="submit-button" style={{ backgroundColor: '#09090b' }}>Submit Project Brief</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
`,

    '/components/Footer.jsx': `import React from 'react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <strong>KINETIC <span>STUDIO</span></strong>
          <p>Global digital design & engineering agency.</p>
        </div>
        <div className="footer-links">
          <a href="#services">Services</a>
          <a href="#works">Works</a>
          <a href="#contact">Contact</a>
          <a href="#home">Top</a>
        </div>
        <div className="footer-copy">
          <p>© 2026 Kinetic Studio LLC. New York • London • Tokyo.</p>
        </div>
      </div>
    </footer>
  );
}
`,

    '/styles.css': getAgencyStyles(),
  };

  return {
    summary: `Designed a modern creative digital agency website for: "${request}" with case studies and interactive brief intake.`,
    plan,
    files,
  };
}

// -----------------------------------------------------------------------------
// 6. PORTFOLIO THEME (Developer, Designer, Engineer)
// -----------------------------------------------------------------------------
function generatePortfolioTheme(request) {
  // Extract custom name if given (e.g., "for John Doe", "for Sarah", "named Alex")
  let personName = 'Alex Morgan';
  const nameMatch = request.match(/(?:for|named|called|by)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/);
  if (nameMatch && nameMatch[1] && !/developer|engineer|designer|website|portfolio|web/i.test(nameMatch[1])) {
    personName = nameMatch[1];
  }

  // Extract role if specified (e.g. "software engineer", "frontend developer", etc.)
  let roleTitle = 'Full-Stack Developer';
  if (/frontend/i.test(request)) roleTitle = 'Frontend Engineer';
  else if (/backend/i.test(request)) roleTitle = 'Backend & Cloud Architect';
  else if (/fullstack|full-stack/i.test(request)) roleTitle = 'Senior Full-Stack Engineer';
  else if (/designer|ui|ux/i.test(request)) roleTitle = 'UI/UX & Product Designer';
  else if (/ai|genai|machine learning|ml|data/i.test(request)) roleTitle = 'AI & Machine Learning Engineer';
  else if (/mobile|ios|android/i.test(request)) roleTitle = 'Mobile Systems Engineer';
  else if (/devops|cloud|sre/i.test(request)) roleTitle = 'DevOps & Cloud Engineer';
  else if (/cyber|security/i.test(request)) roleTitle = 'Cybersecurity Architect';
  else if (/photograph/i.test(request)) roleTitle = 'Visual & Editorial Photographer';

  const plan = [
    ['/App.jsx', 'Main application shell rendering navigation, hero, skills, projects, testimonials, and contact.'],
    ['/styles.css', 'Global CSS styles, modern typography, bento-grid layouts, and responsive utilities.'],
    ['/components/Header.jsx', 'Sticky navigation bar with avatar, site links, and contact CTA.'],
    ['/components/Hero.jsx', 'High-impact personal hero with developer badge, headline, and resume links.'],
    ['/components/Features.jsx', 'Technical skills and architecture expertise showcase.'],
    ['/components/Projects.jsx', 'Featured project case studies with live preview demo links.'],
    ['/components/Testimonials.jsx', 'Client quotes and recommendations from collaborators.'],
    ['/components/Contact.jsx', 'Interactive contact form for inquiries and opportunities.'],
    ['/components/Footer.jsx', 'Social profiles (GitHub, LinkedIn, Twitter) and copyright.'],
  ];

  const files = {
    '/App.jsx': `import React, { useState } from 'react';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Features from './components/Features.jsx';
import Projects from './components/Projects.jsx';
import Testimonials from './components/Testimonials.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import './styles.css';

export default function App() {
  const [activeNav, setActiveNav] = useState('home');

  return (
    <div className="site-wrapper portfolio-theme">
      <Header activeNav={activeNav} setActiveNav={setActiveNav} />
      <main>
        <Hero />
        <Features />
        <Projects />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
`,

    '/components/Header.jsx': `import React from 'react';

export default function Header({ activeNav, setActiveNav }) {
  return (
    <header className="site-header">
      <div className="header-container">
        <a href="#home" className="site-brand">
          <div className="avatar-circle">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
              alt="Avatar" 
            />
          </div>
          <span className="brand-name">${personName}</span>
        </a>
        <nav className="header-nav">
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#testimonials">Testimonials</a>
          <a href="#contact">Contact</a>
        </nav>
        <a href="#contact" className="cta-button">Get In Touch</a>
      </div>
    </header>
  );
}
`,

    '/components/Hero.jsx': `import React from 'react';

export default function Hero() {
  return (
    <section id="home" className="hero-section">
      <div className="hero-container">
        <div className="hero-badge">
          <span className="badge-dot"></span>
          <span>Available for New Projects • 2026</span>
        </div>
        <h1 className="hero-title">
          Hi, I'm <span className="gradient-text">${personName}</span>
        </h1>
        <p className="hero-subtitle">
          ${roleTitle} crafting performant, pixel-perfect digital experiences that scale and delight.
        </p>
        <div className="hero-actions">
          <a href="#projects" className="btn-primary">Explore My Work &rarr;</a>
          <a href="#contact" className="btn-secondary">Let's Talk</a>
        </div>
      </div>
    </section>
  );
}
`,

    '/components/Features.jsx': `import React from 'react';

export default function Features() {
  const skills = [
    { name: 'Frontend Architecture', desc: 'React 19, TypeScript, Next.js, high-speed rendering, and micro-animations.', tag: 'Core' },
    { name: 'Backend & APIs', desc: 'Node.js, Express, PostgreSQL, REST & WebSocket streaming APIs.', tag: 'Scale' },
    { name: 'AI & Systems', desc: 'Autonomous agent pipelines, LLM integration, and real-time data flows.', tag: 'AI' },
  ];

  return (
    <section id="skills" className="skills-section">
      <div className="section-container">
        <div className="section-header">
          <span className="section-eyebrow">Expertise</span>
          <h2>Crafted with precision & modern tech</h2>
          <p>Over 7 years of building robust, user-centric web applications.</p>
        </div>
        <div className="skills-grid">
          {skills.map((s, i) => (
            <div key={i} className="skill-card">
              <span className="skill-tag">{s.tag}</span>
              <h3>{s.name}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`,

    '/components/Projects.jsx': `import React from 'react';

export default function Projects() {
  const projects = [
    {
      title: 'NeuralForge Studio',
      desc: 'Next-generation visual prompt workspace and workflow orchestrator for generative models.',
      tags: ['React', 'Node.js', 'WebSockets'],
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    },
    {
      title: 'Pulse Telemetry Engine',
      desc: 'Real-time telemetry dashboard handling 50k events/sec with sub-second visual updates.',
      tags: ['TypeScript', 'Canvas', 'Redis'],
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
    },
    {
      title: 'Aura Commerce Platform',
      desc: 'Headless storefront with dynamic pricing, multi-currency checkout, and instant search.',
      tags: ['Next.js', 'Stripe', 'GraphQL'],
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <section id="projects" className="projects-section">
      <div className="section-container">
        <div className="section-header">
          <span className="section-eyebrow">Portfolio</span>
          <h2>Featured Works & Case Studies</h2>
        </div>
        <div className="projects-grid">
          {projects.map((p, i) => (
            <div key={i} className="project-card">
              <div className="project-img-wrap">
                <img src={p.image} alt={p.title} />
              </div>
              <div className="project-info">
                <div className="project-tags">
                  {p.tags.map((t, idx) => (
                    <span key={idx}>{t}</span>
                  ))}
                </div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
                <a href="#contact" className="project-link">View Project &rarr;</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`,

    '/components/Testimonials.jsx': `import React from 'react';

export default function Testimonials() {
  const reviews = [
    {
      quote: "Alex delivered our core product 2 weeks ahead of schedule. World-class engineering and exceptional UX.",
      author: 'Sarah Jenkins',
      role: 'VP of Product, CloudScale',
    },
    {
      quote: "One of the most talented engineers I've worked with. Clean architecture and crisp attention to detail.",
      author: 'Marcus Vance',
      role: 'Founder & CEO, HyperStream',
    },
  ];

  return (
    <section id="testimonials" className="testimonials-section">
      <div className="section-container">
        <div className="section-header">
          <span className="section-eyebrow">Recommendations</span>
          <h2>Trusted by founders & leaders</h2>
        </div>
        <div className="testimonials-grid">
          {reviews.map((r, i) => (
            <div key={i} className="testimonial-card">
              <p className="testimonial-quote">"{r.quote}"</p>
              <div className="testimonial-author">
                <strong>{r.author}</strong>
                <span>{r.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`,

    '/components/Contact.jsx': `import React, { useState } from 'react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  return (
    <section id="contact" className="contact-section">
      <div className="section-container">
        <div className="contact-card">
          <div className="contact-intro">
            <span className="section-eyebrow">Get In Touch</span>
            <h2>Let's build something exceptional together.</h2>
            <p>Have an exciting opportunity or product idea? Send a note and I'll reply within 24 hours.</p>
          </div>
          <div className="contact-form-wrapper">
            {submitted ? (
              <div className="success-message">
                <h3>Message Received!</h3>
                <p>Thanks for reaching out, {form.name}. I'll get back to you promptly at {form.email}.</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="contact-form">
                <div>
                  <label>Your Name</label>
                  <input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Sarah Connor" />
                </div>
                <div>
                  <label>Email Address</label>
                  <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="sarah@example.com" />
                </div>
                <div>
                  <label>Your Message</label>
                  <textarea rows={3} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell me about your project or role…" />
                </div>
                <button type="submit" className="submit-button">Send Message</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
`,

    '/components/Footer.jsx': `import React from 'react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <strong>Alex <span>Morgan</span></strong>
          <p>${roleTitle} crafting performant web applications.</p>
        </div>
        <div className="footer-links">
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
          <a href="#home">Top</a>
        </div>
        <div className="footer-copy">
          <p>© 2026 Alex Morgan. Built with clean code.</p>
        </div>
      </div>
    </footer>
  );
}
`,

    '/styles.css': getBaseStyles('#4f46e5', '#8b5cf6', '#ede9fe', '#6d28d9'),
  };

  return {
    summary: `Designed a personalized professional portfolio for: "${request}" featuring technical skills, case studies, and recommendations.`,
    plan,
    files,
  };
}

// -----------------------------------------------------------------------------
// CSS STYLES FOR THEMES
// -----------------------------------------------------------------------------
function getBaseStyles(primary, secondary, lightTag, tagText) {
  return `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif; color: #0f172a; background: #ffffff; line-height: 1.6; }
.site-wrapper { min-height: 100vh; display: flex; flex-direction: column; }
.site-header { position: sticky; top: 0; z-index: 50; background: rgba(255,255,255,0.85); backdrop-filter: blur(12px); border-bottom: 1px solid #e2e8f0; height: 68px; display: flex; align-items: center; }
.header-container { max-width: 1160px; width: 100%; margin: 0 auto; padding: 0 24px; display: flex; align-items: center; justify-content: space-between; }
.site-brand { display: flex; align-items: center; gap: 10px; text-decoration: none; color: #0f172a; font-weight: 800; font-size: 19px; }
.avatar-circle { width: 34px; height: 34px; border-radius: 50%; overflow: hidden; }
.avatar-circle img { width: 100%; height: 100%; object-fit: cover; }
.header-nav { display: flex; gap: 28px; }
.header-nav a { text-decoration: none; color: #64748b; font-size: 14px; font-weight: 500; transition: color 0.15s; }
.header-nav a:hover { color: #0f172a; }
.cta-button { background: ${primary}; color: #ffffff; text-decoration: none; font-size: 13.5px; font-weight: 600; padding: 8px 18px; border-radius: 8px; border: 0; cursor: pointer; transition: opacity 0.15s; }
.cta-button:hover { opacity: 0.9; }

.hero-section { padding: 90px 24px 70px; text-align: center; background: radial-gradient(circle at 50% 20%, rgba(79, 70, 229, 0.05) 0%, transparent 70%); }
.hero-container { max-width: 800px; margin: 0 auto; }
.hero-badge { display: inline-flex; align-items: center; gap: 8px; background: #f1f5f9; border: 1px solid #e2e8f0; padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-weight: 600; color: #475569; margin-bottom: 24px; }
.badge-dot { width: 8px; height: 8px; border-radius: 50%; background: #10b981; }
.hero-title { font-size: clamp(38px, 6vw, 64px); font-weight: 800; line-height: 1.1; letter-spacing: -0.04em; color: #0f172a; margin-bottom: 20px; }
.gradient-text { background: linear-gradient(135deg, ${primary} 0%, ${secondary} 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.hero-subtitle { font-size: clamp(16px, 2vw, 19px); color: #64748b; max-width: 620px; margin: 0 auto 32px; }
.hero-actions { display: flex; align-items: center; justify-content: center; gap: 14px; flex-wrap: wrap; }
.btn-primary { background: ${primary}; color: #ffffff; padding: 12px 24px; border-radius: 8px; font-size: 14.5px; font-weight: 600; text-decoration: none; border: 0; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
.btn-secondary { background: #ffffff; color: #0f172a; padding: 12px 24px; border-radius: 8px; font-size: 14.5px; font-weight: 600; text-decoration: none; border: 1px solid #cbd5e1; cursor: pointer; }

.section-container { max-width: 1160px; margin: 0 auto; padding: 80px 24px; }
.section-header { text-align: center; max-width: 600px; margin: 0 auto 48px; }
.section-eyebrow { display: inline-block; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: ${primary}; margin-bottom: 8px; }
.section-header h2 { font-size: clamp(28px, 4vw, 36px); font-weight: 800; letter-spacing: -0.03em; color: #0f172a; margin-bottom: 10px; }
.section-header p { color: #64748b; font-size: 15.5px; }

.skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; }
.skill-card { padding: 28px; border: 1px solid #e2e8f0; border-radius: 16px; background: #ffffff; }
.skill-tag { display: inline-block; font-size: 11px; font-weight: 700; padding: 4px 10px; background: ${lightTag}; color: ${tagText}; border-radius: 6px; margin-bottom: 12px; }
.skill-card h3 { font-size: 18px; font-weight: 700; margin-bottom: 8px; }
.skill-card p { font-size: 14px; color: #64748b; }

.projects-section { background: #f8fafc; }
.projects-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; }
.project-card { border-radius: 14px; border: 1px solid #e2e8f0; background: #ffffff; overflow: hidden; display: flex; flex-direction: column; }
.project-img-wrap { height: 190px; overflow: hidden; }
.project-img-wrap img { width: 100%; height: 100%; object-fit: cover; }
.project-info { padding: 22px; flex: 1; display: flex; flex-direction: column; }
.project-tags { display: flex; gap: 6px; margin-bottom: 10px; }
.project-tags span { font-size: 11px; font-weight: 600; background: #f1f5f9; color: #475569; padding: 2px 8px; border-radius: 4px; }
.project-info h3 { font-size: 18px; font-weight: 700; margin-bottom: 6px; }
.project-info p { font-size: 13.5px; color: #64748b; margin-bottom: 16px; flex: 1; }
.project-link { color: ${primary}; font-weight: 700; font-size: 13.5px; text-decoration: none; }

.testimonials-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
.testimonial-card { padding: 28px; border-radius: 14px; border: 1px solid #e2e8f0; background: #ffffff; }
.testimonial-quote { font-size: 15px; font-style: italic; color: #334155; margin-bottom: 16px; }
.testimonial-author strong { display: block; font-size: 14px; color: #0f172a; }
.testimonial-author span { font-size: 12.5px; color: #64748b; }

.contact-section { background: #f8fafc; }
.contact-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 18px; padding: 40px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
.contact-intro h2 { font-size: 28px; font-weight: 800; margin: 8px 0 12px; }
.contact-intro p { color: #64748b; font-size: 14.5px; }
.contact-form { display: flex; flex-direction: column; gap: 14px; }
.contact-form label { display: block; font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 4px; }
.contact-form input, .contact-form textarea, .contact-form select { width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-family: inherit; font-size: 14px; outline: none; }
.contact-form input:focus, .contact-form textarea:focus { border-color: ${primary}; }
.submit-button { background: #0f172a; color: #ffffff; padding: 12px; border-radius: 8px; font-size: 14px; font-weight: 600; border: 0; cursor: pointer; }
.success-message { padding: 24px; text-align: center; color: #16a34a; }

.site-footer { background: #0f172a; color: #94a3b8; padding: 48px 24px; margin-top: auto; }
.footer-container { max-width: 1160px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; }
.footer-brand strong { font-size: 20px; color: #ffffff; }
.footer-links { display: flex; gap: 20px; }
.footer-links a { color: #94a3b8; text-decoration: none; font-size: 13.5px; }
.footer-copy p { font-size: 13px; }
@media (max-width: 768px) { .header-nav { display: none; } .contact-card { grid-template-columns: 1fr; } }
`;
}

function getRestaurantStyles() {
  return getBaseStyles('#b45309', '#d97706', '#fef3c7', '#92400e');
}

function getEcommerceStyles() {
  return getBaseStyles('#0f172a', '#334155', '#f1f5f9', '#1e293b');
}

function getFitnessStyles() {
  return getBaseStyles('#dc2626', '#ef4444', '#fee2e2', '#991b1b');
}

function getSaasStyles() {
  return getBaseStyles('#4f46e5', '#7c3aed', '#e0e7ff', '#4338ca');
}

function getAgencyStyles() {
  return getBaseStyles('#18181b', '#3f3f46', '#f4f4f5', '#18181b');
}
