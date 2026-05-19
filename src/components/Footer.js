"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  const isAdminPath = pathname?.startsWith('/admin');

  if (isAdminPath) return null;
  return (
    <>
      {/* Newsletter Section */}
      <div style={{ background: '#212121', padding: '40px 0' }}>
        <div className="container newsletter-mobile-stack" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1600px', margin: '0 auto' }}>
          <p style={{ color: '#fff', fontSize: '16px', maxWidth: '500px', margin: 0 }} className="newsletter-text-mobile">
            Xclusive coupons, extra savings, and tons of EVERYDAY deals delivered straight to your inbox.
          </p>
          <div style={{ display: 'flex', background: '#fff', borderRadius: '8px', padding: '5px' }} className="newsletter-input-container-mobile">
            <input type="email" placeholder="Enter your email address" style={{ border: 'none', padding: '12px 20px', outline: 'none', width: '100%', fontSize: '14px' }} />
            <button style={{ background: '#4F86F7', color: '#fff', padding: '12px 30px', borderRadius: '6px', fontWeight: '700', whiteSpace: 'nowrap' }}>Subscribe</button>
          </div>
        </div>
        <style jsx>{`
          @media (max-width: 768px) {
            .newsletter-mobile-stack { flex-direction: column !important; text-align: center; gap: 25px; }
            .newsletter-text-mobile { font-size: 14px !important; line-height: 1.5; }
            .newsletter-input-container-mobile { width: 100% !important; flex-direction: column; gap: 10px; background: transparent !important; padding: 0 !important; }
            .newsletter-input-container-mobile input { border-radius: 8px !important; padding: 15px !important; }
            .newsletter-input-container-mobile button { width: 100% !important; border-radius: 8px !important; padding: 15px !important; }
          }
        `}</style>
      </div>

      <footer style={{ background: '#1a1a1a', borderTop: '1px solid #333', padding: '60px 0 20px' }}>
        <div className="container" style={{ margin: '0 auto', maxWidth: '1600px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px', marginBottom: '50px' }} className="footer-links-mobile">
            <div>
              <h4 style={{ color: '#fff', fontSize: '16px', marginBottom: '25px', textTransform: 'uppercase', fontWeight: '700' }}>SUPPORT</h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: '#bbb', fontSize: '14px', listStyle: 'none', padding: 0, margin: 0 }}>
                <li><Link href="/track-order" style={{ color: 'inherit', textDecoration: 'none' }}>Track Order</Link></li>
                <li><Link href="/return-policy" style={{ color: 'inherit', textDecoration: 'none' }}>Returns & Exchange Policy</Link></li>
                <li><Link href="/shipping-policy" style={{ color: 'inherit', textDecoration: 'none' }}>Shipping Policy</Link></li>
                <li><Link href="/contact-us" style={{ color: 'inherit', textDecoration: 'none' }}>Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: '#fff', fontSize: '16px', marginBottom: '25px', textTransform: 'uppercase', fontWeight: '700' }}>COMPANY</h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: '#bbb', fontSize: '14px', listStyle: 'none', padding: 0, margin: 0 }}>
                <li><Link href="/about-us" style={{ color: 'inherit', textDecoration: 'none' }}>About Us</Link></li>
                <li><Link href="/collaboration" style={{ color: 'inherit', textDecoration: 'none' }}>Collaboration</Link></li>
                <li><Link href="/career" style={{ color: 'inherit', textDecoration: 'none' }}>Career</Link></li>
                <li><Link href="/privacy-policy" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</Link></li>
                <li><Link href="/terms-conditions" style={{ color: 'inherit', textDecoration: 'none' }}>Terms & Conditions</Link></li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: '#fff', fontSize: '16px', marginBottom: '25px', textTransform: 'uppercase', fontWeight: '700' }}>STORES NEAR ME</h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: '#bbb', fontSize: '14px', listStyle: 'none', padding: 0, margin: 0 }}>
                <li>Udaipur</li>
                <li>Lucknow</li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: '#fff', fontSize: '16px', marginBottom: '25px', textTransform: 'uppercase', fontWeight: '700' }}>LOCATIONS</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <span style={{ color: '#bbb', fontSize: '14px' }}>support@blueberries.com</span>
                <span style={{ color: '#bbb', fontSize: '14px' }}>40, 102, S Car St, next to City Union Bank,</span>
                <span style={{ color: '#bbb', fontSize: '14px' }}>Kamalar, Tiruchengode, Tamil Nadu 637211</span>
              </div>
            </div>
          </div>
          <style jsx>{`
            @media (max-width: 768px) {
              .footer-links-mobile { grid-template-columns: repeat(2, 1fr) !important; gap: 30px !important; }
            }
            @media (max-width: 480px) {
              .footer-links-mobile { grid-template-columns: 1fr !important; gap: 30px !important; }
            }
          `}</style>

          {/* Accordion Sections */}
          <div style={{ borderTop: '1px solid #333', borderBottom: '1px solid #333', padding: '20px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', cursor: 'pointer' }}>
              <h4 style={{ color: '#fff', fontSize: '14px', margin: 0, textTransform: 'uppercase' }}>WHY CHOOSE US?</h4>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', cursor: 'pointer', borderTop: '1px solid #333' }}>
              <h4 style={{ color: '#fff', fontSize: '14px', margin: 0, textTransform: 'uppercase' }}>POPULAR CATEGORIES</h4>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
            </div>
          </div>

          {/* Bottom Bar: Secure Payment & Social */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '40px' }} className="mobile-stack">
            <div style={{ width: '100%' }}>
              <h4 style={{ color: '#fff', fontSize: '14px', marginBottom: '15px', textTransform: 'uppercase', fontWeight: '700' }}>100% SECURE PAYMENT</h4>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ padding: '4px 10px', background: '#00baf2', borderRadius: '4px', display: 'flex', alignItems: 'center', fontWeight: '800', color: '#fff', fontSize: '11px' }}>Paytm</div>
                <div style={{ padding: '4px 10px', background: '#5f259f', borderRadius: '4px', display: 'flex', alignItems: 'center', fontWeight: '800', color: '#fff', fontSize: '11px' }}>PhonePe</div>
                <div style={{ padding: '4px 10px', background: '#fff', borderRadius: '4px', display: 'flex', alignItems: 'center', fontWeight: '800', color: '#ff6600', fontSize: '11px' }}>UPI</div>
              </div>
            </div>
            <div style={{ width: '100%' }} className="footer-social-mobile">
              <h4 style={{ color: '#fff', fontSize: '14px', marginBottom: '15px', textTransform: 'capitalize', fontWeight: '700' }}>Follow Us To See Our Cooler Side</h4>
              <div style={{ display: 'flex', gap: '20px' }} className="footer-social-icons">
                <a href="#" style={{ color: '#E4405F', transition: 'transform 0.3s' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </a>
                <a href="#" style={{ color: '#1877F2', transition: 'transform 0.3s' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
                <a href="#" style={{ color: '#FF0000', transition: 'transform 0.3s' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.14 1 12 1 12s0 3.86.42 5.58a2.78 2.78 0 0 0 1.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.86 23 12 23 12s0-3.86-.42-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
                </a>
              </div>
            </div>
          </div>
          <style jsx>{`
            @media (max-width: 768px) {
              .mobile-stack { flex-direction: column !important; gap: 30px; align-items: flex-start !important; }
              .footer-social-mobile { text-align: left !important; }
              .footer-social-icons { justify-content: flex-start !important; }
            }
          `}</style>

          <div style={{ textAlign: 'center', marginTop: '60px', color: '#666', fontSize: '13px' }}>
            Copyright © 2026 Blueberries .
          </div>
        </div>
      </footer>
    </>
  );
}
