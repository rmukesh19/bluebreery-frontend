"use client";
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import '../product.css';
import { getProductBySlug } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useRouter, useParams } from 'next/navigation';
import { Maximize, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { API_URLS, API_BASE_URL } from '@/utils/api';


export default function ProductPage() {
  const params = useParams();
  const slug = params?.slug;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('L');
  const [expandedSection, setExpandedSection] = useState('description');
  const [pincode, setPincode] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({});
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxZoom, setLightboxZoom] = useState(1);
  const [similarProducts, setSimilarProducts] = useState([]);

  const router = useRouter();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/products/slug/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
          
          const availableSizes = Array.isArray(data.sizes) && data.sizes.length > 0 
            ? data.sizes 
            : ['S', 'M', 'L', 'XL', 'XXL'];
          setSelectedSize(availableSizes[0]);

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
            setSelectedSize(staticProd.sizes[0]);
          }
        }
      } catch (error) {
        console.error("Error loading product details:", error);
        try {
          const staticProd = getProductBySlug(slug);
          if (staticProd) {
            setProduct(staticProd);
            setSelectedSize(staticProd.sizes[0]);
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

  const handleZoomLeave = () => {
    setZoomStyle({
      transformOrigin: 'center',
      transform: 'scale(1)'
    });
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

  const displayImages = Array.isArray(product.images) && product.images.length > 0
    ? product.images.map(img => resolveImageUrl(img))
    : ['https://via.placeholder.com/600x800'];

  const displaySizes = Array.isArray(product.sizes) && product.sizes.length > 0 
    ? product.sizes 
    : ['S', 'M', 'L', 'XL', 'XXL'];

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
                  className={activeImage === index ? 'active' : ''}
                  onClick={() => setActiveImage(index)}
                >
                  <img src={img} alt={`Product ${index}`} />
                </li>
              ))}
            </ul>
            <div 
              className="full-img-slide"
              onMouseMove={handleZoomMove}
              onMouseLeave={handleZoomLeave}
            >
              <img 
                src={displayImages[activeImage]} 
                alt="Main Product" 
                className="zoomable-product-image"
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
                <div className={`pdpcontent ${expandedSection === 'description' ? 'show' : ''}`}>
                  <p>{product.description}</p>
                </div>
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
                <div style={{ position: 'relative', paddingTop: '133%', overflow: 'hidden', borderRadius: '10px' }}>
                  <img src={resolveImageUrl(item.images?.[0]) || resolveImageUrl(item.img)} alt={item.name} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
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
            <div style={{ fontSize: '16px', fontWeight: '600' }}>{activeImage + 1} / {displayImages.length}</div>
            <div style={{ display: 'flex', gap: '20px' }}>
              <Maximize size={24} style={{ cursor: 'pointer' }} onClick={() => setLightboxZoom(prev => prev === 1 ? 2 : 1)} />
              <X size={28} style={{ cursor: 'pointer' }} onClick={() => { setShowLightbox(false); setLightboxZoom(1); }} />
            </div>
          </div>

          {/* Main Content */}
          <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'auto' }}>
            <button 
              onClick={() => { setActiveImage(prev => prev > 0 ? prev - 1 : displayImages.length - 1); setLightboxZoom(1); }}
              style={{ position: 'fixed', left: '40px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: '20px', zIndex: 10 }}
            >
              <ChevronLeft size={40} />
            </button>
            
            <img 
              src={displayImages[activeImage]} 
              alt="Fullscreen Product" 
              style={{ 
                maxHeight: '85vh', 
                maxWidth: '80vw', 
                objectFit: 'contain',
                transform: `scale(${lightboxZoom})`,
                transition: 'transform 0.3s ease',
                cursor: lightboxZoom === 1 ? 'zoom-in' : 'zoom-out'
              }} 
              onClick={() => setLightboxZoom(prev => prev === 1 ? 2 : 1)}
            />

            <button 
              onClick={() => { setActiveImage(prev => prev < displayImages.length - 1 ? prev + 1 : 0); setLightboxZoom(1); }}
              style={{ position: 'fixed', right: '40px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: '20px', zIndex: 10 }}
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
