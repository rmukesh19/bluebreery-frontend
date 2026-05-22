const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== 'undefined') {
    if (!window.location.hostname.includes('localhost')) {
      return 'https://bluebreery-backend-1.onrender.com';
    }
  }
  if (process.env.NODE_ENV === 'production') {
    return 'https://bluebreery-backend-1.onrender.com';
  }
  return 'http://localhost:5001';
};

const getImagesBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_IMAGES_BASE_URL) {
    return process.env.NEXT_PUBLIC_IMAGES_BASE_URL;
  }
  return getBaseUrl();
};

export const API_BASE_URL = `${getBaseUrl()}/api`;

export const API_URLS = {
  PRODUCTS: `${API_BASE_URL}/products`,
  CATEGORIES: `${API_BASE_URL}/categories`,
  SUBCATEGORIES: `${API_BASE_URL}/subcategories`,
  BANNERS: `${API_BASE_URL}/banners`,
  UPLOAD: `${API_BASE_URL}/upload`,
  BASE: getBaseUrl()
};

export const resolveImageUrl = (url) => {
  if (!url) return '';

  // Return base64 data URIs immediately
  if (url.startsWith('data:')) {
    return url;
  }
  
  // If it is a production Render URL, it is public and fully valid. Keep it intact!
  if (url.startsWith('https://bluebreery-backend-1.onrender.com')) {
    return url;
  }
  
  // Gracefully correct file extension mismatches for local banner assets (.jpeg/.jpg -> .png)
  if (url.includes('/images/banners/')) {
    if (url.endsWith('.jpeg')) {
      url = url.replace('.jpeg', '.png');
    } else if (url.endsWith('.jpg')) {
      url = url.replace('.jpg', '.png');
    }
  }
  
  // Extract path if it contains '/uploads/' (handles localhost, custom domains, or malformed URLs)
  if (url.includes('/uploads/')) {
    const uploadPath = url.substring(url.indexOf('/uploads/'));
    return `${getImagesBaseUrl()}${uploadPath}`;
  }
  
  // Fallback for relative paths without leading slash
  if (url.startsWith('uploads/')) {
    return `${getImagesBaseUrl()}/${url}`;
  }
  
  // If it's already an external image (e.g. Unsplash), use it directly
  if (url.startsWith('http')) {
    return url;
  }
  
  return url;
};

const getCategoryFallbackImage = (catName) => {
  const name = (catName || '').toLowerCase();
  if (name.includes('shirt')) return '/product_shirt.png';
  if (name.includes('trouser') || name.includes('pant') || name.includes('cargo') || name.includes('bottom') || name.includes('jeans') || name.includes('size')) return '/product_jeans.png';
  if (name.includes('polo') || name.includes('t-shirt') || name.includes('tee')) return '/product_tshirt.png';
  return '/mens_category.png'; // Global default
};

export const handleImageError = (e, type = 'product') => {
  if (!e.target) return;
  e.target.onerror = null; // Prevent infinite loop
  const altText = e.target.alt || '';
  
  if (type === 'category') {
    e.target.src = getCategoryFallbackImage(altText);
  } else if (type === 'banner') {
    e.target.src = '/images/banners/linen-portrait.png';
  } else {
    const lowerName = altText.toLowerCase();
    if (lowerName.includes('shirt')) {
      e.target.src = '/product_shirt.png';
    } else if (lowerName.includes('pant') || lowerName.includes('jeans') || lowerName.includes('cargo') || lowerName.includes('trouser')) {
      e.target.src = '/product_jeans.png';
    } else {
      e.target.src = '/product_tshirt.png';
    }
  }
};

export const compressImage = (file, maxWidth = 1000, maxHeight = 1000, quality = 0.8) => {
  return new Promise((resolve) => {
    // If it's not a browser environment or not an image file, return the original file
    if (typeof window === 'undefined' || !file || !file.type || !file.type.startsWith('image/')) {
      return resolve(file);
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(file);
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas back to a Blob / File
        let format = file.type;
        if (format === 'image/png' || format === 'image/webp') {
          // Keep PNG/WebP for transparency if desired, or default to quality-based blob conversion
        } else {
          format = 'image/jpeg';
        }

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return resolve(file);
            }
            const compressedFile = new File([blob], file.name, {
              type: format,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          format,
          quality
        );
      };
      img.onerror = () => {
        resolve(file);
      };
    };
    reader.onerror = () => {
      resolve(file);
    };
  });
};

export default API_BASE_URL;

