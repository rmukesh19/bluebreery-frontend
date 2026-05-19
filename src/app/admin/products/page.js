'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit2, Trash2, Filter, X } from 'lucide-react';
import { API_URLS } from '@/utils/api';
import { useToast } from '@/context/ToastContext';

export default function Products() {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await fetch(API_URLS.PRODUCTS);
      const data = await response.json();
      setProductList(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products based on search
  const filteredProducts = Array.isArray(productList) ? productList.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.slug && p.slug.toLowerCase().includes(searchTerm.toLowerCase()))
  ) : [];

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    setDeleting(true);
    try {
      const response = await fetch(`${API_URLS.PRODUCTS}/${productToDelete._id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        showToast('Product deleted successfully!', 'success');
        fetchProducts();
        setShowDeleteModal(false);
        setProductToDelete(null);
      } else {
        const errorData = await response.json();
        showToast(errorData.message || 'Failed to delete product', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('Network error: Could not connect to the server.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="products-wrapper">
      {/* Header Actions */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--gray-text)'
            }} />
            <input
              type="text"
              placeholder="Search products by name or SKU..."
              className="form-control"
              style={{ paddingLeft: '40px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn-secondary" onClick={() => showToast('Filter feature coming soon!', 'info')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 15px' }}>
            <Filter size={18} />
            Filter
          </button>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href="/admin/products/add" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} />
            Add Product
          </Link>
        </div>
      </div>

      {/* Products Table */}
      <div className="admin-card">
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '50px' }}>Loading products...</td></tr>
              ) : filteredProducts.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '50px' }}>No products found</td></tr>
              ) : filteredProducts.map((product) => (
                <tr key={product._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div style={{ width: '45px', height: '45px', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#f0f0f0' }}>
                        {product.images && product.images[0] ? (
                          <img src={product.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', fontSize: '10px' }}>IMG</div>
                        )}
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '14px' }}>{product.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--gray-text)' }}>SKU: {product.slug ? product.slug.toUpperCase().substring(0, 8) : 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td>{product.brand || 'General'}</td>
                  <td>
                    <div style={{ fontWeight: '600' }}>₹{product.price}</div>
                    <div style={{ fontSize: '12px', color: '#ef4444', textDecoration: 'line-through' }}>₹{product.oldPrice}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: '14px' }}>45 in stock</div>
                    <div style={{ width: '100px', height: '6px', backgroundColor: '#f0f0f0', borderRadius: '3px', marginTop: '5px' }}>
                      <div style={{ width: '70%', height: '100%', backgroundColor: '#22c55e', borderRadius: '3px' }}></div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${product.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>
                      {product.status || 'Active'}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <Link href={`/admin/products/${product._id}/edit`} className="btn-icon btn-edit">
                        <Edit2 size={22} />
                      </Link>
                      <button className="btn-icon btn-delete" onClick={() => handleDeleteClick(product)}><Trash2 size={22} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Placeholder */}
        <div style={{
          padding: '20px 25px',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '14px',
          color: 'var(--gray-text)'
        }}>
          <div>Showing 1 to {filteredProducts.length} of {filteredProducts.length} entries</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-secondary" onClick={() => showToast('No previous page', 'info')} style={{ padding: '6px 12px' }}>Previous</button>
            <button className="btn-primary" style={{ padding: '6px 12px' }}>1</button>
            <button className="btn-secondary" onClick={() => showToast('No more pages', 'info')} style={{ padding: '6px 12px' }}>Next</button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <div className="modal-header" style={{ borderBottom: 'none', padding: '20px 25px 10px' }}>
              <h3 style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Trash2 size={22} />
                Delete Product
              </h3>
              <button onClick={() => setShowDeleteModal(false)} style={{ background: 'none', color: 'var(--gray-text)' }}><X size={20} /></button>
            </div>
            <div className="modal-body" style={{ padding: '10px 25px 20px' }}>
              <p style={{ fontSize: '14px', lineHeight: '1.5', color: 'var(--dark-text)' }}>
                Are you sure you want to delete the product <strong>"{productToDelete?.name}"</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="modal-footer" style={{ borderTop: 'none', padding: '10px 25px 20px' }}>
              <button className="btn-secondary" onClick={() => setShowDeleteModal(false)} disabled={deleting}>Cancel</button>
              <button 
                className="btn-primary" 
                onClick={confirmDelete} 
                disabled={deleting}
                style={{ backgroundColor: '#ef4444', borderColor: '#ef4444', color: '#fff' }}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
