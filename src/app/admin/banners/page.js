'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Monitor, Smartphone, ExternalLink, X, Upload } from 'lucide-react';
import { API_URLS, compressImage } from '@/utils/api';
import { useToast } from '@/context/ToastContext';

export default function Banners() {
  const { showToast } = useToast();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBannerId, setCurrentBannerId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    type: 'Desktop',
    link: '',
    image: '',
    status: 'Active'
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await fetch(API_URLS.BANNERS);
      const data = await response.json();
      setBanners(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching banners:', error);
      setBanners([]);
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      const compressedFile = await compressImage(file);
      const uploadFormData = new FormData();
      uploadFormData.append('image', compressedFile);

      const response = await fetch(API_URLS.UPLOAD, {
        method: 'POST',
        body: uploadFormData,
      });
      const data = await response.json();
      if (response.ok) {
        const imageUrl = data.image.startsWith('data:') ? data.image : `${API_URLS.BASE}${data.image}`;
        setFormData({ ...formData, image: imageUrl });
        showToast('Image uploaded successfully!', 'success');
      } else {
        showToast(data.message || 'Image upload failed', 'error');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      showToast('Network error: Could not upload image.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveBanner = async () => {
    if (!formData.title || !formData.image) {
      showToast('Please provide a title and upload an image', 'warning');
      return;
    }

    setSaving(true);
    try {
      const url = isEditing ? `${API_URLS.BANNERS}/${currentBannerId}` : API_URLS.BANNERS;
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showToast(`Banner ${isEditing ? 'updated' : 'added'} successfully!`, 'success');
        fetchBanners();
        setShowModal(false);
        resetForm();
      } else {
        const err = await response.json();
        showToast(err.message || 'Failed to save banner', 'error');
      }
    } catch (error) {
      console.error('Save failed:', error);
      showToast('Network error: Check your connection', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (banner) => {
    setBannerToDelete(banner);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!bannerToDelete) return;
    setSaving(true);
    try {
      const response = await fetch(`${API_URLS.BANNERS}/${bannerToDelete._id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        showToast('Banner deleted successfully!', 'success');
        fetchBanners();
        setShowDeleteModal(false);
        setBannerToDelete(null);
      } else {
        const errorData = await response.json();
        showToast(errorData.message || 'Failed to delete banner', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('Network error: Could not connect to the server.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (banner) => {
    setFormData({
      title: banner.title,
      type: banner.type,
      link: banner.link,
      image: banner.image,
      status: banner.status
    });
    setCurrentBannerId(banner._id);
    setIsEditing(true);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({ title: '', type: 'Desktop', link: '', image: '', status: 'Active' });
    setIsEditing(false);
    setCurrentBannerId(null);
  };

  return (
    <div className="banners-wrapper">
      <div className="page-header" style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#0A2342' }}>Homepage Banners</h2>
        <p style={{ color: '#666', fontSize: '14px' }}>Manage your high-impact marketing carousels for Desktop and Mobile.</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '30px' }}>
        <button className="btn-primary" onClick={() => { resetForm(); setShowModal(true); }} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Add New Banner
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>Loading banners...</div>
      ) : (
        <div className="banner-grid">
          {banners.map((banner) => (
            <div key={banner._id} className="banner-item">
              <div className="banner-preview">
                {banner.image ? (
                  <img src={banner.image} alt={banner.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6' }}>
                    {banner.type === 'Desktop' ? <Monitor size={32} /> : <Smartphone size={32} />}
                  </div>
                )}
                <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                  <span className={`badge ${banner.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>
                    {banner.status}
                  </span>
                </div>
                <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                   <span className="badge" style={{ backgroundColor: '#fff', color: '#000' }}>{banner.type}</span>
                </div>
              </div>
              <div className="banner-details">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ margin: '0 0 5px 0', fontSize: '15px' }}>{banner.title}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#0A2342' }}>
                      <ExternalLink size={12} /> <span>{banner.link || 'No link'}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn-icon" onClick={() => handleEdit(banner)}><Edit2 size={16} /></button>
                    <button className="btn-icon" onClick={() => handleDeleteClick(banner)} style={{ color: '#ef4444' }}><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <div className="add-banner-card" onClick={() => { resetForm(); setShowModal(true); }}>
            <Plus size={30} style={{ marginBottom: '10px', color: '#ccc' }} />
            <span style={{ fontWeight: '600', color: '#999' }}>New Banner</span>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3>{isEditing ? 'Edit Banner' : 'Add New Banner'}</h3>
              <button onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Banner Title</label>
                <input 
                  className="form-control" 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  placeholder="Summer Sale 2024"
                />
              </div>
              <div className="form-group">
                <label>Display Type</label>
                <select className="form-control" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                  <option value="Desktop">Desktop</option>
                  <option value="Mobile">Mobile</option>
                </select>
              </div>
              <div className="form-group">
                <label>Redirect Link</label>
                <input 
                  className="form-control" 
                  value={formData.link} 
                  onChange={e => setFormData({...formData, link: e.target.value})} 
                  placeholder="/category/shirts"
                />
              </div>
              <div className="form-group">
                <label>Banner Image</label>
                <div 
                  className="image-upload-zone"
                  onClick={() => document.getElementById('banner-file').click()}
                  style={{ 
                    border: '2px dashed #eee', 
                    borderRadius: '8px', 
                    height: '150px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {formData.image ? (
                    <img src={formData.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ textAlign: 'center', color: '#999' }}>
                      <Upload size={24} style={{ marginBottom: '8px' }} />
                      <p style={{ fontSize: '12px' }}>{uploading ? 'Uploading...' : 'Click to upload banner'}</p>
                    </div>
                  )}
                  <input type="file" id="banner-file" hidden onChange={handleFileUpload} />
                </div>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select className="form-control" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowModal(false)} disabled={saving}>Cancel</button>
              <button className="btn-primary" onClick={handleSaveBanner} disabled={saving || uploading}>
                {saving ? 'Saving...' : 'Save Banner'}
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
                Delete Banner
              </h3>
              <button onClick={() => setShowDeleteModal(false)} style={{ background: 'none', color: 'var(--gray-text)' }}><X size={20} /></button>
            </div>
            <div className="modal-body" style={{ padding: '10px 25px 20px' }}>
              <p style={{ fontSize: '14px', lineHeight: '1.5', color: 'var(--dark-text)' }}>
                Are you sure you want to delete the banner <strong>"{bannerToDelete?.title}"</strong>? This action cannot be undone.
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

      <style jsx>{`
        .banner-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 25px;
        }
        .banner-item {
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          transition: transform 0.2s;
        }
        .banner-item:hover { transform: translateY(-5px); }
        .banner-preview {
          height: 180px;
          position: relative;
          background: #eee;
        }
        .banner-details { padding: 20px; }
        .add-banner-card {
          border: 2px dashed #eee;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 250px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .add-banner-card:hover { border-color: #0A2342; background: #fafafa; }
        .btn-icon {
          background: #f8f9fa;
          border: none;
          padding: 8px;
          border-radius: 6px;
          cursor: pointer;
          color: #666;
        }
        .btn-icon:hover { background: #eee; color: #000; }
      `}</style>
    </div>
  );
}
