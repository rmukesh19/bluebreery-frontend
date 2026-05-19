"use client";
import Link from 'next/link';
import { useState } from 'react';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="signup-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa', padding: '120px 20px 60px' }}>
      <div style={{ background: '#fff', width: '100%', maxWidth: '500px', padding: '40px', borderRadius: '15px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
        <div style={{ textAlign: 'center', marginBottom: '35px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#1B769A', letterSpacing: '-0.5px' }}>CREATE ACCOUNT</h1>
          <p style={{ color: '#666', marginTop: '5px' }}>Join the Blueberries fashion community</p>
        </div>

        <form onSubmit={(e) => e.preventDefault()}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '8px', color: '#333' }}>FULL NAME</label>
            <input 
              name="fullName"
              type="text" 
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your name"
              style={{ width: '100%', padding: '12px 15px', border: '1px solid #ddd', borderRadius: '8px', outline: 'none' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '8px', color: '#333' }}>EMAIL ADDRESS</label>
            <input 
              name="email"
              type="email" 
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              style={{ width: '100%', padding: '12px 15px', border: '1px solid #ddd', borderRadius: '8px', outline: 'none' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '8px', color: '#333' }}>PHONE NUMBER</label>
            <input 
              name="phone"
              type="tel" 
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              style={{ width: '100%', padding: '12px 15px', border: '1px solid #ddd', borderRadius: '8px', outline: 'none' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '8px', color: '#333' }}>PASSWORD</label>
            <input 
              name="password"
              type="password" 
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              style={{ width: '100%', padding: '12px 15px', border: '1px solid #ddd', borderRadius: '8px', outline: 'none' }}
            />
          </div>

          <p style={{ fontSize: '12px', color: '#888', marginBottom: '20px', lineHeight: '1.4' }}>
            By creating an account, you agree to Blueberries's <Link href="/terms-conditions" style={{ color: '#1B769A', textDecoration: 'none' }}>Terms & Conditions</Link> and <Link href="/privacy-policy" style={{ color: '#1B769A', textDecoration: 'none' }}>Privacy Policy</Link>.
          </p>

          <button type="submit" style={{ width: '100%', background: '#1B769A', color: '#fff', padding: '14px', border: 'none', borderRadius: '8px', fontWeight: '800', fontSize: '16px', cursor: 'pointer', transition: 'transform 0.2s' }}>
            CREATE ACCOUNT
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '14px', color: '#666', marginTop: '25px' }}>
          Already have an account? <Link href="/login" style={{ color: '#1B769A', fontWeight: '700', textDecoration: 'none' }}>Log In</Link>
        </p>
      </div>
    </div>
  );
}
