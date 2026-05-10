import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Grid, Typography, TextField, Button, Paper, Autocomplete,
  Chip, InputAdornment, Stack,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import StarIcon from '@mui/icons-material/Star';
import RateReviewIcon from '@mui/icons-material/RateReview';
import CategoryIcon from '@mui/icons-material/Category';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, Legend,
} from 'recharts';

import {
  fetchProductsPerCategory,
  fetchAverageRatingPerCategory,
  fetchDiscountDistribution,
  fetchTopReviewedProducts,
  setDashboardFilters,
  resetDashboardFilters,
} from '../store/slices/dashboardSlice';
import { fetchCategories } from '../store/slices/categoriesSlice';
import ChartCard from '../components/ChartCard';
import StatCard from '../components/StatCard';

const CHART_COLORS = ['#6366f1', '#22d3ee', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#fb923c', '#4ade80', '#38bdf8', '#e879f9'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <Paper sx={{ p: 1.5, border: '1px solid rgba(99,102,241,0.3)' }}>
      <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>{label}</Typography>
      {payload.map((p, i) => (
        <Typography key={i} variant="body2" sx={{ color: p.color, fontWeight: 700 }}>
          {p.name}: {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}
        </Typography>
      ))}
    </Paper>
  );
};

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { productsPerCategory, avgRatingPerCategory, discountDistribution, topReviewed, filters, loading } = useSelector(s => s.dashboard);
  const { list: categories } = useSelector(s => s.categories);

  useEffect(() => { dispatch(fetchCategories()); }, [dispatch]);

  const fetchAllCharts = useCallback((f) => {
    const p = {
      min_rating: f.min_rating || undefined,
      max_rating: f.max_rating || undefined,
      min_rating_count: f.min_rating_count || undefined,
      max_rating_count: f.max_rating_count || undefined,
      min_actual_price: f.min_actual_price || undefined,
      max_actual_price: f.max_actual_price || undefined,
      min_discounted_price: f.min_discounted_price || undefined,
      max_discounted_price: f.max_discounted_price || undefined,
    };
    const discountParams = {
      ...p,
      ...(f.category_ids?.length ? { category_ids: JSON.stringify(f.category_ids) } : {}),
    };
    dispatch(fetchProductsPerCategory(p));
    dispatch(fetchAverageRatingPerCategory(p));
    dispatch(fetchDiscountDistribution(discountParams));
    dispatch(fetchTopReviewedProducts());
  }, [dispatch]);

  useEffect(() => { fetchAllCharts(filters); }, []);

  const handleFilter = (key, val) => dispatch(setDashboardFilters({ [key]: val }));

  const handleApply = () => fetchAllCharts(filters);

  const handleReset = () => {
    dispatch(resetDashboardFilters());
    fetchAllCharts({});
  };

  // Prepare chart data
  const categoryBarData = productsPerCategory.map(d => ({ name: d.name, Count: Number(d.count) }));
  const avgRatingData = avgRatingPerCategory.map(d => ({ name: d.name, 'Avg Rating': Number(d.average_rating).toFixed(2) }));
  const discountHistData = discountDistribution.map(d => ({ name: `${d.low}-${d.high}%`, Count: d.count }));
  const topReviewedData = (topReviewed || []).slice(0, 10).map(d => ({
    name: d.product_name.length > 30 ? d.product_name.slice(0, 30) + '…' : d.product_name,
    'Rating Count': d.rating_count,
  }));

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ color: '#e2e8f0', mb: 0.5 }}>Dashboard</Typography>
        <Typography variant="body2" sx={{ color: '#64748b' }}>
          Product ratings & review analytics overview
        </Typography>
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={<CategoryIcon />} label="Categories" value={productsPerCategory.length} color="#6366f1" loading={loading.productsPerCategory} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={<RateReviewIcon />} label="Top Reviewed" value={topReviewed.length} color="#22d3ee" loading={loading.topReviewed} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={<StarIcon />} label="Discount Buckets" value={discountDistribution.length} color="#fbbf24" loading={loading.discountDistribution} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard icon={<TrendingUpIcon />} label="Total Products/Cat" value={productsPerCategory.reduce((a, c) => a + Number(c.count), 0).toLocaleString()} color="#34d399" loading={loading.productsPerCategory} />
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
          <FilterListIcon sx={{ color: '#6366f1', fontSize: 20 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#94a3b8' }}>
            CHART FILTERS
          </Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <TextField size="small" fullWidth label="Min Rating" type="number" value={filters.min_rating}
              onChange={e => handleFilter('min_rating', e.target.value)}
              inputProps={{ min: 0, max: 5, step: 0.1 }} />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField size="small" fullWidth label="Max Rating" type="number" value={filters.max_rating}
              onChange={e => handleFilter('max_rating', e.target.value)}
              inputProps={{ min: 0, max: 5, step: 0.1 }} />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField size="small" fullWidth label="Min Rating Count" type="number" value={filters.min_rating_count}
              onChange={e => handleFilter('min_rating_count', e.target.value)} />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField size="small" fullWidth label="Max Rating Count" type="number" value={filters.max_rating_count}
              onChange={e => handleFilter('max_rating_count', e.target.value)} />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField size="small" fullWidth label="Min Actual Price (₹)" type="number" value={filters.min_actual_price}
              onChange={e => handleFilter('min_actual_price', e.target.value)} />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField size="small" fullWidth label="Max Actual Price (₹)" type="number" value={filters.max_actual_price}
              onChange={e => handleFilter('max_actual_price', e.target.value)} />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField size="small" fullWidth label="Min Discounted Price (₹)" type="number" value={filters.min_discounted_price}
              onChange={e => handleFilter('min_discounted_price', e.target.value)} />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField size="small" fullWidth label="Max Discounted Price (₹)" type="number" value={filters.max_discounted_price}
              onChange={e => handleFilter('max_discounted_price', e.target.value)} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Autocomplete
              multiple
              size="small"
              options={categories}
              getOptionLabel={o => o.name}
              value={categories.filter(c => (filters.category_ids || []).includes(c.category_id))}
              onChange={(_, val) => handleFilter('category_ids', val.map(v => v.category_id))}
              renderTags={(val, getTagProps) =>
                val.map((option, index) => (
                  <Chip key={option.category_id} label={option.name} size="small" {...getTagProps({ index })} sx={{ bgcolor: 'rgba(99,102,241,0.2)' }} />
                ))
              }
              renderInput={(params) => <TextField {...params} label="Categories (for Discount Histogram)" />}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack direction="row" spacing={1.5}>
              <Button variant="contained" onClick={handleApply} startIcon={<FilterListIcon />}>
                Apply Filters
              </Button>
              <Button variant="outlined" onClick={handleReset} startIcon={<RestartAltIcon />} sx={{ borderColor: 'rgba(99,102,241,0.4)', color: '#94a3b8' }}>
                Reset
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Charts Grid */}
      <Grid container spacing={3}>
        {/* Products per Category */}
        <Grid item xs={12} md={6}>
          <ChartCard title="Products per Category" subtitle="Bar chart — count of products by category" loading={loading.productsPerCategory} height={320}>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={categoryBarData} margin={{ top: 5, right: 10, left: -10, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.1)" />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} angle={-35} textAnchor="end" interval={0} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="Count" radius={[4, 4, 0, 0]}>
                  {categoryBarData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>

        {/* Average Rating per Category */}
        <Grid item xs={12} md={6}>
          <ChartCard title="Category-wise Average Rating" subtitle="Bar chart — avg rating by category" loading={loading.avgRatingPerCategory} height={320}>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={avgRatingData} margin={{ top: 5, right: 10, left: -10, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.1)" />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} angle={-35} textAnchor="end" interval={0} />
                <YAxis domain={[0, 5]} tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="Avg Rating" radius={[4, 4, 0, 0]}>
                  {avgRatingData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[(i + 3) % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>

        {/* Discount Distribution Histogram */}
        <Grid item xs={12} md={6}>
          <ChartCard title="Discount Distribution" subtitle="Histogram — product count by discount % bucket" loading={loading.discountDistribution} height={300}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={discountHistData} margin={{ top: 5, right: 10, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.1)" />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="Count" fill="#fbbf24" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>

        {/* Top Reviewed Products */}
        <Grid item xs={12} md={6}>
          <ChartCard title="Top Reviewed Products" subtitle="Bar chart — products by total rating count" loading={loading.topReviewed} height={300}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topReviewedData} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.1)" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
                <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} width={130} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="Rating Count" radius={[0, 4, 4, 0]}>
                  {topReviewedData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>
      </Grid>
    </Box>
  );
}
