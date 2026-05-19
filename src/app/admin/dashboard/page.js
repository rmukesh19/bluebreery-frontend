'use client';

import React from 'react';
import Link from 'next/link';
import { API_URLS } from '@/utils/api';

import { 
  ShoppingBag, 
  Users, 
  Layers, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export default function Dashboard() {
  const [products, setProducts] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const prodRes = await fetch(API_URLS.PRODUCTS);
        const prodData = await prodRes.json();
        setProducts(prodData);

        const catRes = await fetch(API_URLS.CATEGORIES);
        const catData = await catRes.json();
        setCategories(catData);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalProducts = products.length;
  const totalCategories = categories.length;

  const stats = [
    { title: 'Total Products', value: loading ? '...' : totalProducts.toString(), icon: ShoppingBag, color: 'blue', change: '+12%', up: true },
    { title: 'Total Categories', value: loading ? '...' : totalCategories.toString(), icon: Layers, color: 'gold', change: '+2', up: true },
    { title: 'Total Customers', value: '1,240', icon: Users, color: 'green', change: '+18%', up: true },
    { title: 'Monthly Revenue', value: '₹4,85,200', icon: TrendingUp, color: 'purple', change: '-5%', up: false },
  ];

  const recentProducts = products.slice(0, 4).map(p => {
    const totalStock = Array.isArray(p.variants) 
      ? p.variants.reduce((acc, v) => acc + (Array.isArray(v.sizes) ? v.sizes.reduce((sum, s) => sum + parseInt(s.stock || 0), 0) : 0), 0)
      : 0;

    let status = 'In Stock';
    if (totalStock === 0) status = 'Out of Stock';
    else if (totalStock < 15) status = 'Low Stock';

    return {
      name: p.name,
      sku: p.sku || 'N/A',
      price: `₹${p.price}`,
      stock: totalStock,
      status: status
    };
  });

  return (
    <div className="dashboard-wrapper">
      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="stat-card">
              <div className={`stat-icon ${stat.color}`}>
                <Icon size={24} />
              </div>
              <div className="stat-info">
                <p>{stat.title}</p>
                <h3>{stat.value}</h3>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '5px', 
                  fontSize: '12px',
                  color: stat.up ? '#22c55e' : '#ef4444'
                }}>
                  {stat.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  <span>{stat.change} than last month</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
        {/* Recent Products Table */}
        <div className="admin-card">
          <div className="card-header">
            <h3>Recent Products</h3>
            <Link href="/admin/products" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '13px' }}>View All</Link>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>SKU</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentProducts.map((product, index) => (
                <tr key={index}>
                  <td style={{ fontWeight: '600' }}>{product.name}</td>
                  <td>{product.sku}</td>
                  <td>{product.price}</td>
                  <td>{product.stock}</td>
                  <td>
                    <span className={`badge ${
                      product.status === 'In Stock' ? 'badge-success' : 
                      product.status === 'Low Stock' ? 'badge-warning' : ''
                    }`} style={{ 
                      backgroundColor: product.status === 'Out of Stock' ? '#fee2e2' : '',
                      color: product.status === 'Out of Stock' ? '#991b1b' : ''
                    }}>
                      {product.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quick Actions */}
        <div className="admin-card">
          <div className="card-header">
            <h3>Quick Actions</h3>
          </div>
          <div style={{ padding: '25px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <Link href="/admin/products" className="btn-primary" style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShoppingBag size={18} />
              Add New Product
            </Link>
            <Link href="/admin/categories" className="btn-secondary" style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Layers size={18} />
              Create Category
            </Link>
            <div style={{ 
              marginTop: '10px', 
              padding: '15px', 
              backgroundColor: '#f9fafb', 
              borderRadius: '8px',
              border: '1px dashed var(--border-color)'
            }}>
              <p style={{ fontSize: '13px', color: 'var(--gray-text)', lineHeight: '1.5' }}>
                Need help? Check the admin documentation for managing your store effectively.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
