import React from 'react';
import { Box, Paper, Typography, CircularProgress, Skeleton } from '@mui/material';

export default function ChartCard({ title, subtitle, children, loading, height = 300, action }) {
  return (
    <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h6" sx={{ color: '#e2e8f0', fontSize: '0.95rem' }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="caption" sx={{ color: '#475569' }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {action}
      </Box>
      <Box sx={{ flex: 1, minHeight: height, position: 'relative' }}>
        {loading ? (
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={40} sx={{ borderRadius: 1, bgcolor: 'rgba(99,102,241,0.08)' }} />
            ))}
          </Box>
        ) : (
          children
        )}
      </Box>
    </Paper>
  );
}
