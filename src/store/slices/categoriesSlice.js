import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCategories } from '../../api/services';

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (search = '', { rejectWithValue }) => {
    try {
      const res = await getCategories(search);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default categoriesSlice.reducer;
