"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function SuccessPage() {
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    // Generate a random order ID
    const id = 'BB' + Math.floor(100000 + Math.random() * 900000);
    setOrderId(id);
  }, []);

  return (
    <div style={{ marginTop: '85px', background: '#f8f9fa', minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ maxWidth: '600px', width: '100%', background: '#fff', borderRadius: '24px', padding: '50px 30px', textAlign: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.06)' }}>
        <div style={{
          width: '80px', height: '80px', background: '#e8f5e9', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px'
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>

        <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#212121', marginBottom: '15px' }}>Order Placed Successfully!</h1>
        <p style={{ color: '#666', fontSize: '16px', lineHeight: '1.6', marginBottom: '30px' }}>
          Thank you for shopping with us. Your order <strong style={{ color: '#1B769A' }}>#{orderId}</strong> has been received and is being processed.
        </p>

        <div style={{ background: '#fcfcff', border: '1px dashed #1B769A', borderRadius: '16px', padding: '25px', marginBottom: '40px', textAlign: 'left' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#212121', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>🚚</span> Next Steps
          </h3>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li style={{ fontSize: '14px', color: '#555', display: 'flex', gap: '10px' }}>
              <span style={{ color: '#1B769A', fontWeight: 'bold' }}>•</span>
              You will receive a confirmation email shortly.
            </li>
            <li style={{ fontSize: '14px', color: '#555', display: 'flex', gap: '10px' }}>
              <span style={{ color: '#1B769A', fontWeight: 'bold' }}>•</span>
              Our team will verify and pack your items with care.
            </li>
            <li style={{ fontSize: '14px', color: '#555', display: 'flex', gap: '10px' }}>
              <span style={{ color: '#1B769A', fontWeight: 'bold' }}>•</span>
              You can track your order status in your profile.
            </li>
          </ul>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <Link href="/" style={{
            background: '#1B769A', color: '#fff', padding: '18px', borderRadius: '12px',
            fontWeight: '800', fontSize: '16px', textDecoration: 'none', transition: 'all 0.2s'
          }}>
            Continue Shopping
          </Link>
          <button style={{
            background: 'none', border: 'none', color: '#1B769A', fontWeight: '700',
            fontSize: '14px', cursor: 'pointer', padding: '10px'
          }}>
            Download Invoice (PDF)
          </button>
        </div>
      </div>
    </div>
  );
}
