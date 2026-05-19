"use client";
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { cart, removeFromCart, updateQty, cartTotal } = useCart();

  const deliveryCharge = cartTotal >= 599 ? 0 : 49;
  const discount = Math.floor(cartTotal * 0.1);
  const finalTotal = cartTotal + deliveryCharge - discount;

  if (cart.length === 0) {
    return (
      <div style={{ marginTop: '85px', minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', padding: '40px 20px' }}>
        <div style={{ fontSize: '80px' }}>🛒</div>
        <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#212121', margin: 0 }}>Your cart is empty</h2>
        <p style={{ color: '#666', fontSize: '16px' }}>Looks like you haven't added anything yet.</p>
        <Link href="/" style={{ background: '#1B769A', color: '#fff', padding: '14px 36px', borderRadius: '8px', fontWeight: '700', fontSize: '16px', textDecoration: 'none' }}>
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '85px', background: '#f8f9fa', minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '30px', color: '#212121' }}>
          Shopping Cart <span style={{ color: '#999', fontSize: '18px', fontWeight: '500' }}>({cart.length} item{cart.length > 1 ? 's' : ''})</span>
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '30px', alignItems: 'start' }}>
          {/* Cart Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {cart.map((item, idx) => (
              <div key={idx} style={{ background: '#fff', borderRadius: '16px', padding: '24px', display: 'flex', gap: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', alignItems: 'flex-start' }}>
                {/* Image */}
                <Link href={`/product/${item.slug}`}>
                  <div style={{ width: '110px', height: '140px', flexShrink: 0, borderRadius: '10px', overflow: 'hidden', background: '#f5f5f5' }}>
                    <img src={item.img} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                </Link>
                {/* Info */}
                <div style={{ flex: 1 }}>
                  <Link href={`/product/${item.slug}`} style={{ textDecoration: 'none' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#212121', marginBottom: '6px' }}>{item.name}</h3>
                  </Link>
                  <p style={{ fontSize: '13px', color: '#888', marginBottom: '14px' }}>Size: <strong>{item.size}</strong></p>
                  
                  {/* Qty Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <span style={{ fontSize: '13px', color: '#555', fontWeight: '600' }}>Qty:</span>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
                      <button onClick={() => updateQty(item.slug, item.size, item.qty - 1)} style={{ width: '36px', height: '36px', background: '#f5f5f5', border: 'none', fontSize: '18px', cursor: 'pointer', fontWeight: '700', color: '#333' }}>−</button>
                      <span style={{ width: '44px', textAlign: 'center', fontWeight: '700', fontSize: '15px' }}>{item.qty}</span>
                      <button onClick={() => updateQty(item.slug, item.size, item.qty + 1)} style={{ width: '36px', height: '36px', background: '#f5f5f5', border: 'none', fontSize: '18px', cursor: 'pointer', fontWeight: '700', color: '#333' }}>+</button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '20px', fontWeight: '900', color: '#212121' }}>₹{(item.price * item.qty).toLocaleString()}</span>
                      <span style={{ fontSize: '13px', color: '#aaa', marginLeft: '8px' }}>₹{item.price} × {item.qty}</span>
                    </div>
                    <button onClick={() => removeFromCart(item.slug, item.size)} style={{ color: '#e53935', background: 'none', border: 'none', fontSize: '13px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', position: 'sticky', top: '100px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px', color: '#212121', borderBottom: '1px solid #f0f0f0', paddingBottom: '16px' }}>Order Summary</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', color: '#555' }}>
                <span>Subtotal ({cart.reduce((s, i) => s + i.qty, 0)} items)</span>
                <span style={{ fontWeight: '700', color: '#212121' }}>₹{cartTotal.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', color: '#555' }}>
                <span>Delivery</span>
                <span style={{ fontWeight: '700', color: deliveryCharge === 0 ? '#04ce00' : '#212121' }}>
                  {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', color: '#04ce00' }}>
                <span>Discount (10%)</span>
                <span style={{ fontWeight: '700' }}>−₹{discount.toLocaleString()}</span>
              </div>
            </div>

            <div style={{ borderTop: '2px dashed #f0f0f0', paddingTop: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <span style={{ fontSize: '18px', fontWeight: '800', color: '#212121' }}>Total</span>
              <span style={{ fontSize: '24px', fontWeight: '900', color: '#1B769A' }}>₹{finalTotal.toLocaleString()}</span>
            </div>

            {cartTotal < 599 && (
              <div style={{ background: '#fff8e1', border: '1px solid #ffd54f', borderRadius: '8px', padding: '12px 15px', marginBottom: '20px', fontSize: '13px', color: '#795548' }}>
                Add ₹{599 - cartTotal} more for <strong>FREE delivery</strong> 🚚
              </div>
            )}

            <Link href="/checkout" style={{ display: 'block', background: '#1B769A', color: '#fff', textAlign: 'center', padding: '16px', borderRadius: '10px', fontWeight: '800', fontSize: '16px', textDecoration: 'none', letterSpacing: '0.5px', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#3a3580'}
              onMouseLeave={e => e.currentTarget.style.background = '#1B769A'}
            >
              Proceed to Checkout →
            </Link>

            <Link href="/" style={{ display: 'block', textAlign: 'center', marginTop: '14px', fontSize: '14px', color: '#1B769A', fontWeight: '600', textDecoration: 'none' }}>
              ← Continue Shopping
            </Link>

            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center', gap: '15px', opacity: 0.6 }}>
              {['🔒 Secure', '🚚 Free Ship', '↩ Easy Return'].map(t => (
                <span key={t} style={{ fontSize: '11px', color: '#555' }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .cart-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
