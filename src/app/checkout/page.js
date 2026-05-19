"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useCart();
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment
  const [loading, setLoading] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'cod'
  });

  const deliveryCharge = cartTotal >= 599 ? 0 : 49;
  const discount = Math.floor(cartTotal * 0.1);
  const finalTotal = cartTotal + deliveryCharge - discount;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      window.scrollTo(0, 0);
    }
  };

  const handlePlaceOrder = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      clearCart();
      router.push('/checkout/success');
    }, 1500);
  };

  if (cart.length === 0) {
    // Check if we are on the client to avoid SSR issues
    if (typeof window !== 'undefined') {
      router.push('/checkout/cart');
    }
    return null;
  }

  return (
    <div style={{ marginTop: '85px', background: '#f8f9fa', minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* Progress Header */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px', gap: '15px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ 
              width: '32px', height: '32px', borderRadius: '50%', 
              background: step >= 1 ? '#1B769A' : '#ddd', 
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' 
            }}>1</span>
            <span style={{ fontWeight: '700', color: step >= 1 ? '#212121' : '#999' }}>Shipping</span>
          </div>
          <div style={{ width: '60px', height: '2px', background: step >= 2 ? '#1B769A' : '#ddd' }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ 
              width: '32px', height: '32px', borderRadius: '50%', 
              background: step >= 2 ? '#1B769A' : '#ddd', 
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' 
            }}>2</span>
            <span style={{ fontWeight: '700', color: step >= 2 ? '#212121' : '#999' }}>Payment</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '30px', alignItems: 'start' }} className="checkout-grid">
          
          {/* Main Content */}
          <div style={{ background: '#fff', borderRadius: '20px', padding: '35px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            
            {step === 1 ? (
              <form onSubmit={handleNextStep}>
                <h2 style={{ fontSize: '22px', fontWeight: '900', marginBottom: '25px', color: '#212121' }}>Delivery Address</h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <label style={labelStyle}>Full Name</label>
                    <input 
                      required name="fullName" value={formData.fullName} onChange={handleInputChange}
                      placeholder="Enter your name" style={inputStyle} 
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Phone Number</label>
                    <input 
                      required name="phone" value={formData.phone} onChange={handleInputChange}
                      placeholder="10-digit mobile number" style={inputStyle} 
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={labelStyle}>Email Address</label>
                  <input 
                    required name="email" value={formData.email} onChange={handleInputChange}
                    placeholder="For order tracking" style={inputStyle} type="email"
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={labelStyle}>Detailed Address</label>
                  <textarea 
                    required name="address" value={formData.address} onChange={handleInputChange}
                    placeholder="House No, Street, Landmark" style={{ ...inputStyle, height: '100px', resize: 'none' }} 
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '30px' }}>
                  <div>
                    <label style={labelStyle}>Pincode</label>
                    <input 
                      required name="pincode" value={formData.pincode} onChange={handleInputChange}
                      placeholder="6 digits" style={inputStyle} 
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>City</label>
                    <input 
                      required name="city" value={formData.city} onChange={handleInputChange}
                      placeholder="Town/City" style={inputStyle} 
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>State</label>
                    <input 
                      required name="state" value={formData.state} onChange={handleInputChange}
                      placeholder="State" style={inputStyle} 
                    />
                  </div>
                </div>

                <button type="submit" style={btnPrimaryStyle}>
                  Continue to Payment
                </button>
              </form>
            ) : (
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: '900', marginBottom: '25px', color: '#212121' }}>Payment Method</h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
                  {[
                    { id: 'cod', label: 'Cash on Delivery', sub: 'Pay when your package arrives', icon: '💵' },
                    { id: 'upi', label: 'PhonePe / GPay / UPI', sub: 'Instant & Secure', icon: '📱' },
                    { id: 'card', label: 'Credit / Debit Card', sub: 'All major cards accepted', icon: '💳' }
                  ].map(method => (
                    <label key={method.id} style={{ 
                      display: 'flex', alignItems: 'center', gap: '15px', padding: '20px', 
                      border: `2px solid ${formData.paymentMethod === method.id ? '#1B769A' : '#eee'}`,
                      borderRadius: '12px', cursor: 'pointer', background: formData.paymentMethod === method.id ? '#fcfcff' : '#fff',
                      transition: 'all 0.2s'
                    }}>
                      <input 
                        type="radio" name="paymentMethod" value={method.id} 
                        checked={formData.paymentMethod === method.id}
                        onChange={handleInputChange}
                        style={{ width: '20px', height: '20px', accentColor: '#1B769A' }}
                      />
                      <span style={{ fontSize: '24px' }}>{method.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '700', color: '#212121' }}>{method.label}</div>
                        <div style={{ fontSize: '13px', color: '#777' }}>{method.sub}</div>
                      </div>
                    </label>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                  <button onClick={() => setStep(1)} style={{ ...btnPrimaryStyle, background: '#f5f5f5', color: '#666', flex: 0.4 }}>
                    Back
                  </button>
                  <button onClick={handlePlaceOrder} disabled={loading} style={{ ...btnPrimaryStyle, flex: 1 }}>
                    {loading ? 'Processing...' : `Pay ₹${finalTotal.toLocaleString()}`}
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Sidebar Summary */}
          <div style={{ position: 'sticky', top: '100px' }}>
            <div style={{ background: '#fff', borderRadius: '20px', padding: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '20px', color: '#212121' }}>Order Summary</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#666' }}>
                  <span>Price ({cart.reduce((s, i) => s + i.qty, 0)} items)</span>
                  <span style={{ fontWeight: '600' }}>₹{cartTotal.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#666' }}>
                  <span>Delivery</span>
                  <span style={{ fontWeight: '600', color: deliveryCharge === 0 ? '#04ce00' : '#212121' }}>
                    {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#04ce00' }}>
                  <span>Discount</span>
                  <span style={{ fontWeight: '600' }}>−₹{discount.toLocaleString()}</span>
                </div>
                <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '12px', marginTop: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: '800', color: '#212121' }}>Total Amount</span>
                  <span style={{ fontWeight: '900', fontSize: '20px', color: '#1B769A' }}>₹{finalTotal.toLocaleString()}</span>
                </div>
              </div>

              <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '10px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', textAlign: 'center' }}>
                You are saving ₹{discount.toLocaleString()} on this order! 🎉
              </div>
            </div>

            {/* Items Preview */}
            <div style={{ background: '#fff', borderRadius: '20px', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '15px', color: '#212121' }}>Items ({cart.length})</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {cart.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '45px', height: '55px', borderRadius: '6px', overflow: 'hidden', background: '#f5f5f5' }}>
                      <img src={item.img} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#212121', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                      <div style={{ fontSize: '11px', color: '#888' }}>Size: {item.size} | Qty: {item.qty}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .checkout-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: '700',
  color: '#555',
  marginBottom: '8px'
};

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: '10px',
  border: '1.5px solid #e0e0e0',
  fontSize: '15px',
  outline: 'none',
  transition: 'border-color 0.2s',
  background: '#fafafa',
  boxSizing: 'border-box'
};

const btnPrimaryStyle = {
  width: '100%',
  background: '#1B769A',
  color: '#fff',
  border: 'none',
  padding: '16px',
  borderRadius: '12px',
  fontSize: '16px',
  fontWeight: '800',
  cursor: 'pointer',
  transition: 'all 0.2s',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};
