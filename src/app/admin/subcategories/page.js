'use client';

import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X } from 'lucide-react';

import { API_URLS } from '@/utils/api';
import { useToast } from '@/context/ToastContext';

export default function Subcategories() {
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [subToDelete, setSubToDelete] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newSubName, setNewSubName] = useState('');
  const [parentCat, setParentCat] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentSub, setCurrentSub] = useState(null);
  const [status, setStatus] = useState('Active');

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [subRes, catRes] = await Promise.all([
        fetch(API_URLS.SUBCATEGORIES),
        fetch(API_URLS.CATEGORIES)
      ]);
      const [subData, catData] = await Promise.all([
        subRes.json(),
        catRes.json()
      ]);
      setSubcategories(Array.isArray(subData) ? subData : []);
      setCategories(Array.isArray(catData) ? catData : []);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setSubcategories([]);
      setCategories([]);
      setLoading(false);
    }
  };

  const filteredSubcategories = Array.isArray(subcategories) ? subcategories.filter(sub => 
    sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (sub.category && sub.category.toLowerCase().includes(searchTerm.toLowerCase()))
  ) : [];

  const handleSave = async () => {
    if (!newSubName || !parentCat) {
      showToast('Please enter a subcategory name and select a parent category', 'warning');
      return;
    }
    
    setSaving(true);
    const subData = {
      name: newSubName,
      category: parentCat,
      status: status
    };

    try {
      let response;
      if (isEditing) {
        response = await fetch(`${API_URLS.SUBCATEGORIES}/${currentSub._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(subData),
        });
      } else {
        response = await fetch(API_URLS.SUBCATEGORIES, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(subData),
        });
      }

      if (response.ok) {
        showToast(`Subcategory ${isEditing ? 'updated' : 'added'} successfully!`, 'success');
        fetchData();
        setShowModal(false);
        setNewSubName('');
        setParentCat('');
        setIsEditing(false);
        setCurrentSub(null);
      } else {
        const errorData = await response.json();
        showToast(errorData.message || 'Failed to save subcategory', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('Network error: Could not connect to the server.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (sub) => {
    setCurrentSub(sub);
    setNewSubName(sub.name);
    setParentCat(sub.category);
    setStatus(sub.status || 'Active');
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDeleteClick = (sub) => {
    setSubToDelete(sub);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!subToDelete) return;
    setSaving(true);
    try {
      const response = await fetch(`${API_URLS.SUBCATEGORIES}/${subToDelete._id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        showToast('Subcategory deleted successfully!', 'success');
        fetchData();
        setShowDeleteModal(false);
        setSubToDelete(null);
      } else {
        const errorData = await response.json();
        showToast(errorData.message || 'Failed to delete subcategory', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('Network error: Could not connect to the server.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="subcategories-wrapper">
      {/* Header Actions */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
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
            placeholder="Search subcategories..." 
            className="form-control"
            style={{ paddingLeft: '40px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn-primary" onClick={() => { setIsEditing(false); setNewSubName(''); setParentCat(''); setShowModal(true); }} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} />
          Add Subcategory
        </button>
      </div>

      {/* Subcategories Table */}
      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Subcategory Name</th>
              <th>Parent Category</th>
              <th>Products Count</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubcategories.map((sub) => (
              <tr key={sub._id}>
                <td style={{ fontWeight: '600' }}>{sub.name}</td>
                <td>
                  <span style={{ 
                    padding: '4px 8px', 
                    backgroundColor: 'rgba(10, 35, 66, 0.05)', 
                    borderRadius: '4px',
                    fontSize: '13px',
                    color: 'var(--primary-color)'
                  }}>
                    {sub.category}
                  </span>
                </td>
                <td>{sub.productCount || 0} Items</td>
                <td>
                  <span className={`badge ${sub.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>
                    {sub.status}
                  </span>
                </td>
                <td>
                  <div className="action-btns">
                    <button className="btn-icon btn-edit" onClick={() => handleEdit(sub)}><Edit2 size={22} /></button>
                    <button className="btn-icon btn-delete" onClick={() => handleDeleteClick(sub)}><Trash2 size={22} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Subcategory Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{isEditing ? 'Edit Subcategory' : 'Add New Subcategory'}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', color: 'var(--gray-text)' }}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Subcategory Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Enter subcategory name" 
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Parent Category</label>
                <select className="form-control" value={parentCat} onChange={(e) => setParentCat(e.target.value)}>
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select 
                  className="form-control"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowModal(false)} disabled={saving}>Cancel</button>
              <button className="btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : (isEditing ? 'Update Subcategory' : 'Save Subcategory')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <div className="modal-header" style={{ borderBottom: 'none', padding: '20px 25px 10px' }}>
              <h3 style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Trash2 size={22} />
                Delete Subcategory
              </h3>
              <button onClick={() => setShowDeleteModal(false)} style={{ background: 'none', color: 'var(--gray-text)' }}><X size={20} /></button>
            </div>
            <div className="modal-body" style={{ padding: '10px 25px 20px' }}>
              <p style={{ fontSize: '14px', lineHeight: '1.5', color: 'var(--dark-text)' }}>
                Are you sure you want to delete the subcategory <strong>"{subToDelete?.name}"</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="modal-footer" style={{ borderTop: 'none', padding: '10px 25px 20px' }}>
              <button className="btn-secondary" onClick={() => setShowDeleteModal(false)} disabled={saving}>Cancel</button>
              <button 
                className="btn-primary" 
                onClick={confirmDelete} 
                disabled={saving}
                style={{ backgroundColor: '#ef4444', borderColor: '#ef4444', color: '#fff' }}
              >
                {saving ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
