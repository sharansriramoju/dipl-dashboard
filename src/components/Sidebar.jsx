import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Typography, Divider, Chip,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const DRAWER_WIDTH = 240;

const NAV_ITEMS = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { label: 'Products', icon: <InventoryIcon />, path: '/products' },
  { label: 'Upload Data', icon: <CloudUploadIcon />, path: '/upload' },
  { label: 'Job History', icon: <WorkHistoryIcon />, path: '/jobs' },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          background: 'linear-gradient(180deg, #0d0d1f 0%, #0a0a14 100%)',
          borderRight: '1px solid rgba(99,102,241,0.15)',
        },
      }}
    >
      {/* Logo */}
      <Box sx={{ px: 3, py: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 36, height: 36, borderRadius: 2,
            background: 'linear-gradient(135deg, #6366f1, #22d3ee)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <AutoAwesomeIcon sx={{ fontSize: 20, color: '#fff' }} />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontSize: '1rem', lineHeight: 1.2, color: '#e2e8f0' }}>
            Analytics
          </Typography>
          <Typography variant="caption" sx={{ color: '#6366f1', fontWeight: 600 }}>
            DIPL Dashboard
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(99,102,241,0.12)', mx: 2 }} />

      <Box sx={{ px: 2, py: 2 }}>
        <Typography variant="caption" sx={{ color: '#475569', fontWeight: 700, letterSpacing: '0.1em', pl: 1 }}>
          NAVIGATION
        </Typography>
      </Box>

      <List sx={{ px: 1 }}>
        {NAV_ITEMS.map(({ label, icon, path }) => {
          const active = location.pathname === path;
          return (
            <ListItem key={path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => navigate(path)}
                sx={{
                  borderRadius: 2,
                  py: 1.2,
                  background: active ? 'rgba(99,102,241,0.15)' : 'transparent',
                  border: active ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
                  '&:hover': { background: 'rgba(99,102,241,0.08)' },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 38,
                    color: active ? '#818cf8' : '#64748b',
                  }}
                >
                  {icon}
                </ListItemIcon>
                <ListItemText
                  primary={label}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: active ? 700 : 500,
                    color: active ? '#e2e8f0' : '#94a3b8',
                  }}
                />
                {active && (
                  <Box
                    sx={{
                      width: 4, height: 24, borderRadius: 2,
                      background: 'linear-gradient(180deg, #6366f1, #22d3ee)',
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ mt: 'auto', p: 2 }}>
        <Box
          sx={{
            p: 2, borderRadius: 2,
            background: 'rgba(99,102,241,0.08)',
            border: '1px solid rgba(99,102,241,0.2)',
          }}
        >
          <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mb: 0.5 }}>
            Product Review Analytics
          </Typography>
          <Chip label="v1.0.0" size="small" sx={{ background: 'rgba(99,102,241,0.3)', color: '#a5b4fc', fontSize: '0.7rem' }} />
        </Box>
      </Box>
    </Drawer>
  );
}
