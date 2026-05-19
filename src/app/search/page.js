"use client";
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  // Mock results
  const results = [
    { id: 1, name: 'Mauve Linen Striped Shirt', price: '899', img: '/images/products/mauve-linen-shirt.png', slug: 'mauve-linen-striped-shirt' },
    { id: 2, name: 'Green Linen Striped Shirt', price: '899', img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800', slug: 'green-linen-striped-shirt' },
  ].filter(item => item.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="search-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '150px 15px 80px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800' }}>SEARCH RESULTS FOR: "{query}"</h1>
        <p style={{ color: '#666' }}>{results.length} items found</p>
      </div>

      {results.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <h2 style={{ fontSize: '20px', color: '#888' }}>No results found for "{query}"</h2>
          <p style={{ margin: '15px 0 30px' }}>Try searching for something else like "Shirt" or "Polo"</p>
          <Link href="/" style={{ color: '#1B769A', fontWeight: '700' }}>Back to Home</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '25px' }}>
          {results.map((item) => (
            <Link key={item.id} href={`/product/${item.slug}`} className="premium-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ width: '100%', aspectRatio: '3/4', overflow: 'hidden', borderRadius: '12px' }}>
                <img src={item.img} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '15px 0' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600' }}>{item.name}</h3>
                <p style={{ fontSize: '18px', fontWeight: '800', marginTop: '5px' }}>₹{item.price}</p>
              </div>
            </Link>
          ))}
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
