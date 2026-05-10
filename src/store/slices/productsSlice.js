import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProducts } from '../../api/services';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params, { rejectWithValue }) => {
    try {
      const res = await getProducts(params);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    rows: [],
    count: 0,
    loading: false,
    error: null,
    filters: {
      search: '',
      category_id: '',
      min_rating: '',
      max_rating: '',
      page: 1,
      limit: 10,
    },
  },
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters(state) {
      state.filters = { search: '', category_id: '', min_rating: '', max_rating: '', page: 1, limit: 10 };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.rows = action.payload.data.rows;
        state.count = action.payload.data.count;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, resetFilters } = productsSlice.actions;
export default productsSlice.reducer;
