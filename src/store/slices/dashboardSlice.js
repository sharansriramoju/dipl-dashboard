import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getProductsPerCategory,
  getAverageRatingPerCategory,
  getDiscountDistribution,
  getTopReviewedProducts,
} from '../../api/services';

export const fetchProductsPerCategory = createAsyncThunk(
  'dashboard/fetchProductsPerCategory',
  async (params, { rejectWithValue }) => {
    try {
      const res = await getProductsPerCategory(params);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchAverageRatingPerCategory = createAsyncThunk(
  'dashboard/fetchAverageRatingPerCategory',
  async (params, { rejectWithValue }) => {
    try {
      const res = await getAverageRatingPerCategory(params);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchDiscountDistribution = createAsyncThunk(
  'dashboard/fetchDiscountDistribution',
  async (params, { rejectWithValue }) => {
    try {
      const res = await getDiscountDistribution(params);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchTopReviewedProducts = createAsyncThunk(
  'dashboard/fetchTopReviewedProducts',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getTopReviewedProducts();
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    productsPerCategory: [],
    avgRatingPerCategory: [],
    discountDistribution: [],
    topReviewed: [],
    filters: {
      min_rating: '',
      max_rating: '',
      min_rating_count: '',
      max_rating_count: '',
      min_actual_price: '',
      max_actual_price: '',
      min_discounted_price: '',
      max_discounted_price: '',
      category_ids: [],
    },
    loading: {
      productsPerCategory: false,
      avgRatingPerCategory: false,
      discountDistribution: false,
      topReviewed: false,
    },
    error: null,
  },
  reducers: {
    setDashboardFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetDashboardFilters(state) {
      state.filters = {
        min_rating: '', max_rating: '', min_rating_count: '', max_rating_count: '',
        min_actual_price: '', max_actual_price: '', min_discounted_price: '', max_discounted_price: '',
        category_ids: [],
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsPerCategory.pending, (s) => { s.loading.productsPerCategory = true; })
      .addCase(fetchProductsPerCategory.fulfilled, (s, a) => { s.loading.productsPerCategory = false; s.productsPerCategory = a.payload; })
      .addCase(fetchProductsPerCategory.rejected, (s, a) => { s.loading.productsPerCategory = false; s.error = a.payload; })

      .addCase(fetchAverageRatingPerCategory.pending, (s) => { s.loading.avgRatingPerCategory = true; })
      .addCase(fetchAverageRatingPerCategory.fulfilled, (s, a) => { s.loading.avgRatingPerCategory = false; s.avgRatingPerCategory = a.payload; })
      .addCase(fetchAverageRatingPerCategory.rejected, (s, a) => { s.loading.avgRatingPerCategory = false; s.error = a.payload; })

      .addCase(fetchDiscountDistribution.pending, (s) => { s.loading.discountDistribution = true; })
      .addCase(fetchDiscountDistribution.fulfilled, (s, a) => { s.loading.discountDistribution = false; s.discountDistribution = a.payload; })
      .addCase(fetchDiscountDistribution.rejected, (s, a) => { s.loading.discountDistribution = false; s.error = a.payload; })

      .addCase(fetchTopReviewedProducts.pending, (s) => { s.loading.topReviewed = true; })
      .addCase(fetchTopReviewedProducts.fulfilled, (s, a) => { s.loading.topReviewed = false; s.topReviewed = a.payload; })
      .addCase(fetchTopReviewedProducts.rejected, (s, a) => { s.loading.topReviewed = false; s.error = a.payload; });
  },
});

export const { setDashboardFilters, resetDashboardFilters } = dashboardSlice.actions;
export default dashboardSlice.reducer;
