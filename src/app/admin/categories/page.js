'use client';

import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X } from 'lucide-react';
import { API_URLS } from '@/utils/api';
import { useToast } from '@/context/ToastContext';

export default function Categories() {
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(API_URLS.CATEGORIES);
      const data = await response.json();
      setCategories(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const [newCategoryName, setNewCategoryName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [categoryImage, setCategoryImage] = useState('');
  const [status, setStatus] = useState('Active');

  const filteredCategories = Array.isArray(categories) ? categories.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const handleSaveCategory = async () => {
    if (!newCategoryName.trim()) {
      showToast('Please enter a category name', 'warning');
      return;
    }
    
    setSaving(true);
    const categoryData = {
      name: newCategoryName,
      image: categoryImage,
      status: status
    };

    try {
      let response;
      if (isEditing) {
        response = await fetch(`${API_URLS.CATEGORIES}/${currentCategory._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(categoryData),
        });
      } else {
        response = await fetch(API_URLS.CATEGORIES, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(categoryData),
        });
      }

      if (response.ok) {
        showToast(`Category ${isEditing ? 'updated' : 'added'} successfully!`, 'success');
        fetchCategories();
        resetForm();
        setShowModal(false);
      } else {
        const errorData = await response.json();
        showToast(errorData.message || 'Failed to save category', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('Network error: Could not connect to the server.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (cat) => {
    setCurrentCategory(cat);
    setNewCategoryName(cat.name);
    setCategoryImage(cat.image || '');
    setStatus(cat.status || 'Active');
    setIsEditing(true);
    setShowModal(true);
  };

  const resetForm = () => {
    setNewCategoryName('');
    setCategoryImage('');
    setStatus('Active');
    setIsEditing(false);
    setCurrentCategory(null);
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const response = await fetch(API_URLS.UPLOAD, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setCategoryImage(`${API_URLS.BASE}${data.image}`);
        showToast('Image uploaded successfully!', 'success');
      } else {
        showToast(data.message || 'Image upload failed', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('Network error: Could not upload image.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteClick = (cat) => {
    setCategoryToDelete(cat);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    setSaving(true);
    try {
      const response = await fetch(`${API_URLS.CATEGORIES}/${categoryToDelete._id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        showToast('Category deleted successfully!', 'success');
        fetchCategories();
        setShowDeleteModal(false);
        setCategoryToDelete(null);
      } else {
        const errorData = await response.json();
        showToast(errorData.message || 'Failed to delete category', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('Network error: Could not connect to the server.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="categories-wrapper">
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
              placeholder="Search categories..." 
              className="form-control"
              style={{ paddingLeft: '40px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <button className="btn-primary" onClick={() => { resetForm(); setShowModal(true); }} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} />
          Add Category
        </button>
      </div>

      {/* Categories Table */}
      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Category Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={{ textAlign: 'center', padding: '50px' }}>Loading categories...</td></tr>
            ) : filteredCategories.length === 0 ? (
              <tr><td colSpan="4" style={{ textAlign: 'center', padding: '50px' }}>No categories found</td></tr>
            ) : filteredCategories.map((cat) => (
              <tr key={cat._id}>
                <td>
                  <div style={{ width: '50px', height: '50px', backgroundColor: '#f0f0f0', borderRadius: '8px', overflow: 'hidden' }}>
                    {cat.image ? (
                      <img src={cat.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', fontSize: '10px' }}>IMG</div>
                    )}
                  </div>
                </td>
                <td style={{ fontWeight: '600' }}>{cat.name}</td>
                <td>
                  <span className={`badge ${cat.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>
                    {cat.status}
                  </span>
                </td>
                <td>
                  <div className="action-btns">
                    <button className="btn-icon btn-edit" onClick={() => handleEdit(cat)}><Edit2 size={22} /></button>
                    <button className="btn-icon btn-delete" onClick={() => handleDeleteClick(cat)}><Trash2 size={22} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Category Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{isEditing ? 'Edit Category' : 'Add New Category'}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', color: 'var(--gray-text)' }}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Category Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Enter category name" 
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Category Image</label>
                <input 
                  type="file" 
                  id="image-file" 
                  style={{ display: 'none' }} 
                  onChange={uploadFileHandler} 
                />
                <div 
                  onClick={() => document.getElementById('image-file').click()}
                  style={{ 
                    border: '2px dashed var(--border-color)', 
                    padding: '20px', 
                    borderRadius: '8px', 
                    textAlign: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                    minHeight: '120px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    overflow: 'hidden'
                  }}
                >
                  {categoryImage ? (
                    <img src={categoryImage} alt="Preview" style={{ width: '100%', height: '100%', position: 'absolute', objectFit: 'cover', opacity: '0.3' }} />
                  ) : null}
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    {uploading ? (
                      <p>Uploading...</p>
                    ) : (
                      <>
                        <p style={{ fontSize: '13px', fontWeight: '600' }}>{categoryImage ? 'Click to Change Image' : 'Click to upload or drag and drop'}</p>
                        <p style={{ fontSize: '11px', color: '#999' }}>PNG, JPG up to 5MB</p>
                      </>
                    )}
                  </div>
                </div>
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
              <button className="btn-primary" onClick={handleSaveCategory} disabled={saving}>
                {saving ? 'Saving...' : (isEditing ? 'Update Category' : 'Save Category')}
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
                Delete Category
              </h3>
              <button onClick={() => setShowDeleteModal(false)} style={{ background: 'none', color: 'var(--gray-text)' }}><X size={20} /></button>
            </div>
            <div className="modal-body" style={{ padding: '10px 25px 20px' }}>
              <p style={{ fontSize: '14px', lineHeight: '1.5', color: 'var(--dark-text)' }}>
                Are you sure you want to delete the category <strong>"{categoryToDelete?.name}"</strong>? This action cannot be undone.
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
