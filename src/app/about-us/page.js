"use client";

export default function AboutUsPage() {
  return (
    <div className="about-container" style={{ paddingTop: '100px' }}>
      {/* Hero Section */}
      <section style={{ background: '#1B769A', color: '#fff', padding: '100px 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '48px', fontWeight: '900', marginBottom: '20px' }}>WE ARE BLUEBARRY</h1>
        <p style={{ fontSize: '20px', opacity: '0.9', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
          Redefining everyday fashion with a focus on comfort, quality, and timeless style. Founded in 2026, we've been on a mission to bring premium fashion to everyone.
        </p>
      </section>

      {/* Story Section */}
      <section style={{ maxWidth: '1200px', margin: '100px auto', padding: '0 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '80px', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '25px', color: '#1a1a1a' }}>OUR STORY</h2>
            <p style={{ fontSize: '18px', color: '#666', lineHeight: '1.8', marginBottom: '20px' }}>
              Blueberries started with a simple idea: why should premium quality clothing cost a fortune? We set out to bridge the gap between high-end fashion and everyday wear.
            </p>
            <p style={{ fontSize: '18px', color: '#666', lineHeight: '1.8' }}>
              Today, we are proud to serve over 1 million customers across India, delivering styles that make people feel confident and comfortable in their own skin.
            </p>
          </div>
          <div style={{ position: 'relative' }}>
            <img 
              src="https://images.unsplash.com/photo-1521335629791-ce4aec67dd15?auto=format&fit=crop&q=80&w=800" 
              alt="Our Story" 
              style={{ width: '100%', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} 
            />
            <div style={{ position: 'absolute', bottom: '-30px', left: '-30px', background: '#FFDD00', padding: '30px', borderRadius: '15px', fontWeight: '900', fontSize: '24px' }}>
              EST. 2026
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section style={{ background: '#f9f9f9', padding: '100px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '32px', fontWeight: '800', marginBottom: '60px' }}>OUR CORE VALUES</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
            {[
              { title: 'Quality First', desc: 'We never compromise on the fabric and stitching quality of our products.', icon: '🏆' },
              { title: 'Customer Obsessed', desc: 'Our customers are at the heart of everything we do and every decision we make.', icon: '❤️' },
              { title: 'Affordable Style', desc: 'Making high-end trends accessible to everyone without the premium price tag.', icon: '💰' },
              { title: 'Innovation', desc: 'Constantly evolving our designs and technology to serve you better.', icon: '🚀' }
            ].map((value, i) => (
              <div key={i} style={{ background: '#fff', padding: '40px', borderRadius: '15px', textAlign: 'center', boxShadow: '0 5px 20px rgba(0,0,0,0.03)' }}>
                <div style={{ fontSize: '40px', marginBottom: '20px' }}>{value.icon}</div>
                <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '15px' }}>{value.title}</h3>
                <p style={{ color: '#666', lineHeight: '1.6' }}>{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section style={{ maxWidth: '1200px', margin: '100px auto', padding: '0 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '60px' }}>THE MINDS BEHIND BLUEBARRY</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px' }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i}>
              <div style={{ width: '100%', aspectRatio: '1/1', background: '#eee', borderRadius: '50%', marginBottom: '20px', overflow: 'hidden' }}>
                <img src={`https://i.pravatar.cc/300?img=${i+10}`} alt="Team Member" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h4 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '5px' }}>Member {i}</h4>
              <p style={{ color: '#1B769A', fontWeight: '600', fontSize: '14px' }}>DESIGNER</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
