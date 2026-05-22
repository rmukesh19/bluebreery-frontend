"use client";
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import '../product.css';
import { getProductBySlug } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { Maximize, X, ChevronLeft, ChevronRight, Star, ShieldCheck, Truck, RefreshCcw } from 'lucide-react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Zoom } from "swiper/modules";
import { API_URLS, API_BASE_URL, resolveImageUrl } from '@/utils/api';

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/zoom";

export default function ProductPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const slug = params.slug;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('S');
  const [expandedSection, setExpandedSection] = useState('description');
  const [pincode, setPincode] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [zoomStyle, setZoomStyle] = useState({
    transformOrigin: 'center',
    transform: 'scale(1)'
  });

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
            setSelectedSize(staticProd.sizes ? staticProd.sizes[0] : 'S');
          }
        }
      } catch (error) {
        console.error("Error loading product details:", error);
        const staticProd = getProductBySlug(slug);
        if (staticProd) {
          setProduct(staticProd);
          setSelectedSize(staticProd.sizes ? staticProd.sizes[0] : 'S');
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
    return <div style={{ paddingTop: '150px', textAlign: 'center' }}>Loading...</div>;
  }

  if (!product) {
    return <div style={{ paddingTop: '150px', textAlign: 'center' }}>Product not found</div>;
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
      transform: 'scale(1.8)'
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

  const offers = [
    { code: "TRYBLUEBERRY", description: "Enjoy 5% off on your first web order." },
    { code: "NEW10", description: "Enjoy 10% off on your first order above ₹1400" },
    { code: "SHOP10", description: "Enjoy 10% off on your next order above ₹2700" },
  ];

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    alert(`${code} copied!`);
  };

  const handleImageError = (e) => {
    e.target.src = '/images/placeholder.webp';
  };

  const displayImages = (product.images && product.images.length > 0) 
    ? product.images.map(img => resolveImageUrl(img))
    : ['/images/placeholder.webp'];

  return (
    <div className="product-page-wrapper">
      <div className="pdp-layout-container">
        <div className="product-page-main-content">
          <div className="shirt-product-main">
            {/* Left Side: Image Gallery */}
            <div className="galleryWrapper">
              {/* Thumbnails */}
              <div className="thumbColumn">
                {displayImages.map((img, i) => (
                  <div key={i} className={`thumb ${i === activeImage ? "active" : ""}`}
                    onClick={() => setActiveImage(i)}>
                    <img src={img} alt={`product-${i}`} onError={handleImageError} />
                  </div>
                ))}
              </div>

              <div className="heart-icon"
                style={{ position: 'absolute', top: '0', right: '20px', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 11 }}
              >
                <svg width="24" height="24" fill="none">
                  <path stroke="#000" strokeLinecap="round" strokeLinejoin="round" d="M11.553 6.974s0 0 0 0h0l-.002-.003-.01-.02a5.342 5.342 0 0 0-.239-.392 6.283 6.283 0 0 0-.785-.954c-.7-.695-1.716-1.355-3.06-1.355-2.18 0-3.934 1.83-3.957 4.043-.049 4.833 3.833 8.342 8.359 11.413h0a.25.25 0 0 0 .282 0h0c4.525-3.071 8.407-6.58 8.359-11.413-.023-2.214-1.776-4.043-3.957-4.043-1.344 0-2.36.66-3.06 1.355a6.283 6.283 0 0 0-.979 1.264l-.045.083-.01.019-.002.003h0a.5.5 0 0 1-.894 0Zm0 0h0s0 0 0 0h0Z"></path>
                </svg>
              </div>
              
              <div
                className="expand-icon"
                onClick={() => setShowLightbox(true)}
                style={{ position: 'absolute', top: '50px', right: '20px', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 11 }}
              >
                <Maximize size={20} color="#212121" />
              </div>

              {/* Main Image */}
              <div className="mainImageWrapper">
                <button
                  className="nav left"
                  onClick={() =>
                    setActiveImage((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1))
                  }
                >
                  <ChevronLeft size={32} color="white" />
                </button>

                <div 
                  className="mainImage" 
                  onClick={() => setShowLightbox(true)}
                  onMouseMove={handleZoomMove}
                  onMouseLeave={handleZoomLeave}
                >
                  <img src={displayImages[activeImage]} alt="main-product" style={zoomStyle} onError={handleImageError} />
                </div>

                <button
                  className="nav right"
                  onClick={() =>
                    setActiveImage((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1))
                  }
                >
                  <ChevronRight size={32} color="white" />
                </button>
              </div>
            </div>

            {/* Right Side: Product Info */}
            <div className="product-details-info">
              <div className="product-details-content">
                <div className="p-heart-icon ">
                  <h1>{product.name}</h1>
                  <span className="realprice">₹{product.price}</span>
                </div>
                
                <div className="offers-wrapper">
                  {offers.map((offer, index) => (
                    <div className="offer-card" key={index}>
                      <div className="offer-header">
                        <div className="offer-left">
                          <div className="offer-icon">🎁</div>
                          <h2 className="offer-code">{offer.code}</h2>
                        </div>
                        <span className="copy-btn" onClick={() => copyCode(offer.code)}>
                          COPY
                        </span>
                      </div>
                      <p className="offer-description">{offer.description}</p>
                    </div>
                  ))}
                </div>

                <div className="sizes-main-section">
                  <h1 className="sizes-heading">SELECT SIZE</h1>
                  <div className="size-list">
                    {(product.sizes || ["S", "M", "L", "XL", "XXL"]).map((size, index) => (
                      <div
                        key={index}
                        className={`size-box-item ${selectedSize === size ? "active" : ""}`}
                        onClick={() => setSelectedSize(size)}
                      >
                        <span className="size-text">{size}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="product-add-button">
                  <div className="btn add-to-cart" onClick={handleAddToCart}>Add to Cart</div>
                  <div className="btn buy-now" onClick={handleBuyNow}>Buy Now</div>
                </div>

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

                  {product.specs && (
                    <div className="desc-main">
                      <div className="desc-content" onClick={() => toggleSection('specs')}>
                        <h3>Product Specifications</h3>
                        <span>{expandedSection === 'specs' ? '−' : '+'}</span>
                      </div>
                      <div className={`pdpcontent ${expandedSection === 'specs' ? 'show' : ''}`}>
                        <table>
                          <tbody>
                            {Object.entries(product.specs).map(([key, value]) => (
                               <tr key={key}>
                                <td>{key}</td>
                                <td>{value}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="similar-product">
            <div className="heading">Similar Products</div>
            <div className="similar-grid">
              {(similarProducts.length > 0 ? similarProducts : [
                { name: "Blue Acid Wash Polo", price: 799, slug: "blue-polo", images: ["/images/placeholder.webp"] },
                { name: "Black Acid Wash Polo", price: 799, slug: "black-polo", images: ["/images/placeholder.webp"] },
              ]).map((item, i) => (
                <Link key={i} href={`/product/${item.slug}`} className="trending-card">
                  <div style={{ position: 'relative', paddingTop: '133%', overflow: 'hidden', borderRadius: '10px' }}>
                    <img src={resolveImageUrl(item.images?.[0])} alt={item.name} onError={handleImageError} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <h4>{item.name}</h4>
                  <p>₹{item.price}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Toast Feedback */}
        {showToast && (
          <div className="toast-notification">
            <span>✅ Added to cart!</span>
            <Link href="/checkout/cart">View Cart</Link>
          </div>
        )}

        {/* Lightbox Modal */}
        {showLightbox && (
          <div className="lightboxModal">
            <div className='lightboxModalWrapper'>
              <div className="lightboxHeader">
                <button className="closeBtn" onClick={() => setShowLightbox(false)}>
                  <X size={32} />
                </button>
              </div>

              <div className="lightboxWrapper">
                <button className="customPrev"><ChevronLeft size={40} color="white" /></button>
                <Swiper
                  modules={[Navigation, Zoom]}
                  navigation={{ prevEl: ".customPrev", nextEl: ".customNext" }}
                  zoom={{ maxRatio: 3 }}
                  centeredSlides={true}
                  slidesPerView={1}
                  initialSlide={activeImage}
                  className="lightboxSwiper"
                >
                  {displayImages.map((img, index) => (
                    <SwiperSlide key={index}>
                      <div className="swiper-zoom-container">
                        <img src={img} alt={`Slide ${index + 1}`} onError={handleImageError} />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
                <button className="customNext"><ChevronRight size={40} color="white" /></button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
