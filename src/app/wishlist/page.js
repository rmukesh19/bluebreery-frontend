"use client";
import Link from 'next/link';
import { useState } from 'react';

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([
    { id: 1, name: 'Mauve Linen Striped Shirt', price: '899', oldPrice: '2299', img: '/images/products/mauve-linen-shirt.png', slug: 'mauve-linen-striped-shirt' },
    { id: 2, name: 'Urban Cargo Joggers', price: '1299', oldPrice: '2499', img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=800', slug: 'urban-cargo-joggers' }
  ]);

  const removeItem = (id) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== id));
  };

  return (
    <div className="wishlist-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '120px 15px 60px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '30px', textAlign: 'center' }}>MY WISHLIST ({wishlistItems.length})</h1>
      
      {wishlistItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ marginBottom: '20px' }}>
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#666' }}>Your wishlist is empty!</h2>
          <p style={{ color: '#888', margin: '10px 0 30px' }}>Seems like you haven't added anything to your wishlist yet.</p>
          <Link href="/" style={{ background: '#1B769A', color: '#fff', padding: '12px 35px', borderRadius: '4px', fontWeight: '700', textDecoration: 'none' }}>CONTINUE SHOPPING</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '25px' }}>
          {wishlistItems.map((item) => (
            <div key={item.id} style={{ border: '1px solid #eee', borderRadius: '12px', overflow: 'hidden', position: 'relative', background: '#fff', transition: 'transform 0.3s' }}>
              <button 
                onClick={() => removeItem(item.id)}
                style={{ position: 'absolute', top: '10px', right: '10px', background: '#fff', border: 'none', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', zIndex: 2 }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
              
              <Link href={`/product/${item.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ width: '100%', aspectRatio: '3/4', overflow: 'hidden' }}>
                  <img src={item.img} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '15px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '18px', fontWeight: '800', color: '#000' }}>₹{item.price}</span>
                    <span style={{ fontSize: '14px', color: '#999', textDecoration: 'line-through' }}>₹{item.oldPrice}</span>
                  </div>
                </div>
              </Link>
              
              <div style={{ padding: '0 15px 15px' }}>
                <button style={{ width: '100%', background: '#1B769A', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' }}>ADD TO CART</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
