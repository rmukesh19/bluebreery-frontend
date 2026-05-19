"use client";
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Preloader() {
  const pathname = usePathname();
  const isAdminPath = pathname?.startsWith('/admin');

  const [loading, setLoading] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Synchronize with CSS animation duration
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        setLoading(false);
      }, 800); // Wait for exit animation (fade out)
    }, 1500); // Show preloader for 1.5s

    return () => clearTimeout(timer);
  }, []);

  if (isAdminPath || !loading) return null;

  return (
    <div className={`preloader-global-container ${isExiting ? 'exit' : ''}`}>
      <div className="preloader-content">
        <div className="preloader-brand-wrapper">
          <div className="preloader-brand-inner" style={{ display: 'flex', gap: '8px', marginBottom: '30px' }}>
            {"BLUEBERRIES".split("").map((letter, i) => (
              <span key={i} className="preloader-letter" style={{ 
                color: '#D4AF37',
                fontSize: 'clamp(32px, 8vw, 64px)',
                fontWeight: '800',
                letterSpacing: '4px',
                animationDelay: `${i * 0.1}s` 
              }}>
                {letter}
              </span>
            ))}
          </div>
          <div className="preloader-progress-container">
            <div className="preloader-progress-bar"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .preloader-content { text-align: center; }
        .preloader-letter {
          opacity: 0;
          transform: translateY(20px);
          animation: letterReveal 0.8s forwards cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        @keyframes letterReveal { to { opacity: 1; transform: translateY(0); } }
        .preloader-progress-container {
          width: 200px; height: 2px;
          background: rgba(212, 175, 55, 0.1);
          margin: 0 auto; overflow: hidden; border-radius: 4px;
        }
        .preloader-progress-bar {
          width: 100%; height: 100%;
          background: #D4AF37;
          transform: translateX(-100%);
          animation: progressFlow 2s infinite ease-in-out;
        }
        @keyframes progressFlow {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
