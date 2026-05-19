"use client";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, Parallax } from 'swiper/modules';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { API_URLS, resolveImageUrl } from '@/utils/api';


// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/parallax';

const slides = [
  {
    img: '/images/banners/linen-portrait.png',
    category: 'NEW ARRIVALS',
    title: 'THE ART OF LINEN',
    cta: 'SHOP NOW',
    href: '/topwear/shirts',
  },
  {
    img: '/images/banners/streetwear-portrait.jpeg',
    category: 'TRENDING',
    title: 'URBAN ESSENTIALS',
    cta: 'EXPLORE',
    href: '/topwear/hoodies',
  },
  {
    img: '/images/banners/cargo-portrait.png',
    category: 'STREET STYLE',
    title: 'UTILITY CARGOS',
    cta: 'DISCOVER',
    href: '/bottomwear/joggers',
  },
  {
    img: '/images/banners/summer-shirts.png',
    category: 'VACATION EDIT',
    title: 'SUMMER SHIRTS',
    cta: 'SHOP COLLECTION',
    href: '/topwear/shirts',
  },
  {
    img: '/images/banners/must-have-denims.png',
    category: 'DENIM FOCUS',
    title: 'PREMIUM JEANS',
    cta: 'BUY NOW',
    href: '/bottomwear/jeans',
  }
];

export default function HeroBanner() {
  const [mounted, setMounted] = useState(false);
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    setMounted(true);
    const fetchBanners = async () => {
      try {
        const response = await fetch(API_URLS.BANNERS);
        const data = await response.json();
        const activeBanners = data.filter((b) => b.status === "Active");
        setBanners(activeBanners);
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };
    fetchBanners();
  }, []);

  if (!mounted) return (
    <div style={{ height: '800px', background: '#000' }}></div>
  );

  const displaySlides = banners.length > 0 ? banners.map(b => ({
    img: resolveImageUrl(b.image),
    category: 'COLLECTION',
    title: b.title,
    cta: 'EXPLORE NOW',
    href: b.link || '/',
  })) : slides;

  return (
    <section className="hero-banner-section">
      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView={2.4}
        // centeredSlides={true}
        spaceBetween={10}
        loop={true}
        speed={4500}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}

        watchOverflow={true}
        observer={true}
        observeParents={true}

        pagination={{
          clickable: true,
          el: '.custom-pagination',
        }}
        breakpoints={{
          0: {
            slidesPerView: 1,
            spaceBetween: 12,
          },
          768: {
            slidesPerView: 2.4,
            spaceBetween: 16,
          },
        }}

        className="hero-swiper"
      >
        {displaySlides.map((slide, index) => (
          <SwiperSlide key={index}>
            <Link href={slide.href}>
              <div className="hero-slide-card">
                <div className="image-container">
                  {slide.img.startsWith('http') ? (
                    <img
                      src={slide.img}
                      alt={slide.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                      className="hero-image"
                    />
                  ) : (
                    <Image
                      src={slide.img}
                      alt={slide.title}
                      fill
                      style={{ objectFit: 'cover', objectPosition: 'top' }}
                      className="hero-image"
                      priority={index < 3}
                    />
                  )}
                  <div className="slide-overlay">
                    <div className="slide-content">
                      <h2 className="slide-title">{slide.title}</h2>
                      <p className="slide-subtitle">THAT MAKE AN IMPRESSION</p>
                      <div className="cta-button-wrapper">
                        <div className="snitch-button">{slide.cta}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="hero-controls-container">
        <div className="custom-pagination"></div>
      </div>

      <style jsx global>{`
        .hero-banner-section {
          padding: 0 0 60px;
          background: #fff;
          width: 100%;
          overflow: hidden;
        }

        .hero-swiper {
          width: 100%;
          padding: 0 0;
          overflow: visible !important;
        }

        .swiper-slide {
          width: 85%; /* Default for mobile */
          transition: all 0.5s ease;
        }

        .swiper-slide-active {
          opacity: 1;
        }

        .hero-slide-card {
          position: relative;
          width: 100%;
          height: 85vh;
          min-height: 550px;
          max-height: 850px;
          border-radius: 0;
          overflow: hidden;
          background: #0a0a0a;
        }

        .image-container {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .hero-image {
          transition: transform 1.5s ease-out;
        }

        .slide-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 40%, transparent 100%);
          display: flex;
          align-items: flex-end;
          justify-content: flex-start;
          text-align: left;
          padding: 60px 30px;
        }

        .slide-content {
          width: 100%;
          color: #fff;
        }

        .slide-title {
          font-size: clamp(22px, 3.5vw, 42px);
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 5px;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #fff;
        }

        .slide-subtitle {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 30px;
          opacity: 0.8;
          color: #fff;
        }

        .snitch-button {
          border: 1.5px solid #fff;
          color: #fff;
          padding: 12px 35px;
          border-radius: 50px;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
          transition: all 0.3s ease;
          display: inline-block;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(5px);
        }

        .swiper-slide:hover .snitch-button {
          background: #fff;
          color: #000;
        }

        .hero-controls-container {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          margin-top: 40px;
        }

        .custom-pagination {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .custom-pagination .swiper-pagination-bullet {
          width: 12px;
          height: 2px;
          background: #000;
          opacity: 0.15;
          border-radius: 0;
          transition: all 0.4s ease;
          cursor: pointer;
        }

        .custom-pagination .swiper-pagination-bullet-active {
          width: 50px;
          height: 3px;
          opacity: 1;
          background: #000;
        }

        @media (min-width: 768px) {
          .swiper-slide { width: 40%; }
          .hero-slide-card { height: 75vh; }
        }

        @media (min-width: 1024px) {
          .swiper-slide { width: 28%; }
          .hero-slide-card { height: 80vh; }
        }
      `}</style>
    </section>
  );
}
