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

export default API_BASE_URL;

