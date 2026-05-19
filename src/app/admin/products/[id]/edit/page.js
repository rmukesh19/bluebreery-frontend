'use client';

import React, { useState, useEffect, use } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, Plus, Trash2, Upload, X, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { API_URLS } from '@/utils/api';
import { useToast } from '@/context/ToastContext';
import RichTextEditor from '@/components/RichTextEditor';

export default function EditProductPage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  // Form State
  const [productData, setProductData] = useState({
    name: '',
    sku: '',
    mrp: '',
    salePrice: '',
    discount: '',
    category: '',
    subcategory: '',
    bestSelling: '',
    newArrivals: '',
    weight: '',
    priority: 'Normal',
    description: '',
    sizeChartImage: ''
  });

  const [variants, setVariants] = useState([]);
  const [uploading, setUploading] = useState({ sizeChart: false, variant: null });

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(API_URLS.CATEGORIES);
      const data = await response.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchSubcategories = async () => {
    try {
      const response = await fetch(API_URLS.SUBCATEGORIES);
      const data = await response.json();
      setSubcategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URLS.PRODUCTS}/${id}`);
      if (response.ok) {
        const data = await response.json();
        setProductData({
          name: data.name || '',
          sku: data.sku || data.slug || '',
          mrp: data.oldPrice || data.mrp || '',
          salePrice: data.price || data.salePrice || '',
          discount: data.discount || '',
          category: data.category || '',
          subcategory: data.subcategory || '',
          bestSelling: data.bestSelling || 'No',
          newArrivals: data.newArrivals || 'No',
          weight: data.weight || '',
          priority: data.priority || 'Normal',
          description: data.description || '',
          sizeChartImage: data.sizeChartImage || ''
        });
        setVariants(Array.isArray(data.variants) ? data.variants : []);
      } else {
        showToast('Failed to load product data', 'error');
      }
    } catch (error) {
      console.error('Error loading product details:', error);
      showToast('Error loading product details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData(prev => {
      const updated = { ...prev, [name]: value };
      
      // Auto-calculate discount if MRP and Sale Price change
      if (name === 'mrp' || name === 'salePrice') {
        const mrp = name === 'mrp' ? parseFloat(value) : parseFloat(prev.mrp);
        const sale = name === 'salePrice' ? parseFloat(value) : parseFloat(prev.salePrice);
        if (mrp && sale && mrp > sale) {
          updated.discount = Math.round(((mrp - sale) / mrp) * 100);
        }
      }
      
      return updated;
    });
  };

  const handleDescriptionChange = (content) => {
    setProductData(prev => ({ ...prev, description: content }));
  };

  const handleFileUpload = async (e, type, variantIndex = null) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    if (type === 'sizeChart') setUploading({ ...uploading, sizeChart: true });
    else setUploading({ ...uploading, variant: variantIndex });

    try {
      const response = await fetch(API_URLS.UPLOAD, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        showToast(data.message || 'Image upload failed', 'error');
        return;
      }

      const imageUrl = `${API_URLS.BASE}${data.image}`;

      if (type === 'sizeChart') {
        setProductData(prev => ({ ...prev, sizeChartImage: imageUrl }));
        showToast('Size chart image uploaded successfully!', 'success');
      } else if (variantIndex !== null) {
        const updatedVariants = [...variants];
        updatedVariants[variantIndex].images = [...(updatedVariants[variantIndex].images || []), imageUrl];
        setVariants(updatedVariants);
        showToast('Variant image uploaded successfully!', 'success');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      showToast('Network error: Could not upload image.', 'error');
    } finally {
      setUploading({ sizeChart: false, variant: null });
    }
  };

  const addVariant = () => {
    setVariants([...variants, { color: '', images: [], sizes: [{ size: '', stock: '' }] }]);
  };

  const removeVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const addSizeToVariant = (vIndex) => {
    const updatedVariants = [...variants];
    updatedVariants[vIndex].sizes.push({ size: '', stock: '' });
    setVariants(updatedVariants);
  };

  const handleSaveProduct = async () => {
    if (!productData.name || !productData.salePrice || !productData.category) {
      showToast('Please fill in all required fields (Name, Sale Price, Category)', 'warning');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...productData,
        price: productData.salePrice,
        oldPrice: productData.mrp,
        brand: 'Beyoung',
        slug: productData.sku || productData.name.toLowerCase().replace(/ /g, '-'),
        images: variants.length > 0 && variants[0].images?.length > 0 ? variants[0].images : (productData.images || []),
        variants: variants
      };

      const response = await fetch(`${API_URLS.PRODUCTS}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        showToast('Product updated successfully!', 'success');
        router.push('/admin/products');
      } else {
        const errorData = await response.json();
        showToast(errorData.message || 'Failed to update product', 'error');
      }
    } catch (error) {
      console.error('Update failed:', error);
      showToast('Network error. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="admin-content" style={{ padding: '40px', textAlign: 'center', fontSize: '16px', fontWeight: '600' }}>Loading Product Details...</div>;
  }

  return (
    <div className="add-product-container">
      {/* Page Header */}
      <div className="page-header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '25px',
        background: '#fff',
        padding: '15px 25px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Link href="/admin/products" className="btn-secondary" style={{ padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }}>
            <ArrowLeft size={18} />
          </Link>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0A2342', margin: 0 }}>Edit Product: <span style={{ color: 'var(--primary-color)' }}>{productData.name}</span></h2>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link href="/admin/products" className="btn-secondary" style={{ padding: '8px 20px', borderRadius: '4px', fontSize: '13px' }}>
            Cancel
          </Link>
        </div>
      </div>

      <div className="admin-card" style={{ padding: '30px', marginBottom: '30px' }}>
        <div className="form-grid">
          {/* Row 1: Name & SKU */}
          <div className="form-row">
            <div className="form-group flex-1">
              <label>Product Name <span className="required">*</span></label>
              <input 
                type="text" 
                name="name"
                className="form-control" 
                placeholder="Enter product name" 
                value={productData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group flex-1">
              <label>SKU / Slug <span className="required">*</span></label>
              <input 
                type="text" 
                name="sku"
                className="form-control" 
                placeholder="Enter SKU" 
                value={productData.sku}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Row 2: MRP, Sale Price, Discount */}
          <div className="form-row">
            <div className="form-group flex-1">
              <label>MRP <span className="required">*</span></label>
              <input 
                type="number" 
                name="mrp"
                className="form-control" 
                placeholder="0.00" 
                value={productData.mrp}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group flex-1">
              <label>Sale Price <span className="required">*</span></label>
              <input 
                type="number" 
                name="salePrice"
                className="form-control" 
                placeholder="0.00" 
                value={productData.salePrice}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group flex-1">
              <label>Discount (%) <span className="required">*</span></label>
              <input 
                type="number" 
                name="discount"
                className="form-control" 
                placeholder="0" 
                value={productData.discount}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Row 3: Category & Subcategory */}
          <div className="form-row">
            <div className="form-group flex-1">
              <label>Category <span className="required">*</span></label>
              <select 
                name="category"
                className="form-control"
                value={productData.category}
                onChange={handleInputChange}
              >
                <option value="">Select Category</option>
                {Array.isArray(categories) && categories.map(cat => (
                  <option key={cat._id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group flex-1">
              <label>Subcategory <span className="required">*</span></label>
              <select 
                name="subcategory"
                className="form-control"
                value={productData.subcategory}
                onChange={handleInputChange}
                disabled={!productData.category}
              >
                <option value="">Select Subcategory</option>
                {Array.isArray(subcategories) && subcategories
                  .filter(sub => sub.category === productData.category)
                  .map(sub => (
                    <option key={sub._id} value={sub.name}>{sub.name}</option>
                  ))
                }
              </select>
            </div>
          </div>

          {/* Row 4: Best Selling & New Arrivals */}
          <div className="form-row">
            <div className="form-group flex-1">
              <label>Best Selling <span className="required">*</span></label>
              <select 
                name="bestSelling"
                className="form-control"
                value={productData.bestSelling}
                onChange={handleInputChange}
              >
                <option value="">Select Option</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            <div className="form-group flex-1">
              <label>New Arrivals <span className="required">*</span></label>
              <select 
                name="newArrivals"
                className="form-control"
                value={productData.newArrivals}
                onChange={handleInputChange}
              >
                <option value="">Select Option</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>

          {/* Row 5: Weight & Priority */}
          <div className="form-row">
            <div className="form-group flex-1">
              <label>Product Weight <span className="required">*</span></label>
              <input 
                type="text" 
                name="weight"
                className="form-control" 
                placeholder="e.g. 500g" 
                value={productData.weight}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group flex-1">
              <label>Priority</label>
              <input 
                type="text" 
                name="priority"
                className="form-control" 
                placeholder="Normal" 
                value={productData.priority}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Row 6: Size Chart */}
          <div className="form-group">
            <label>Size Chart Image</label>
            <div className="file-upload-wrapper">
              <input 
                type="file" 
                id="size-chart-upload" 
                onChange={(e) => handleFileUpload(e, 'sizeChart')}
                hidden
              />
              <div className="file-upload-box" onClick={() => document.getElementById('size-chart-upload').click()}>
                <span className="file-name">{productData.sizeChartImage ? 'Change Image' : 'Choose file'}</span>
                <span className="file-status">{productData.sizeChartImage ? 'File chosen' : 'No file chosen'}</span>
              </div>
              {productData.sizeChartImage && (
                <div style={{ marginTop: '10px' }}>
                  <img src={productData.sizeChartImage} alt="Size Chart" style={{ height: '80px', borderRadius: '4px' }} />
                </div>
              )}
            </div>
          </div>

          {/* Row 7: Description */}
          <div className="form-group">
            <label>Description <span className="required">*</span></label>
            <RichTextEditor 
              value={productData.description}
              onChange={handleDescriptionChange}
              placeholder="Enter detailed product description here..."
            />
          </div>
        </div>
      </div>

      {/* Variants Section */}
      <div className="variants-section" style={{ marginBottom: '40px' }}>
        <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '20px', color: '#0A2342', letterSpacing: '0.5px' }}>Product Variants (Color, Images, Sizes, Stocks)</h4>
        
        {variants.map((variant, vIndex) => (
          <div key={vIndex} className="variant-card-premium" style={{ 
            background: '#fff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            padding: '24px',
            marginBottom: '24px',
            transition: 'all 0.3s ease'
          }}>
            {/* Header: Color Indicator & Delete button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '15px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ 
                  width: '16px', 
                  height: '16px', 
                  borderRadius: '50%', 
                  background: variant.color ? variant.color.toLowerCase() : '#e2e8f0', 
                  border: '1px solid #cbd5e1', 
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)' 
                }}></div>
                <span style={{ fontSize: '15px', fontWeight: '700', color: '#0A2342' }}>Variant #{vIndex + 1}: <span style={{ color: '#1B769A' }}>{variant.color || 'Unnamed Color'}</span></span>
              </div>
              <button 
                onClick={() => removeVariant(vIndex)} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  border: 'none', 
                  background: 'rgba(239, 68, 68, 0.08)', 
                  padding: '6px 14px', 
                  borderRadius: '6px', 
                  cursor: 'pointer', 
                  color: '#ef4444', 
                  fontSize: '13px', 
                  fontWeight: '700', 
                  transition: 'all 0.2s' 
                }}
              >
                <Trash2 size={16} />
                Remove Variant
              </button>
            </div>

            {/* Split layout: 1fr for Color/Images vs 1.2fr for Sizes/Stocks */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '30px' }}>
              {/* Left Column: Color Name and Images Gallery */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#4b5563', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Color Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={variant.color} 
                    onChange={(e) => {
                      const updated = [...variants];
                      updated[vIndex].color = e.target.value;
                      setVariants(updated);
                    }}
                    placeholder="e.g. Midnight Blue" 
                    style={{
                      border: '1.5px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '12px 14px',
                      width: '100%',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.2s',
                      background: '#fff'
                    }}
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#4b5563', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Variant Images ({variant.images?.length || 0})</label>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', background: '#f8fafc', padding: '15px', borderRadius: '10px', border: '1.5px solid #f1f5f9' }}>
                    {Array.isArray(variant.images) && variant.images.map((img, iIndex) => (
                      <div key={iIndex} style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                        <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button 
                          onClick={() => {
                            const updated = [...variants];
                            updated[vIndex].images = updated[vIndex].images.filter((_, i) => i !== iIndex);
                            setVariants(updated);
                          }}
                          style={{ 
                            position: 'absolute', 
                            top: '4px', 
                            right: '4px', 
                            background: 'rgba(255, 255, 255, 0.9)', 
                            borderRadius: '50%', 
                            border: 'none', 
                            padding: '4px', 
                            cursor: 'pointer', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            boxShadow: '0 1px 4px rgba(0,0,0,0.15)' 
                          }}
                        >
                          <X size={10} color="#ef4444" strokeWidth={3} />
                        </button>
                      </div>
                    ))}
                    
                    <div 
                      className="add-image-box" 
                      onClick={() => document.getElementById(`variant-upload-${vIndex}`).click()}
                      style={{
                        width: '80px',
                        height: '80px',
                        border: '2px dashed #cbd5e1',
                        borderRadius: '8px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#64748b',
                        background: '#fff',
                        transition: 'all 0.2s',
                        gap: '4px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                      }}
                    >
                      <Plus size={20} />
                      <span style={{ fontSize: '10px', fontWeight: '700' }}>Add Photo</span>
                      <input 
                        type="file" 
                        id={`variant-upload-${vIndex}`} 
                        onChange={(e) => handleFileUpload(e, 'variant', vIndex)}
                        hidden 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Sizes & Stock Entry Workspace */}
              <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '10px', border: '1.5px solid #f1f5f9', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sizes & Inventory Stocks</label>
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', background: '#e2e8f0', padding: '3px 8px', borderRadius: '20px' }}>{variant.sizes?.length || 0} Options</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '180px', overflowY: 'auto', paddingRight: '5px' }}>
                    {Array.isArray(variant.sizes) && variant.sizes.map((s, sIndex) => (
                      <div key={sIndex} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div style={{ flex: 1, display: 'flex', gap: '10px' }}>
                          <input 
                            type="text" 
                            placeholder="Size (e.g. XL)" 
                            className="form-control" 
                            value={s.size}
                            onChange={(e) => {
                              const updated = [...variants];
                              updated[vIndex].sizes[sIndex].size = e.target.value;
                              setVariants(updated);
                            }}
                            style={{
                              border: '1.5px solid #e2e8f0',
                              borderRadius: '8px',
                              padding: '10px 12px',
                              width: '100%',
                              fontSize: '14px',
                              outline: 'none',
                              background: '#fff'
                            }}
                          />
                          <input 
                            type="number" 
                            placeholder="Stock Qty" 
                            className="form-control" 
                            value={s.stock}
                            onChange={(e) => {
                              const updated = [...variants];
                              updated[vIndex].sizes[sIndex].stock = e.target.value;
                              setVariants(updated);
                            }}
                            style={{
                              border: '1.5px solid #e2e8f0',
                              borderRadius: '8px',
                              padding: '10px 12px',
                              width: '100%',
                              fontSize: '14px',
                              outline: 'none',
                              background: '#fff'
                            }}
                          />
                        </div>
                        {variant.sizes.length > 1 && (
                          <button 
                            onClick={() => {
                              const updated = [...variants];
                              updated[vIndex].sizes = updated[vIndex].sizes.filter((_, i) => i !== sIndex);
                              setVariants(updated);
                            }}
                            style={{ 
                              border: 'none', 
                              background: 'transparent', 
                              cursor: 'pointer', 
                              color: '#ef4444', 
                              padding: '6px', 
                              borderRadius: '50%', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center' 
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => addSizeToVariant(vIndex)} 
                  style={{
                    marginTop: '15px',
                    width: '100%',
                    background: '#fff',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '10px',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#0A2342',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.2s'
                  }}
                >
                  <Plus size={16} />
                  Add Size Option
                </button>
              </div>
            </div>
          </div>
        ))}

        <button 
          className="btn-primary" 
          onClick={addVariant} 
          style={{ 
            background: '#0F172A', 
            color: '#fff', 
            padding: '12px 24px', 
            borderRadius: '8px', 
            cursor: 'pointer', 
            border: 'none',
            fontWeight: '700',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)'
          }}
        >
          <Plus size={18} />
          Add New Variant
        </button>
      </div>

      {/* Final Action */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '50px' }}>
        <button 
          className="btn-primary" 
          onClick={handleSaveProduct} 
          disabled={saving}
          style={{ background: '#22c55e', color: '#fff', padding: '12px 40px', borderRadius: '4px', fontSize: '15px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Save size={18} />
          {saving ? 'Saving...' : 'Save Product'}
        </button>
      </div>

      <style jsx>{`
        .add-product-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        .form-row {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
        }
        .flex-1 { flex: 1; }
        .required { color: #ef4444; margin-left: 3px; }
        .form-group label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 8px;
          color: #4b5563;
        }
        .form-control {
          border: 1px solid #d1d5db;
          border-radius: 4px;
          padding: 10px 12px;
          width: 100%;
          font-size: 14px;
        }
        .file-upload-box {
          border: 1px solid #d1d5db;
          border-radius: 4px;
          padding: 10px 15px;
          display: flex;
          justify-content: space-between;
          cursor: pointer;
          background: #fff;
        }
        .file-name {
          background: #f3f4f6;
          padding: 4px 12px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          font-size: 12px;
          color: #374151;
        }
        .file-status { color: #9ca3af; font-size: 12px; align-self: center; }
        
        .add-image-box {
          width: 80px;
          height: 80px;
          border: 2px dashed #d1d5db;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #9ca3af;
        }
        .add-image-box:hover { border-color: var(--primary-color); color: var(--primary-color); }
        
        @media (max-width: 768px) {
          .form-row { flex-direction: column; gap: 0; }
        }
      `}</style>
    </div>
  );
}
