"use client";
import { useState } from 'react';

export default function ContactUsPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="contact-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '120px 15px 60px' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#1a1a1a', marginBottom: '15px' }}>WE'D LOVE TO HEAR FROM YOU</h1>
        <p style={{ fontSize: '18px', color: '#666', maxWidth: '700px', margin: '0 auto' }}>Whether you have a question about features, pricing, or anything else, our team is ready to answer all your questions.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '50px' }}>
        {/* Contact Info */}
        <div style={{ padding: '20px' }}>
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '20px', color: '#1B769A' }}>CONTACT DETAILS</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                <div style={{ background: '#f0efff', padding: '12px', borderRadius: '12px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1B769A" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </div>
                <div>
                  <h4 style={{ fontWeight: '700', fontSize: '16px', marginBottom: '5px' }}>Phone</h4>
                  <p style={{ color: '#666' }}>+91 98765 43210</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                <div style={{ background: '#f0efff', padding: '12px', borderRadius: '12px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1B769A" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <div>
                  <h4 style={{ fontWeight: '700', fontSize: '16px', marginBottom: '5px' }}>Email</h4>
                  <p style={{ color: '#666' }}>support@bluebarry.in</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                <div style={{ background: '#f0efff', padding: '12px', borderRadius: '12px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1B769A" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <div>
                  <h4 style={{ fontWeight: '700', fontSize: '16px', marginBottom: '5px' }}>Office</h4>
                  <p style={{ color: '#666' }}>40, 102, S Car St, next to City Union Bank, <br />Kamalar, Tiruchengode, Tamil Nadu 637211</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '20px', color: '#1B769A' }}>FOLLOW US</h3>
            <div style={{ display: 'flex', gap: '15px' }}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{ width: '45px', height: '45px', background: '#f0efff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: '0.3s' }}>
                  <div style={{ width: '20px', height: '20px', background: '#1B769A', borderRadius: '4px' }}></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div style={{ background: '#fff', padding: '40px', borderRadius: '20px', boxShadow: '0 15px 50px rgba(0,0,0,0.08)' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ width: '80px', height: '80px', background: '#04ce00', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '10px' }}>Message Sent!</h2>
              <p style={{ color: '#666' }}>We'll get back to you within 24 hours.</p>
              <button onClick={() => setSubmitted(false)} style={{ marginTop: '30px', background: '#1B769A', color: '#fff', border: 'none', padding: '12px 30px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>Send Another</button>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>First Name</label>
                  <input type="text" required style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>Last Name</label>
                  <input type="text" required style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }} />
                </div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>Email Address</label>
                <input type="email" required style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>Subject</label>
                <select style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}>
                  <option>Order Status</option>
                  <option>Returns & Exchanges</option>
                  <option>Product Inquiry</option>
                  <option>Others</option>
                </select>
              </div>
              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>Your Message</label>
                <textarea required rows="5" style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', resize: 'none' }}></textarea>
              </div>
              <button type="submit" style={{ width: '100%', background: '#1B769A', color: '#fff', padding: '15px', border: 'none', borderRadius: '8px', fontWeight: '800', fontSize: '16px', cursor: 'pointer' }}>SEND MESSAGE</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
