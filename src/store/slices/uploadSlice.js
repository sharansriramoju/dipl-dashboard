import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { bulkUploadProducts, getLatestJobQueue, getJobQueues } from '../../api/services';

export const uploadFile = createAsyncThunk(
  'upload/uploadFile',
  async (file, { rejectWithValue }) => {
    try {
      const res = await bulkUploadProducts(file);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchLatestJob = createAsyncThunk(
  'upload/fetchLatestJob',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getLatestJobQueue();
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchJobQueues = createAsyncThunk(
  'upload/fetchJobQueues',
  async (params, { rejectWithValue }) => {
    try {
      const res = await getJobQueues(params);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const uploadSlice = createSlice({
  name: 'upload',
  initialState: {
    uploading: false,
    uploadSuccess: false,
    latestJob: null,
    jobQueues: [],
    jobCount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearUploadState(state) {
      state.uploadSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadFile.pending, (s) => { s.uploading = true; s.error = null; s.uploadSuccess = false; })
      .addCase(uploadFile.fulfilled, (s) => { s.uploading = false; s.uploadSuccess = true; })
      .addCase(uploadFile.rejected, (s, a) => { s.uploading = false; s.error = a.payload; })

      .addCase(fetchLatestJob.pending, (s) => { s.loading = true; })
      .addCase(fetchLatestJob.fulfilled, (s, a) => { s.loading = false; s.latestJob = a.payload; })
      .addCase(fetchLatestJob.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(fetchJobQueues.pending, (s) => { s.loading = true; })
      .addCase(fetchJobQueues.fulfilled, (s, a) => { s.loading = false; s.jobQueues = a.payload.rows; s.jobCount = a.payload.count; })
      .addCase(fetchJobQueues.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
  },
});

export const { clearUploadState } = uploadSlice.actions;
export default uploadSlice.reducer;
