import React from 'react';
import { Box, Paper, Typography, CircularProgress } from '@mui/material';

export default function StatCard({ icon, label, value, sub, color = '#6366f1', loading }) {
  return (
    <Paper
      sx={{
        p: 2.5,
        background: 'linear-gradient(135deg, #12121f 0%, #0f0f1e 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: 3,
          background: `linear-gradient(90deg, ${color}, transparent)`,
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        <Box
          sx={{
            width: 44, height: 44, borderRadius: 2,
            background: `${color}20`,
            border: `1px solid ${color}40`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color,
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            {label}
          </Typography>
          {loading ? (
            <CircularProgress size={20} sx={{ mt: 0.5, color }} />
          ) : (
            <Typography variant="h5" sx={{ color: '#e2e8f0', fontWeight: 700, lineHeight: 1.2, mt: 0.3 }}>
              {value ?? '—'}
            </Typography>
          )}
          {sub && (
            <Typography variant="caption" sx={{ color: '#475569' }}>
              {sub}
            </Typography>
          )}
        </Box>
      </Box>
    </Paper>
  );
}
