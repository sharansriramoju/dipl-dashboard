import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Typography, Paper, TextField, Button, Grid, Chip, Stack,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, IconButton, Collapse, Autocomplete, CircularProgress,
  Rating, Alert, InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { fetchProducts, setFilters, resetFilters } from '../store/slices/productsSlice';
import { fetchCategories } from '../store/slices/categoriesSlice';

function ReviewRow({ review }) {
  return (
    <Box sx={{ py: 1, borderBottom: '1px solid rgba(99,102,241,0.08)', '&:last-child': { borderBottom: 0 } }}>
      <Typography variant="caption" sx={{ color: '#6366f1', fontWeight: 700 }}>
        {review.user_name}
      </Typography>
      <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', fontWeight: 600 }}>
        {review.review_title}
      </Typography>
      <Typography variant="caption" sx={{ color: '#64748b' }}>
        {review.review_content}
      </Typography>
    </Box>
  );
}

function ProductRow({ row }) {
  const [open, setOpen] = useState(false);
  const discount = Math.round(Number(row.discount_percentage) * 100);

  return (
    <>
      <TableRow
        sx={{
          '&:hover': { background: 'rgba(99,102,241,0.04)' },
          transition: 'background 0.15s',
        }}
      >
        <TableCell sx={{ p: 1 }}>
          <IconButton size="small" onClick={() => setOpen(!open)} sx={{ color: '#64748b' }}>
            {open ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
          </IconButton>
        </TableCell>
        <TableCell>
          <Typography variant="body2" sx={{ color: '#e2e8f0', fontWeight: 500, maxWidth: 280 }} noWrap title={row.product_name}>
            {row.product_name}
          </Typography>
          <Typography variant="caption" sx={{ color: '#475569', fontFamily: 'monospace' }}>
            {row.product_id}
          </Typography>
        </TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxWidth: 200 }}>
            {(row.categories || []).slice(0, 2).map(c => (
              <Chip key={c.category_id} label={c.name} size="small"
                sx={{ bgcolor: 'rgba(99,102,241,0.15)', color: '#a5b4fc', fontSize: '0.65rem', height: 20 }} />
            ))}
            {row.categories?.length > 2 && (
              <Chip label={`+${row.categories.length - 2}`} size="small"
                sx={{ bgcolor: 'rgba(99,102,241,0.08)', color: '#64748b', fontSize: '0.65rem', height: 20 }} />
            )}
          </Box>
        </TableCell>
        <TableCell align="right">
          <Typography variant="body2" sx={{ color: '#e2e8f0', fontWeight: 600 }}>
            ₹{Number(row.discounted_price).toLocaleString()}
          </Typography>
          <Typography variant="caption" sx={{ color: '#475569', textDecoration: 'line-through' }}>
            ₹{Number(row.actual_price).toLocaleString()}
          </Typography>
        </TableCell>
        <TableCell align="center">
          <Chip
            label={`${discount}% off`}
            size="small"
            sx={{
              bgcolor: discount >= 50 ? 'rgba(52,211,153,0.15)' : 'rgba(251,191,36,0.12)',
              color: discount >= 50 ? '#34d399' : '#fbbf24',
              fontWeight: 700, fontSize: '0.72rem',
            }}
          />
        </TableCell>
        <TableCell align="center">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'center' }}>
            <Rating value={Number(row.rating)} precision={0.1} size="small" readOnly />
            <Typography variant="caption" sx={{ color: '#94a3b8' }}>{row.rating}</Typography>
          </Box>
          <Typography variant="caption" sx={{ color: '#475569' }}>
            {Number(row.rating_count).toLocaleString()} reviews
          </Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={6} sx={{ py: 0, border: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ p: 2, background: 'rgba(99,102,241,0.04)', borderRadius: 2, mb: 1 }}>
              <Box sx={{ display: 'flex', gap: 1, mb: 1.5, alignItems: 'center' }}>
                <RateReviewIcon sx={{ fontSize: 16, color: '#6366f1' }} />
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Reviews ({row.reviews?.length || 0})
                </Typography>
              </Box>
              {row.reviews?.length > 0 ? (
                <Grid container spacing={2}>
                  {row.reviews.map(r => (
                    <Grid item xs={12} sm={6} md={4} key={r.review_id}>
                      <ReviewRow review={r} />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography variant="caption" sx={{ color: '#475569' }}>No reviews available</Typography>
              )}
              {row.description && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Description
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mt: 0.5, lineHeight: 1.7 }}>
                    {row.description.split('|').map((line, i) => <span key={i}>{line}<br /></span>)}
                  </Typography>
                </Box>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function ProductsPage() {
  const dispatch = useDispatch();
  const { rows, count, loading, error, filters } = useSelector(s => s.products);
  const { list: categories } = useSelector(s => s.categories);

  const load = useCallback((f) => {
    dispatch(fetchProducts(f));
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchCategories());
    load(filters);
  }, []);

  const handleChange = (key, val) => dispatch(setFilters({ [key]: val }));

  const handleSearch = () => load({ ...filters, page: 1 });

  const handleReset = () => {
    dispatch(resetFilters());
    load({ search: '', category_id: '', min_rating: '', max_rating: '', page: 1, limit: 10 });
  };

  const handlePageChange = (_, newPage) => {
    const updated = { ...filters, page: newPage + 1 };
    dispatch(setFilters(updated));
    load(updated);
  };

  const handleRowsPerPageChange = (e) => {
    const updated = { ...filters, limit: parseInt(e.target.value, 10), page: 1 };
    dispatch(setFilters(updated));
    load(updated);
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ color: '#e2e8f0', mb: 0.5 }}>Products</Typography>
        <Typography variant="body2" sx={{ color: '#64748b' }}>
          {count.toLocaleString()} products found
        </Typography>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
          <FilterListIcon sx={{ color: '#6366f1', fontSize: 20 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#94a3b8' }}>FILTERS</Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth size="small" label="Search by product name"
              value={filters.search}
              onChange={e => handleChange('search', e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#64748b', fontSize: 18 }} /></InputAdornment>,
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Autocomplete
              size="small"
              options={categories}
              getOptionLabel={o => o.name}
              value={categories.find(c => c.category_id === filters.category_id) || null}
              onChange={(_, val) => handleChange('category_id', val?.category_id || '')}
              renderInput={(params) => <TextField {...params} label="Category" />}
            />
          </Grid>
          <Grid item xs={6} md={2}>
            <TextField size="small" fullWidth label="Min Rating" type="number"
              value={filters.min_rating}
              onChange={e => handleChange('min_rating', e.target.value)}
              inputProps={{ min: 0, max: 5, step: 0.1 }} />
          </Grid>
          <Grid item xs={6} md={2}>
            <TextField size="small" fullWidth label="Max Rating" type="number"
              value={filters.max_rating}
              onChange={e => handleChange('max_rating', e.target.value)}
              inputProps={{ min: 0, max: 5, step: 0.1 }} />
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" spacing={1.5}>
              <Button variant="contained" onClick={handleSearch} startIcon={<SearchIcon />}>
                Search
              </Button>
              <Button variant="outlined" onClick={handleReset} startIcon={<RestartAltIcon />}
                sx={{ borderColor: 'rgba(99,102,241,0.4)', color: '#94a3b8' }}>
                Reset
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Table */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Paper>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'rgba(99,102,241,0.06)' }}>
                <TableCell sx={{ width: 40 }} />
                <TableCell>Product</TableCell>
                <TableCell>Categories</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="center">Discount</TableCell>
                <TableCell align="center">Rating</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: '#6366f1' }} />
                  </TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Typography variant="body2" sx={{ color: '#475569' }}>No products found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                rows.map(row => <ProductRow key={row.product_id} row={row} />)
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={count}
          page={(filters.page || 1) - 1}
          onPageChange={handlePageChange}
          rowsPerPage={filters.limit || 10}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 25, 50]}
          sx={{ color: '#94a3b8', borderTop: '1px solid rgba(99,102,241,0.12)' }}
        />
      </Paper>
    </Box>
  );
}
