import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './slices/productsSlice';
import categoriesReducer from './slices/categoriesSlice';
import dashboardReducer from './slices/dashboardSlice';
import uploadReducer from './slices/uploadSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    categories: categoriesReducer,
    dashboard: dashboardReducer,
    upload: uploadReducer,
  },
});
