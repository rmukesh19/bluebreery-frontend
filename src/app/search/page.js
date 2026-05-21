"use client";
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense, useState, useEffect } from 'react';
import { API_URLS, resolveImageUrl, handleImageError } from '@/utils/api';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(API_URLS.PRODUCTS);
        if (res.ok) {
          const data = await res.json();
          setProducts(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Error fetching search page products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const results = products.filter(item => 
    (item.name && item.name.toLowerCase().includes(query.toLowerCase())) ||
    (item.category && item.category.toLowerCase().includes(query.toLowerCase())) ||
    (item.brand && item.brand.toLowerCase().includes(query.toLowerCase())) ||
    (item.description && item.description.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="search-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '150px 15px 80px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800' }}>SEARCH RESULTS FOR: "{query}"</h1>
        <p style={{ color: '#666' }}>{loading ? 'Searching...' : `${results.length} items found`}</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <h2 style={{ fontSize: '18px', color: '#666' }}>Searching database...</h2>
        </div>
      ) : results.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <h2 style={{ fontSize: '20px', color: '#888' }}>No results found for "{query}"</h2>
          <p style={{ margin: '15px 0 30px' }}>Try searching for something else like "Shirt" or "Polo"</p>
          <Link href="/" style={{ color: '#1B769A', fontWeight: '700' }}>Back to Home</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '25px' }}>
          {results.map((item) => {
            const productImg = (item.images && item.images[0])
              ? resolveImageUrl(item.images[0])
              : (item.img ? resolveImageUrl(item.img) : '/product_shirt.png');

            return (
              <Link key={item._id || item.id} href={`/product/${item.slug}`} className="premium-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ width: '100%', aspectRatio: '3/4', overflow: 'hidden', borderRadius: '12px', position: 'relative', backgroundColor: '#f9f9f9' }}>
                  <img 
                    src={productImg} 
                    alt={item.name} 
                    onError={(e) => handleImageError(e, 'product')}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </div>
                <div style={{ padding: '15px 0' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600' }}>{item.name}</h3>
                  <p style={{ fontSize: '18px', fontWeight: '800', marginTop: '5px' }}>₹{item.price}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ padding: '150px 15px', textAlign: 'center' }}>Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
