import api from './axiosInstance';

// ─── Products ────────────────────────────────────────────────────────────────

export const getProducts = (params = {}) => {
  // Remove undefined/empty keys
  const clean = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== null)
  );
  return api.get('/products', { params: clean });
};

// ─── Categories ──────────────────────────────────────────────────────────────

export const getCategories = (search = '') =>
  api.get('/categories', { params: search ? { search } : {} });

// ─── Bulk Upload ──────────────────────────────────────────────────────────────

export const bulkUploadProducts = (file) => {
  const form = new FormData();
  form.append('file', file);
  return api.post('/bulk-upload/products', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getLatestJobQueue = () =>
  api.get('/bulk-upload/products/latest-job-queue');

// ─── Job Queues ───────────────────────────────────────────────────────────────

export const getJobQueues = (params = {}) =>
  api.get('/job-queues', { params });

// ─── Dashboard Charts ─────────────────────────────────────────────────────────

export const getProductsPerCategory = (params = {}) => {
  const clean = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== null)
  );
  return api.get('/dashboard/products-per-category/bargraph', { params: clean });
};

export const getAverageRatingPerCategory = (params = {}) => {
  const clean = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== null)
  );
  return api.get('/dashboard/average-rating-per-category/bargraph', { params: clean });
};

export const getDiscountDistribution = (params = {}) => {
  const clean = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== null)
  );
  return api.get('/dashboard/discount-percentage-distribution/histogram', { params: clean });
};

export const getTopReviewedProducts = () =>
  api.get('/dashboard/top-reviewed-products');
