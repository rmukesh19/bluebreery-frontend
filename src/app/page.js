"use client";
import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import HeroBanner from '@/components/HeroBanner';
import { X, Bell, ChevronLeft, ChevronRight } from 'lucide-react';
import './home.css';
import { API_URLS, resolveImageUrl } from '@/utils/api';


export default function Home() {
  const combosRef = useRef(null);
  const categorySliderRef = useRef(null);
  const reviewsRef = useRef(null);
  const instagramRef = useRef(null);
  const midBannerRef = useRef(null);
  const [showShirts, setShowShirts] = useState(false);
  const [showMoreArrivals, setShowMoreArrivals] = useState(false);
  const [showMoreBottoms, setShowMoreBottoms] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const trendingRef = useRef(null);
  const arrivalsRef = useRef(null);
  const bottomsRef = useRef(null);
  const [midBannerIndex, setMidBannerIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [catLoading, setCatLoading] = useState(true);

  const handleMidBannerScroll = () => {
    if (midBannerRef.current) {
      const width = midBannerRef.current.offsetWidth;
      const index = Math.round(midBannerRef.current.scrollLeft / width);
      setMidBannerIndex(index);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (midBannerRef.current) {
        const width = midBannerRef.current.offsetWidth;
        const maxScroll = midBannerRef.current.scrollWidth - width;
        if (midBannerRef.current.scrollLeft >= maxScroll - 10) {
          midBannerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          midBannerRef.current.scrollBy({ left: width, behavior: 'smooth' });
        }
      }
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Drag-to-scroll logic for horizontal containers
  useEffect(() => {
    const setupDragToScroll = (ref) => {
      if (!ref.current) return;
      const slider = ref.current;
      let isDown = false;
      let startX;
      let scrollLeft;

      const onMouseDown = (e) => {
        isDown = true;
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
        slider.style.cursor = 'grabbing';
      };

      const onMouseLeave = () => {
        isDown = false;
        slider.style.cursor = 'grab';
      };

      const onMouseUp = () => {
        isDown = false;
        slider.style.cursor = 'grab';
      };

      const onMouseMove = (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2;
        slider.scrollLeft = scrollLeft - walk;
      };

      slider.addEventListener('mousedown', onMouseDown);
      slider.addEventListener('mouseleave', onMouseLeave);
      slider.addEventListener('mouseup', onMouseUp);
      slider.addEventListener('mousemove', onMouseMove);
      slider.style.cursor = 'grab';

      return () => {
        slider.removeEventListener('mousedown', onMouseDown);
        slider.removeEventListener('mouseleave', onMouseLeave);
        slider.removeEventListener('mouseup', onMouseUp);
        slider.removeEventListener('mousemove', onMouseMove);
      };
    };

    const cleanupCombos = setupDragToScroll(combosRef);
    const cleanupInsta = setupDragToScroll(instagramRef);
    const cleanupMidBanner = setupDragToScroll(midBannerRef);

    return () => {
      if (cleanupCombos) cleanupCombos();
      if (cleanupInsta) cleanupInsta();
      if (cleanupMidBanner) cleanupMidBanner();
    };
  }, []);

  useEffect(() => {
    const observerOptions = { threshold: 0.1 };
    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target === trendingRef.current) setShowShirts(true);
          if (entry.target === arrivalsRef.current) setShowMoreArrivals(true);
          if (entry.target === bottomsRef.current) setShowMoreBottoms(true);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    if (trendingRef.current) observer.observe(trendingRef.current);
    if (arrivalsRef.current) observer.observe(arrivalsRef.current);
    if (bottomsRef.current) observer.observe(bottomsRef.current);

    return () => observer.disconnect();
  }, []);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(API_URLS.PRODUCTS);
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch(API_URLS.CATEGORIES);
        const data = await response.json();
        setCategories(data);
        setCatLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCatLoading(false);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  const scrollLeft = (ref) => {
    if (ref.current) ref.current.scrollBy({ left: -326, behavior: 'smooth' });
  };

  const scrollRight = (ref) => {
    if (ref.current) ref.current.scrollBy({ left: 326, behavior: 'smooth' });
  };

  const shirtProducts = Array.isArray(products)
    ? products.filter(
        (p) =>
          p.category?.toLowerCase() === "t-shirts" ||
          p.category?.toLowerCase() === "shirts"
      ).slice(0, 4)
    : [];

  const displayShirts = shirtProducts.length > 0 ? shirtProducts : (Array.isArray(products) ? products.slice(0, 4) : []);

  const bottomProducts = Array.isArray(products)
    ? products.filter(
        (p) =>
          p.category?.toLowerCase() === "pant" ||
          p.category?.toLowerCase() === "cargo" ||
          p.category?.toLowerCase() === "jeans"
      ).slice(0, 4)
    : [];

  const displayBottoms = bottomProducts.length > 0 ? bottomProducts : (Array.isArray(products) ? products.slice(4, 8) : []);

  return (
    <div className="homepage-container">
      {/* Hero Banner - Auto Slide */}
      <section style={{ width: '100%', padding: 0, margin: 0, position: 'relative', overflow: 'hidden' }}>
        <HeroBanner />
      </section>

      {/* Categories Section */}
      <section className="home-section">
        <div className="section-header">
          <h2 style={{ color: 'var(--dark-text)' }}>MOST-WANTED CATEGORIES</h2>
          <p style={{ color: 'var(--gray-text)' }}>Loved by all, selling out fast</p>
        </div>

        {/* Responsive CSS Grid (Beyoung Style) */}
        <div className="category-grid">
          {(catLoading ? [1,2,3,4,5,6] : (Array.isArray(categories) ? categories : [])).map((cat, i) => (
            <Link 
              key={catLoading ? i : cat._id} 
              href={`/${(cat.name || '').toLowerCase().replace(/\s+/g, '-')}`} 
              style={{ 
                overflow: 'hidden', 
                borderRadius: '4px', 
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 15px rgba(0,0,0,0.03)', 
                border: '1px solid #e9e9e9',
                transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)', 
                position: 'relative',
                background: '#ffffff',
                aspectRatio: '3/4'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.08)';
                e.currentTarget.style.borderColor = '#000000';
                const img = e.currentTarget.querySelector('img');
                if (img) img.style.transform = 'scale(1.06)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.03)';
                e.currentTarget.style.borderColor = '#e9e9e9';
                const img = e.currentTarget.querySelector('img');
                if (img) img.style.transform = 'scale(1)';
              }}
            >
              {catLoading ? (
                <div style={{ width: '100%', height: '100%', background: '#f5f5f5' }} />
              ) : (
                <>
                  {/* Text at the Top */}
                  <div style={{ 
                    padding: '20px 20px 0 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    zIndex: 2
                  }}>
                    <span style={{
                      fontSize: '18px',
                      fontWeight: '800',
                      color: '#000',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      {cat.name}
                    </span>
                    {/* Dynamic premium badges matching user's screenshot */}
                    {cat.name.toLowerCase().includes('cargo') && (
                      <span style={{ fontSize: '9px', fontWeight: '700', color: '#ff5252', border: '1px solid #ff5252', padding: '2px 8px', borderRadius: '12px', background: '#fff2f2' }}>
                        3XL TO 6XL
                      </span>
                    )}
                    {cat.name.toLowerCase().includes('trouser') && (
                      <span style={{ fontSize: '9px', fontWeight: '700', color: '#00c853', border: '1px solid #00c853', padding: '2px 8px', borderRadius: '12px', background: '#e8f5e9' }}>
                        HOT
                      </span>
                    )}
                    {cat.name.toLowerCase().includes('jean') && (
                      <span style={{ fontSize: '9px', fontWeight: '700', color: '#ff6d00', border: '1px solid #ff6d00', padding: '2px 8px', borderRadius: '12px', background: '#fff3e0' }}>
                        POPULAR
                      </span>
                    )}
                    {cat.name.toLowerCase().includes('polo') && (
                      <span style={{ fontSize: '9px', fontWeight: '700', color: '#2979ff', border: '1px solid #2979ff', padding: '2px 8px', borderRadius: '12px', background: '#e3f2fd' }}>
                        BESTSELLER
                      </span>
                    )}
                    {cat.name.toLowerCase().includes('shoe') && (
                      <span style={{ fontSize: '9px', fontWeight: '700', color: '#d500f9', border: '1px solid #d500f9', padding: '2px 8px', borderRadius: '12px', background: '#fce4ec' }}>
                        JUST LAUNCHED
                      </span>
                    )}
                  </div>

                  {/* Centered contained Image inside a gradient container */}
                  <div style={{ 
                    flex: 1, 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    padding: '10px 24px 24px 24px',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(to bottom, #ffffff 40%, #f4f4f4 100%)',
                    position: 'relative'
                  }}>
                    <img 
                      src={resolveImageUrl(cat.image) || "https://via.placeholder.com/300x400"} 
                      alt={cat.name} 
                      style={{ 
                        maxWidth: '90%', 
                        maxHeight: '90%', 
                        objectFit: 'contain',
                        transition: 'transform 0.4s ease'
                      }} 
                    />
                  </div>
                </>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* Shirts Section */}
      <section className="home-section">
        <div className="section-header">
          <h2>PREMIUM SHIRTS</h2>
          <p>Our Exclusive Shirt Collection</p>
        </div>

        <div className="prime-grid-4">
          {(loading ? [1,2,3,4] : displayShirts).map((item, idx) => (
            <Link key={loading ? idx : item._id} href={`/product/${item.slug}`} className="premium-card">
              <div className="premium-card-img-wrapper">
                <img src={resolveImageUrl(item.images?.[0]) || 'https://via.placeholder.com/300'} alt={item.name} />
                <div style={{ position: 'absolute', top: '15px', right: '15px', background: '#fff', padding: '5px 15px', borderRadius: '20px', fontSize: '11px', fontWeight: '900', color: '#000', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                  {item.badge || 'Linen'}
                </div>
              </div>
              <div className="premium-card-info">
                <h3>{item.name}</h3>
                <div className="price-wrapper">
                  <span className="current-price">₹{item.price}</span>
                  <span className="old-price">₹{item.oldPrice}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Combos Section (Hidden as requested)
      <section className="home-section">
        <div className="section-header">
          <h2 style={{ color: 'var(--dark-text)' }}>ULTIMATE SAVING COMBOS</h2>
          <p style={{ color: 'var(--gray-text)' }}>Top combos you can't resist</p>
        </div>

        <div style={{ position: 'relative' }}>
          <div ref={combosRef} className="combo-wrapper hide-scrollbar" style={{ display: 'flex', overflowX: 'auto', gap: '30px', scrollBehavior: 'smooth', padding: '30px 0' }}>
            {[
              { id: 1, img: 'https://images-home.beyoung.in/2026_combo_cards_loose_fit_pyjamas_96a9f2cd2d.png', title: 'Loose Fit Pyjama', tag: 'PICK ANY 2' },
              { id: 2, img: 'https://images-home.beyoung.in/combo_card_cargo_joggers_pick_3_jan_78adc2ef84.png', title: 'Cargo Joggers', tag: 'PICK ANY 3' },
              { id: 3, img: 'https://images-home.beyoung.in/2026_combo_cards_plain_shirts_748ec2fba3.png', title: 'Plain Shirts', tag: 'PICK ANY 3' },
              { id: 4, img: 'https://images-home.beyoung.in/2026_combo_cards_boxers_8c48ebc49d.png', title: 'Mens Boxers', tag: 'PICK ANY 4' },
              { id: 5, img: 'https://images-home.beyoung.in/2026_combo_cards_loose_fit_pyjamas_96a9f2cd2d.png', title: 'Loose Fit Pyjama', tag: 'PICK ANY 2' },
            ].map(combo => (
              <Link key={combo.id} href={`/product/grey-acid-wash-polo-t-shirt`} className="combo-card-prime">
                <img src={combo.img} alt={combo.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </Link>
            ))}
          </div>
        </div>
      </section>
      */}

      {/* Savings Corner (Hidden as requested)
      <section className="home-section">
        <div className="section-header">
          <h2 style={{ color: 'var(--dark-text)' }}>SAVINGS CORNER</h2>
          <p style={{ color: 'var(--gray-text)' }}>Unbelievable deals on your favorites</p>
        </div>
        <div className="savings-container">
          {[
            { name: 'Under 799', img: 'https://images-home.beyoung.in/Everything_under_799_category_section_6ccc147862.jpg' },
            { name: 'Under 999', img: 'https://images-home.beyoung.in/Everything_under_999_category_section_3be8f4d375.jpg' },
            { name: 'Combos', img: 'https://images-home.beyoung.in/2026_combo_cards_plain_shirts_748ec2fba3.png' },
            { name: 'New Drops', img: 'https://images-home.beyoung.in/Shirts_category_section_03751efdd8.jpg' },
            { name: 'Best Sellers', img: 'https://images-home.beyoung.in/Trouser_category_section_c5e98dc1f9.jpg' }
          ].map((item, i) => (
            <div key={i} className="savings-item">
              <div className="savings-circle-wrapper">
                <div className="savings-circle-inner">
                  <img src={item.img} alt={item.name} />
                </div>
              </div>
              <span className="savings-name">{item.name}</span>
            </div>
          ))}
        </div>
      </section>
      */}

      {/* Trending Section */}
      <section ref={trendingRef} className="home-section">
        <div className="section-header">
          <h2>TRENDING NOW</h2>
          <p>{showShirts ? 'Our Exclusive Shirt Collection' : 'The styles everyone is talking about'}</p>
        </div>

        <div className="prime-grid-4">
          {(loading ? [1,2,3,4] : (Array.isArray(products) ? products.slice(0, 4) : [])).map((item, idx) => (
            <Link key={loading ? idx : item._id} href={`/product/${item.slug}`} className="premium-card">
              <div className="premium-card-img-wrapper">
                <img src={resolveImageUrl(item.images?.[0]) || 'https://via.placeholder.com/300'} alt={item.name} />
                <div style={{ position: 'absolute', top: '15px', right: '15px', background: '#fff', padding: '5px 15px', borderRadius: '20px', fontSize: '11px', fontWeight: '900', color: '#000', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                  {item.badge || 'Trending'}
                </div>
              </div>
              <div className="premium-card-info">
                <h3>{item.name}</h3>
                <div className="price-wrapper">
                  <span className="current-price">₹{item.price}</span>
                  <span className="old-price">₹{item.oldPrice}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Mid-Page Black Banner - Boutique Design */}
      <section className="full-section" style={{ padding: '0' }}>
        <div className="black-banner" style={{ 
          width: '100%', 
          height: '550px', 
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(/images/banners/luxury_boutique_sale_banner.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          textAlign: 'center',
          position: 'relative',
          padding: '40px 20px',
          overflow: 'hidden'
        }}>
          {/* Elegant Border Frame */}
          <div style={{ position: 'absolute', top: '30px', left: '30px', right: '30px', bottom: '30px', border: '1px solid rgba(212, 175, 55, 0.4)', pointerEvents: 'none', borderRadius: '4px', zIndex: 1 }}></div>
          
          <div style={{ maxWidth: '900px', color: '#fff', position: 'relative', zIndex: 5 }}>
            <div style={{ color: '#D4AF37', fontSize: '15px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '6px', marginBottom: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '25px' }}>
              <span style={{ width: '60px', height: '1px', background: 'linear-gradient(to right, transparent, #D4AF37)' }}></span>
              Limited Time Boutique Exclusive
              <span style={{ width: '60px', height: '1px', background: 'linear-gradient(to left, transparent, #D4AF37)' }}></span>
            </div>
            
            <h3 style={{ fontSize: 'clamp(32px, 8vw, 72px)', fontWeight: '900', marginBottom: '15px', letterSpacing: '-1px', lineHeight: '1.1', color: '#ffffff', textTransform: 'uppercase', textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
              THE ULTIMATE <br />
              <span style={{ color: '#D4AF37', background: 'linear-gradient(to bottom, #D4AF37, #F5D76E)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>HOT DEAL REDEFINED</span>
            </h3>
            
            <p style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', marginBottom: '50px', opacity: '0.9', fontWeight: '500', lineHeight: '1.6', color: '#ffffff', maxWidth: '650px', margin: '0 auto 50px', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
              OFFERS UPTO 70% OFF <br />
              <span style={{ fontSize: '14px', fontWeight: '400', opacity: 0.8, letterSpacing: '1px' }}>Experience premium fashion at extraordinary value. Limited stock available.</span>
            </p>
            
            <Link href="/" className="premium-banner-btn" style={{ 
              background: '#fff', 
              color: '#000', 
              padding: '22px 60px', 
              borderRadius: '0', 
              fontWeight: '900', 
              fontSize: '15px', 
              textDecoration: 'none',
              display: 'inline-block',
              transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
              border: '1px solid #fff',
              textTransform: 'uppercase',
              letterSpacing: '3px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              Explore The Collection
            </Link>
          </div>

          <style jsx>{`
            .premium-banner-btn:hover {
              background: #000;
              color: #fff;
              border-color: #D4AF37;
              transform: translateY(-5px);
              box-shadow: 0 30px 60px rgba(0,0,0,0.6), 0 0 20px rgba(212, 175, 55, 0.3);
            }
          `}</style>
        </div>
      </section>

      <section ref={arrivalsRef} className="home-section">
        <div className="section-header">
          <h2>NEW ARRIVALS</h2>
          <p>Get them before everyone else does</p>
        </div>

        <div className="prime-grid-4">
          {(loading ? [1,2,3,4] : (Array.isArray(products) ? products.slice(4, 8) : [])).map((product, idx) => (
            <Link key={loading ? idx : product._id} href={`/product/${product.slug}`} className="premium-card">
              <div className="premium-card-img-wrapper">
                <img src={resolveImageUrl(product.images?.[0]) || 'https://via.placeholder.com/300'} alt={product.name} />
              </div>
              <div className="premium-card-info">
                <h3>{product.name}</h3>
                <div className="price-wrapper">
                  <span className="current-price">₹{product.price}</span>
                  <span className="old-price">₹{product.oldPrice}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section ref={bottomsRef} className="home-section">
        <div className="section-header">
          <h2>BOTTOM WEAR</h2>
          <p>Style from the ground up</p>
        </div>

        <div className="prime-grid-4">
          {(loading ? [1,2,3,4] : displayBottoms).map((product, idx) => (
            <Link key={loading ? idx : product._id} href={`/product/${product.slug}`} className="premium-card">
              <div className="premium-card-img-wrapper">
                <img src={resolveImageUrl(product.images?.[0]) || 'https://via.placeholder.com/300'} alt={product.name} />
                <div style={{ position: 'absolute', top: '15px', right: '15px', background: '#fff', padding: '5px 15px', borderRadius: '20px', fontSize: '11px', fontWeight: '900', color: '#000', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                  {product.badge || 'Style'}
                </div>
              </div>
              <div className="premium-card-info">
                <h3>{product.name}</h3>
                <div className="price-wrapper">
                  <span className="current-price">₹{product.price}</span>
                  <span className="old-price">₹{product.oldPrice}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="full-section">
        <div className="promo-banner-wrapper" style={{ position: 'relative', width: '100%', height: '400px', overflow: 'hidden' }}>
          <img src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=1600" alt="Shirts and Pants" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div className="promo-banner-content" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.2))', display: 'flex', alignItems: 'center', padding: '0 60px' }}>
            <div style={{ maxWidth: '500px', color: '#ffffff' }}>
              <h2 style={{ fontSize: '42px', fontWeight: '800', marginBottom: '15px', lineHeight: '1.1', color: '#ffffff', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>PREMIUM SHIRTS <br />& PANTS</h2>
              <p style={{ fontSize: '16px', marginBottom: '30px', opacity: '1', lineHeight: '1.6', color: '#ffffff', textShadow: '0 1px 5px rgba(0,0,0,0.3)' }}>Upgrade your wardrobe with our latest collection of premium quality shirts and comfortable pants designed for everyday elegance.</p>
              <Link href="/" style={{ background: '#fff', color: 'var(--primary-color)', padding: '15px 35px', borderRadius: '50px', fontWeight: '800', fontSize: '15px', textDecoration: 'none', display: 'inline-block', transition: 'transform 0.2s', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                Shop Collection
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Feed Section */}
      <section className="home-section">
        <div className="section-header">
          <h2>BLUEBERRIES ON INSTAGRAM</h2>
          <p>Follow us for the latest trends and styles</p>
        </div>
        <div className="insta-swiper-container">
          <div onClick={() => scrollLeft(instagramRef)} className="swiper-button-prev">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6" /></svg>
          </div>
          <div onClick={() => scrollRight(instagramRef)} className="swiper-button-next">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6" /></svg>
          </div>
          <div ref={instagramRef} className="section-content swiper-wrapper hide-scrollbar mobile-center-snap" style={{ display: 'flex', overflowX: 'auto', gap: '25px', scrollBehavior: 'smooth', scrollbarWidth: 'none', msOverflowStyle: 'none', padding: '10px 0' }}>
            {[
              '/videos/insta1.mp4',
              '/videos/insta2.mp4',
              '/videos/insta3.mp4',
              '/videos/insta4.mp4',
              '/videos/insta5.mp4',
              '/videos/insta1.mp4',
              '/videos/insta2.mp4'
            ].map((videoSrc, i) => (
              <div key={i} onClick={() => setSelectedVideo(videoSrc)} className="insta-video-card">
                <video src={videoSrc} autoPlay loop muted playsInline style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                <div className="insta-overlay">
                  <div className="play-icon-circle">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--primary-color)" stroke="var(--primary-color)" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Floating Bell */}
      <div className="floating-bell" style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: '1000' }}>
        <div style={{
          width: '100%',
          height: '100%',
          background: 'var(--primary-color)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          cursor: 'pointer'
        }}>
          <Bell size={30} color="#fff" strokeWidth={2} />
        </div>
      </div>

      {/* Video Popup Modal */}
      {selectedVideo && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 100000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setSelectedVideo(null)}>
          <div style={{ position: 'relative', height: '90vh', aspectRatio: '9/16', background: '#000', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }} onClick={e => e.stopPropagation()}>
            <video src={selectedVideo} autoPlay controls playsInline style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            <button onClick={() => setSelectedVideo(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', transition: 'background 0.3s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.8)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}>
              <X size={24} color="#fff" strokeWidth={2} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
