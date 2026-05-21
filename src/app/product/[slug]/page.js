"use client";
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import '../product.css';
import { getProductBySlug } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useRouter, useParams } from 'next/navigation';
import { Maximize, X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { API_URLS, API_BASE_URL, resolveImageUrl, handleImageError } from '@/utils/api';


export default function ProductPage() {
  const params = useParams();
  const slug = params?.slug;

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState('description');
  const [pincode, setPincode] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({});
  const [touchStartDist, setTouchStartDist] = useState(null);
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxScale, setLightboxScale] = useState(1);
  const [lightboxTouchStartDist, setLightboxTouchStartDist] = useState(null);
  const [lastTap, setLastTap] = useState(0);
  const [similarProducts, setSimilarProducts] = useState([]);

  const router = useRouter();
  const { addToCart } = useCart();

  useEffect(() => {
    setLightboxScale(1);
  }, [activeImage, showLightbox]);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/products/slug/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
          
          if (data.variants && data.variants.length > 0) {
            setSelectedVariantIndex(0);
            if (data.variants[0].sizes && data.variants[0].sizes.length > 0) {
              setSelectedSize(data.variants[0].sizes[0].size);
            } else {
              setSelectedSize('S');
            }
          } else {
            const availableSizes = Array.isArray(data.sizes) && data.sizes.length > 0 
              ? data.sizes 
              : ['S', 'M', 'L', 'XL', 'XXL'];
            setSelectedSize(availableSizes[0]);
          }

          // Fetch similar products
          try {
            const allRes = await fetch(API_URLS.PRODUCTS);
            const allData = await allRes.json();
            const filtered = allData.filter(p => p.category === data.category && p._id !== data._id);
            setSimilarProducts(filtered.slice(0, 5));
          } catch (err) {
            console.error("Error loading similar products:", err);
          }
        } else {
          // Fall back to static mock data
          const staticProd = getProductBySlug(slug);
          if (staticProd) {
            setProduct(staticProd);
            if (staticProd.variants && staticProd.variants.length > 0) {
              setSelectedVariantIndex(0);
              if (staticProd.variants[0].sizes && staticProd.variants[0].sizes.length > 0) {
                setSelectedSize(staticProd.variants[0].sizes[0].size);
              }
            } else {
              setSelectedSize(staticProd.sizes ? staticProd.sizes[0] : 'S');
            }
          }
        }
      } catch (error) {
        console.error("Error loading product details:", error);
        try {
          const staticProd = getProductBySlug(slug);
          if (staticProd) {
            setProduct(staticProd);
            if (staticProd.variants && staticProd.variants.length > 0) {
              setSelectedVariantIndex(0);
              if (staticProd.variants[0].sizes && staticProd.variants[0].sizes.length > 0) {
                setSelectedSize(staticProd.variants[0].sizes[0].size);
              }
            } else {
              setSelectedSize(staticProd.sizes ? staticProd.sizes[0] : 'S');
            }
          }
        } catch (e) {
          console.error("Error loading static fallback product details:", e);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [slug]);

  // Scroll to top instantly when product changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [slug]);

  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', justifyContent: 'center', background: '#fff', color: '#000', fontFamily: 'sans-serif', paddingTop: '150px' }}>
        <div className="pdp-loading-spinner"></div>
        <p style={{ margin: 0, fontSize: '12px', fontWeight: '800', letterSpacing: '2px', color: '#1B769A' }}>LOADING PRODUCT DETAILS...</p>
      </div>
    );
  }

  if (!product) {
    return <div style={{ paddingTop: '180px', paddingBottom: '100px', textAlign: 'center', fontSize: '18px', fontWeight: '700' }}>Product not found</div>;
  }

  const handleCheckDelivery = () => {
    if (pincode.length === 6) {
      setDeliveryStatus("Delivery by Friday, 12th May");
    } else {
      setDeliveryStatus("Please enter a valid pincode");
    }
  };

  const handleZoomMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(2.2)'
    });
  };

  const handleTouchStart = (e) => {
    if (e.touches && e.touches.length === 1) {
      const touch = e.touches[0];
      const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
      const x = ((touch.clientX - left) / width) * 100;
      const y = ((touch.clientY - top) / height) * 100;
      setZoomStyle({
        transformOrigin: `${x}% ${y}%`,
        transform: 'scale(2.5)'
      });
    } else if (e.touches && e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setTouchStartDist(dist);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches && e.touches.length === 1) {
      const touch = e.touches[0];
      const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
      const x = ((touch.clientX - left) / width) * 100;
      const y = ((touch.clientY - top) / height) * 100;
      if (x >= 0 && x <= 100 && y >= 0 && y <= 100) {
        setZoomStyle({
          transformOrigin: `${x}% ${y}%`,
          transform: 'scale(2.5)'
        });
      }
    } else if (e.touches && e.touches.length === 2 && touchStartDist) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = dist / touchStartDist;
      const newScale = Math.min(Math.max(1, factor * 2.2), 4);
      
      const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      
      const x = ((midX - left) / width) * 100;
      const y = ((midY - top) / height) * 100;
      
      setZoomStyle({
        transformOrigin: `${x}% ${y}%`,
        transform: `scale(${newScale})`
      });
    }
  };

  const handleTouchEnd = () => {
    setTouchStartDist(null);
    setZoomStyle({
      transformOrigin: 'center',
      transform: 'scale(1)'
    });
  };

  const handleZoomLeave = () => {
    setZoomStyle({
      transformOrigin: 'center',
      transform: 'scale(1)'
    });
  };

  const handleLightboxTouchStart = (e) => {
    if (e.touches && e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setLightboxTouchStartDist(dist);
    }
  };

  const handleLightboxTouchMove = (e) => {
    if (e.touches && e.touches.length === 2 && lightboxTouchStartDist) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = dist / lightboxTouchStartDist;
      const newScale = Math.min(Math.max(1, factor * lightboxScale), 4);
      setLightboxScale(newScale);
    }
  };

  const handleLightboxTouchEnd = () => {
    setLightboxTouchStartDist(null);
  };

  const toggleLightboxZoom = () => {
    if (lightboxScale > 1) {
      setLightboxScale(1);
    } else {
      setLightboxScale(2.5);
    }
  };

  const handleImageClick = () => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (now - lastTap < DOUBLE_PRESS_DELAY) {
      toggleLightboxZoom();
    } else {
      setLastTap(now);
    }
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleAddToCart = () => {
    addToCart(product, selectedSize);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize);
    router.push('/checkout/cart');
  };

  // Safe spec builder
  const specs = product.specs || {
    "Category": product.category || "Men",
    "Subcategory": product.subcategory || "Casual Wear",
    "Brand": product.brand || "Blueberries",
    "Status": product.inStock ? "In Stock" : "Out of Stock"
  };

  const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;
  
  const currentVariant = hasVariants ? product.variants[selectedVariantIndex] : null;

  const displayImages = currentVariant && Array.isArray(currentVariant.images) && currentVariant.images.length > 0
    ? currentVariant.images.map(img => resolveImageUrl(img))
    : (Array.isArray(product.images) && product.images.length > 0
      ? product.images.map(img => resolveImageUrl(img))
      : [product.category?.toLowerCase().includes('pant') || product.category?.toLowerCase().includes('jeans') || product.category?.toLowerCase().includes('cargo') ? '/product_jeans.png' : '/product_shirt.png']);

  const displaySizes = currentVariant && Array.isArray(currentVariant.sizes) && currentVariant.sizes.length > 0
    ? currentVariant.sizes.map(s => s.size)
    : (Array.isArray(product.sizes) && product.sizes.length > 0 
      ? product.sizes 
      : ['S', 'M', 'L', 'XL', 'XXL']);

  const safeActiveImage = activeImage < displayImages.length ? activeImage : 0;

  const discountText = product.discount || (product.oldPrice ? `${Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF` : '');

  return (
    <div className="product-page-wrapper">
      <div className="pdp-layout-container">
        <div className="product-page-main-content">
          <div className="shirt-product-main">
        {/* Left Side: Image Gallery */}
        <div className="left-part">
          <div className="product-images">
            <ul>
              {displayImages.slice(0, 5).map((img, index) => (
                <li 
                  key={index} 
                  className={safeActiveImage === index ? 'active' : ''}
                  onClick={() => setActiveImage(index)}
                >
                  <img src={img} alt={`Product ${index}`} onError={(e) => handleImageError(e, 'product')} />
                </li>
              ))}
            </ul>
            <div 
              className="full-img-slide"
              onMouseMove={handleZoomMove}
              onMouseLeave={handleZoomLeave}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{ touchAction: 'none', position: 'relative' }}
            >
              <img 
                src={displayImages[safeActiveImage]} 
                alt="Main Product" 
                className="zoomable-product-image"
                onError={(e) => handleImageError(e, 'product')}
                style={zoomStyle}
              />
              
              {/* Expand Icon */}
              <div 
                className="expand-icon"
                onClick={() => setShowLightbox(true)}
                style={{ position: 'absolute', top: '70px', right: '20px', background: '#fff', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 11 }}
              >
                <Maximize size={20} color="#212121" />
              </div>

              {/* Zoom Icon (Lens) */}
              <div 
                className="zoom-lens-icon"
                style={{ position: 'absolute', top: '120px', right: '20px', background: '#fff', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 11, pointerEvents: 'none' }}
              >
                <ZoomIn size={20} color="#212121" />
              </div>

              <div className="heart-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Product Info */}
        <div className="product-details-info">
          <div className="product-details-content">
            <div className="p-heart-icon">
              <h1>{product.name}</h1>
            </div>
            <span className="beyoung-original-text">{product.brand || 'Blueberries'} - {(product.slug || '').replace(/-/g, ' ')}</span>

            <div className="p-price-text">
              <span className="realprice">₹{product.price}</span>
              {product.oldPrice && <span className="cuttinprice">₹{product.oldPrice}</span>}
              {discountText && <span className="discount-price">{discountText}</span>}
            </div>
            <p className="discounted-text">Inclusive of all taxes</p>

            {/* Color Variant Picker */}
            {hasVariants && (
              <div className="product-details-one-box" style={{ marginBottom: '20px' }}>
                <div className="select-product-size" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                  <div className="title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>SELECT COLOR</span>
                    <span style={{ fontSize: '13px', fontWeight: '800', color: '#1B769A', textTransform: 'uppercase' }}>
                      {product.variants[selectedVariantIndex].color}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '12px', flexWrap: 'wrap' }}>
                    {product.variants.map((variant, idx) => {
                      const isSelected = selectedVariantIndex === idx;
                      const colorHex = variant.color ? variant.color.toLowerCase() : '#ccc';
                      
                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            setSelectedVariantIndex(idx);
                            setActiveImage(0);
                            if (variant.sizes && variant.sizes.length > 0) {
                              setSelectedSize(variant.sizes[0].size);
                            }
                          }}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: colorHex,
                            border: isSelected ? '3px solid #1B769A' : '1px solid #ddd',
                            outline: isSelected ? '2px solid #fff' : 'none',
                            cursor: 'pointer',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                            transition: 'all 0.2s ease'
                          }}
                          title={variant.color}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Size Picker */}
            <div className="product-details-one-box">
              <div className="select-product-size">
                <div className="title">
                  <span>SELECT SIZE</span>
                  <a href="#">Size Chart</a>
                </div>
                <div className="size-box">
                  {displaySizes.map(size => (
                    <div 
                      key={size} 
                      className={`size-item ${selectedSize === size ? 'active' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="product-add-button">
              <div className="btn add-to-cart" onClick={handleAddToCart}>Add to Cart</div>
              <div className="btn buy-now" onClick={handleBuyNow}>Buy Now</div>
            </div>

            {/* Delivery Check */}
            <div className="pincode-main">
              <p className="pincode-heading">Check Delivery</p>
              <div className="date-input">
                <input 
                  type="text" 
                  placeholder="Enter Pincode" 
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                />
                <span className="button-check-delivery" onClick={handleCheckDelivery}>Check</span>
              </div>
              {deliveryStatus && (
                <p style={{ marginTop: '10px', fontSize: '14px', color: '#4F86F7', fontWeight: '500' }}>
                  {deliveryStatus}
                </p>
              )}
            </div>

            {/* Accordions */}
            <div className="pdp-description">
              <div className="desc-main">
                <div className="desc-content" onClick={() => toggleSection('description')}>
                  <h3>Product Description</h3>
                  <span>{expandedSection === 'description' ? '−' : '+'}</span>
                </div>
                <div 
                  className={`pdpcontent pdp-rich-description ${expandedSection === 'description' ? 'show' : ''}`}
                  dangerouslySetInnerHTML={{ __html: product.description || 'No description available.' }}
                />
              </div>

              <div className="desc-main">
                <div className="desc-content" onClick={() => toggleSection('specs')}>
                  <h3>Product Specifications</h3>
                  <span>{expandedSection === 'specs' ? '−' : '+'}</span>
                </div>
                <div className={`pdpcontent ${expandedSection === 'specs' ? 'show' : ''}`}>
                  <table>
                    <tbody>
                      {Object.entries(specs).map(([key, value]) => (
                        <tr key={key}>
                          <td>{key}</td>
                          <td>{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="desc-main">
                <div className="desc-content" onClick={() => toggleSection('return')}>
                  <h3>15 Days Return & Exchange</h3>
                  <span>{expandedSection === 'return' ? '−' : '+'}</span>
                </div>
                <div className={`pdpcontent ${expandedSection === 'return' ? 'show' : ''}`}>
                  <p>Easy returns and exchanges within 15 days of delivery. No questions asked.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Width Sections Below Main Product Info */}
      <div className="pdp-bottom-sections">
        <div className="product-review-main-new">
          <div className="reviewtopsec">
            <span className="product-reviews">Customer Reviews</span>
            <div className="allproductrating">
              <p className="all-rating">{product.rating || '4.8'}</p>
              <div className="real-rating">
                {[5, 4, 3, 2, 1].map(star => (
                  <div key={star} className="rating-row">
                    <span>{star}★</span>
                    <div className="rating-bar-bg">
                      <div className="rating-bar-fill" style={{ width: star === 5 ? '85%' : star === 4 ? '10%' : '5%' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="reviewusermainpdpdesk">
            {[
              { name: "Rahul S.", date: "2 days ago", comment: "Perfect fit and amazing quality. The acid wash look is really cool!", rating: 5 },
              { name: "Amit K.", date: "1 week ago", comment: "Good product, very comfortable cotton. Fast delivery too.", rating: 4 }
            ].map((review, i) => (
              <div key={i} className="beyoungpdp-review-sec">
                <div className="verified-beyoungster">
                  <div className="ratingverify-verified">
                    <p className="ratingmainpdp">{review.rating} ★</p>
                    <p className="verified-tick">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      Verified Buyer
                    </p>
                  </div>
                  <span className="dateforview">{review.date}</span>
                </div>
                <div className="pdpusercomments">
                  <strong>{review.name}</strong>
                  <p>{review.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="similar-product">
          <div className="heading">Similar Products</div>
          <div className="similar-grid">
            {(similarProducts.length > 0 ? similarProducts : [
              { name: "Blue Acid Wash Polo", price: 799, slug: "grey-acid-wash-polo-t-shirt", img: "https://www.beyoung.in/api/cache/catalog/products/shirt_squre_image_update_21_1_2022/blue_stripe_crochet_half-sleeves_shirt_base_25_04_2025_400x533.jpg" },
              { name: "Black Acid Wash Polo", price: 799, slug: "grey-acid-wash-polo-t-shirt", img: "https://www.beyoung.in/api/cache/catalog/products/shirts/2026/oxford_stripe/pink_oxford_striped_shirt_base_400x533.jpg" },
              { name: "Navy Polo T-Shirt", price: 699, slug: "grey-acid-wash-polo-t-shirt", img: "https://www.beyoung.in/api/cache/catalog/products/t_shirt_for_men/jacquard_striped_tshirt/orange_jacquard_striped_tshirt_base_400x533.jpg" },
              { name: "Grey Textured Shirt", price: 899, slug: "grey-acid-wash-polo-t-shirt", img: "https://www.beyoung.in/api/cache/catalog/products/shirts/2026/linen_stripe_shirt/mauve_linen_striped_shirt_base_400x533.jpg" },
              { name: "White Summer Polo", price: 749, slug: "grey-acid-wash-polo-t-shirt", img: "https://www.beyoung.in/api/cache/catalog/products/shirts/2026/oxford_stripe/beige_oxford_striped_shirt_base_400x533.jpg" }
            ]).map((item, i) => (
              <Link key={i} href={`/product/${item.slug || 'grey-acid-wash-polo-t-shirt'}`} className="trending-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ position: 'relative', width: '100%', aspectRatio: '3/4', overflow: 'hidden', borderRadius: '10px', backgroundColor: '#f9f9f9' }}>
                  <img src={resolveImageUrl(item.images?.[0]) || resolveImageUrl(item.img)} alt={item.name} onError={(e) => handleImageError(e, 'product')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <h4 style={{ fontSize: '15px', margin: '15px 0 5px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</h4>
                <p style={{ fontWeight: '800', color: '#212121', fontSize: '16px' }}>₹{item.price}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Toast Feedback */}
      {showToast && (
        <div style={{
          position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)',
          background: '#1B769A', color: '#fff', padding: '12px 24px', borderRadius: '50px',
          fontWeight: '700', boxShadow: '0 5px 20px rgba(27, 118, 154,0.3)', zIndex: 9999,
          display: 'flex', alignItems: 'center', gap: '10px', animation: 'slideUp 0.3s ease'
        }}>
          <span>✅ Added to cart!</span>
          <Link href="/checkout/cart" style={{ color: '#fff', textDecoration: 'underline', fontSize: '14px' }}>View Cart</Link>
        </div>
      )}

      {/* Lightbox Modal */}
      {showLightbox && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 99999,
          display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.2s ease'
        }}>
          {/* Top Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 30px', color: '#fff', alignItems: 'center' }}>
            <div style={{ fontSize: '16px', fontWeight: '600' }}>{safeActiveImage + 1} / {displayImages.length}</div>
            <div style={{ display: 'flex', gap: '20px' }}>
              <Maximize size={24} style={{ cursor: 'pointer' }} onClick={toggleLightboxZoom} />
              <X size={28} style={{ cursor: 'pointer' }} onClick={() => { setShowLightbox(false); }} />
            </div>
          </div>

          {/* Main Content */}
          <div 
            style={{ 
              flex: 1, 
              position: 'relative', 
              display: 'flex', 
              alignItems: lightboxScale > 1 ? 'flex-start' : 'center',
              justifyContent: lightboxScale > 1 ? 'flex-start' : 'center',
              overflow: 'auto',
              WebkitOverflowScrolling: 'touch'
            }}
            onTouchStart={handleLightboxTouchStart}
            onTouchMove={handleLightboxTouchMove}
            onTouchEnd={handleLightboxTouchEnd}
          >
            <button 
              onClick={() => { setActiveImage(prev => prev > 0 ? prev - 1 : displayImages.length - 1); }}
              style={{ position: 'fixed', left: '20px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: '20px', zIndex: 10 }}
            >
              <ChevronLeft size={40} />
            </button>
            
            <img 
              src={displayImages[safeActiveImage]} 
              alt="Fullscreen Product" 
              style={{ 
                maxHeight: `${85 * lightboxScale}vh`, 
                maxWidth: `${80 * lightboxScale}vw`,
                width: lightboxScale > 1 ? `${80 * lightboxScale}vw` : 'auto',
                height: lightboxScale > 1 ? `${85 * lightboxScale}vh` : 'auto',
                objectFit: 'contain',
                transition: lightboxTouchStartDist ? 'none' : 'width 0.2s ease, height 0.2s ease, max-width 0.2s ease, max-height 0.2s ease',
                cursor: lightboxScale === 1 ? 'zoom-in' : 'zoom-out',
                margin: lightboxScale > 1 ? '0 auto' : 'auto'
              }} 
              onClick={handleImageClick}
            />

            <button 
              onClick={() => { setActiveImage(prev => prev < displayImages.length - 1 ? prev + 1 : 0); }}
              style={{ position: 'fixed', right: '20px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: '20px', zIndex: 10 }}
            >
              <ChevronRight size={40} />
            </button>
          </div>
        </div>
      )}

      {/* Close the outer flex and wrapper */}
        </div>
      </div>
    </div>
  );
}
