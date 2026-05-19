'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '@/images/blueberry-logo-Photoroom.png';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Layers, 
  ListTree, 
  ShoppingBag, 
  Image as ImageIcon, 
  Menu, 
  X, 
  LogOut,
  Bell,
  User
} from 'lucide-react';
import { ToastProvider } from '@/context/ToastContext';
import './admin.css';

const navItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Categories', path: '/admin/categories', icon: Layers },
  { name: 'Subcategories', path: '/admin/subcategories', icon: ListTree },
  { name: 'Products', path: '/admin/products', icon: ShoppingBag },
  { name: 'Banners', path: '/admin/banners', icon: ImageIcon },
];

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (!isLoginPage) {
      const isLoggedIn = localStorage.getItem("admin_logged_in") === "true";
      if (!isLoggedIn) {
        router.push("/admin/login");
      } else {
        setAuthorized(true);
      }
    } else {
      setAuthorized(true);
    }
  }, [pathname, isLoginPage, router]);

  const handleLogout = () => {
    localStorage.removeItem("admin_logged_in");
    router.push("/admin/login");
  };

  if (isLoginPage) {
    return <ToastProvider>{children}</ToastProvider>;
  }

  if (!authorized) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', justifyContent: 'center', background: '#06162b', color: '#fff', fontFamily: 'sans-serif' }}>
        <div style={{
          border: '4px solid rgba(255, 221, 0, 0.1)',
          borderLeftColor: '#ffdd00',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ margin: 0, fontSize: '12px', fontWeight: '800', letterSpacing: '2px', color: 'rgba(255,255,255,0.7)' }}>LOADING ADMIN DASHBOARD...</p>
        <style jsx>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="admin-layout">
        {/* Sidebar Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="mobile-overlay" 
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 999
            }}
          />
        )}

        {/* Sidebar */}
        <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-logo" style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Image src={logo} alt="TSATTAI Logo" style={{ width: '100%', height: 'auto', maxHeight: '50px', objectFit: 'contain' }} />
            <div style={{ color: 'var(--accent-color)', fontSize: '10px', fontWeight: '800', marginTop: '5px', letterSpacing: '3px' }}>ADMIN PANEL</div>
          </div>
          
          <nav className="sidebar-nav">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link 
                  key={item.path} 
                  href={item.path}
                  className={`sidebar-link ${isActive ? 'active' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="sidebar-footer" style={{ padding: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link href="/" className="sidebar-link" style={{ padding: '10px 15px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none' }}>
              <ShoppingBag size={20} />
              <span>View Website</span>
            </Link>
            <button 
              onClick={handleLogout}
              className="sidebar-link logout-btn" 
              style={{ 
                width: '100%', 
                background: 'rgba(239, 68, 68, 0.1)', 
                border: '1px solid rgba(239, 68, 68, 0.2)', 
                color: '#f87171', 
                borderRadius: '8px', 
                padding: '10px 15px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                cursor: 'pointer',
                font: 'inherit',
                fontWeight: '600'
              }}
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="admin-main">
          {/* Header */}
          <header className="admin-header">
            <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <button 
                className="mobile-toggle"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div className="header-title">
                <h2>{navItems.find(item => item.path === pathname)?.name || 'Admin'}</h2>
              </div>
            </div>

            <div className="header-actions">
              <button className="btn-icon" style={{ background: 'none' }}><Bell size={20} /></button>
              <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <div className="user-avatar" style={{ 
                  width: '35px', 
                  height: '35px', 
                  borderRadius: '50%', 
                  backgroundColor: 'var(--primary-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  <User size={20} />
                </div>
                <span style={{ fontSize: '14px', fontWeight: '600' }}>Admin</span>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <section className="admin-content">
            {children}
          </section>
        </main>

        <style jsx>{`
          .mobile-toggle {
            display: none;
            background: none;
            border: none;
            color: var(--primary-color);
            padding: 8px;
            cursor: pointer;
            border-radius: 6px;
          }
          .mobile-toggle:hover {
            background-color: #f3f4f6;
          }
          @media (max-width: 1024px) {
            .mobile-toggle {
              display: block;
            }
          }
          .sidebar-footer {
            padding: 20px 0;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
          }
        `}</style>
      </div>
    </ToastProvider>
  );
}
