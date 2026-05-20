"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Filter, X } from 'lucide-react';
import FilterSidebar from '@/components/FilterSidebar';
import { API_URLS, API_BASE_URL, resolveImageUrl } from '@/utils/api';

const getProductFallbackImage = (prodName) => {
  const name = (prodName || '').toLowerCase();
  if (name.includes('shirt')) return '/product_shirt.png';
  if (name.includes('trouser') || name.includes('pant') || name.includes('cargo') || name.includes('jeans') || name.includes('bottom')) return '/product_jeans.png';
  return '/product_tshirt.png';
};

const productImageUrls = [
  "https://images-home.beyoung.in/Shirts_category_section_03751efdd8.jpg",
  "https://images-home.beyoung.in/Trouser_category_section_c5e98dc1f9.jpg",
  "https://images-home.beyoung.in/polo_category_section_0d1eb8c7c3.jpg",
  "https://images-home.beyoung.in/Cargo_category_section_8835d5bebc.jpg",
  "https://images-home.beyoung.in/Jeans_category_section_e350d6f26c.jpg",
  "https://images-home.beyoung.in/Oversized_category_section_670db805d8.jpg"
];

export default function SubcategoryPage() {
  const params = useParams();
  const category = params?.category;
  const subcategory = params?.subcategory;
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubcategoryProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/products/subcategory/${subcategory}`);
        const data = await response.json();
        
        // Fallback: if no products for this specific subcategory, fetch all
        if (data.length === 0) {
          const allResponse = await fetch(API_URLS.PRODUCTS);
          const allData = await allResponse.json();
          setProducts(allData);
        } else {
          setProducts(data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching subcategory products:', error);
        setLoading(false);
      }
    };
    if (subcategory) {
      fetchSubcategoryProducts();
    }
  }, [subcategory]);

  const formattedTitle = (subcategory || '').replace(/-/g, ' ').toUpperCase();

  return (
    <div className="category-page-main">
      <div className="category-container" style={{ maxWidth: '1440px', margin: '0 auto', padding: '20px 20px 60px' }}>
        
        {/* Breadcrumbs */}
        <div style={{ fontSize: '12px', color: '#888', marginBottom: '30px', textTransform: 'capitalize', letterSpacing: '0.5px' }}>
          <Link href="/" style={{ color: '#888' }}>Home</Link> 
          <span style={{ margin: '0 8px', opacity: 0.5 }}>/</span> 
          <Link href={`/${category}`} style={{ color: '#888' }}>{category?.replace(/-/g, ' ')}</Link>
          <span style={{ margin: '0 8px', opacity: 0.5 }}>/</span> 
          <span style={{ color: '#000', fontWeight: '600' }}>{subcategory?.replace(/-/g, ' ')}</span>
        </div>

        {/* Mobile Filter Trigger */}
        <div className="mobile-filter-trigger" onClick={() => setShowMobileFilters(true)} style={{ display: 'none', marginBottom: '20px', padding: '12px', border: '1px solid #eee', borderRadius: '8px', alignItems: 'center', justifyContent: 'center', gap: '10px', background: '#fff', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <Filter size={18} />
          <span style={{ fontWeight: '700', fontSize: '14px', letterSpacing: '0.5px' }}>FILTERS</span>
        </div>

        <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
          {/* Filters Sidebar (Desktop) */}
          <aside className="desktop-filters-wrapper" style={{ width: '280px', flexShrink: 0, position: 'sticky', top: '100px' }}>
            <FilterSidebar />
          </aside>

          {/* Main Product Area */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '35px', borderBottom: '1px solid #f0f0f0', paddingBottom: '15px' }}>
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: '800', letterSpacing: '1px', marginBottom: '5px' }}>{formattedTitle}</h1>
                <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>Showing {products.length} stunning styles</p>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Sort By:</span>
                <select style={{ padding: '10px 15px', border: '1px solid #eee', borderRadius: '4px', outline: 'none', fontSize: '13px', fontWeight: '600', background: '#fff', cursor: 'pointer' }}>
                  <option>Popularity</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>New Arrivals</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '30px' }}>
              {(loading ? [1,2,3,4,5,6] : (Array.isArray(products) ? products : [])).map((product, i) => (
                <Link key={loading ? i : product._id} href={`/product/${product.slug}`} className="product-card-item" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="product-image-box" style={{ position: 'relative', width: '100%', aspectRatio: '2/3', overflow: 'hidden', borderRadius: '12px', backgroundColor: '#f9f9f9', transition: 'all 0.4s ease' }}>
                    <img 
                      src={resolveImageUrl(product.images?.[0]) || getProductFallbackImage(product.name)} 
                      alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
                    />
                  </div>
                  <div style={{ padding: '15px 5px' }}>
                    <h3 style={{ fontSize: '15px', color: '#222', fontWeight: '700', marginBottom: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textTransform: 'capitalize' }}>
                      {product.name}
                    </h3>
                    <p style={{ fontSize: '12px', color: '#888', marginBottom: '10px', fontWeight: '500' }}>{product.category} Collection</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '18px', fontWeight: '800', color: '#000' }}>₹{product.price}</span>
                      <span style={{ fontSize: '14px', color: '#bbb', textDecoration: 'line-through', fontWeight: '500' }}>₹{product.oldPrice}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {showMobileFilters && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 10000, animation: 'fadeIn 0.3s ease' }}>
          <div onClick={() => setShowMobileFilters(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}></div>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '300px', background: '#fff', padding: '20px', overflowY: 'auto', boxShadow: '5px 0 30px rgba(0,0,0,0.2)', animation: 'slideIn 0.3s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800' }}>Filters</h2>
              <X size={24} onClick={() => setShowMobileFilters(false)} style={{ cursor: 'pointer' }} />
            </div>
            <FilterSidebar />
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .product-image-box:hover img {
          transform: scale(1.08);
        }
        .product-card-item:hover .product-image-box {
          box-shadow: 0 15px 35px rgba(0,0,0,0.1);
        }
        @media (max-width: 1024px) {
          .desktop-filters-wrapper {
            display: none;
          }
          .mobile-filter-trigger {
            display: flex !important;
          }
          .category-container {
            padding: 20px 15px 40px !important;
          }
        }
      `}</style>
    </div>
  );
}
