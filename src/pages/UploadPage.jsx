import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Typography, Paper, Button, LinearProgress, Alert, Chip,
  Stack, Divider, CircularProgress, Grid,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { uploadFile, fetchLatestJob, clearUploadState } from '../store/slices/uploadSlice';

const STATUS_MAP = {
  pending: { color: '#fbbf24', label: 'Pending' },
  active: { color: '#22d3ee', label: 'Processing' },
  completed: { color: '#34d399', label: 'Completed' },
  failed: { color: '#f87171', label: 'Failed' },
};

export default function UploadPage() {
  const dispatch = useDispatch();
  const { uploading, uploadSuccess, latestJob, loading, error } = useSelector(s => s.upload);
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [polling, setPolling] = useState(false);
  const pollRef = useRef(null);
  const fileInputRef = useRef(null);

  const stopPolling = useCallback(() => {
    setPolling(false);
    if (pollRef.current) clearInterval(pollRef.current);
  }, []);

  const startPolling = useCallback(() => {
    setPolling(true);
    pollRef.current = setInterval(() => {
      dispatch(fetchLatestJob());
    }, 3000);
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchLatestJob());
    return () => stopPolling();
  }, []);

  useEffect(() => {
    if (uploadSuccess) startPolling();
  }, [uploadSuccess, startPolling]);

  useEffect(() => {
    const state = latestJob?.result?.state || latestJob?.status;
    if (state === 'completed' || state === 'failed') stopPolling();
  }, [latestJob, stopPolling]);

  const handleFileChange = (file) => {
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['xlsx', 'csv'].includes(ext)) { alert('Please upload .xlsx or .csv'); return; }
    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    dispatch(clearUploadState());
    dispatch(uploadFile(selectedFile)).then(() => dispatch(fetchLatestJob()));
  };

  const progress = latestJob?.result?.progress;
  const jobState = latestJob?.result?.state || latestJob?.status;
  const statusInfo = jobState ? (STATUS_MAP[jobState] || STATUS_MAP.pending) : null;

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ color: '#e2e8f0', mb: 0.5 }}>Upload Data</Typography>
        <Typography variant="body2" sx={{ color: '#64748b' }}>Import product & review data via Excel or CSV</Typography>
      </Box>

      <Stack spacing={3} sx={{ maxWidth: 700 }}>
        {/* Drop Zone */}
        <Paper
          sx={{
            p: 5, textAlign: 'center', cursor: 'pointer',
            border: `2px dashed ${dragOver ? '#6366f1' : 'rgba(99,102,241,0.25)'}`,
            background: dragOver ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.03)',
            transition: 'all 0.2s',
            '&:hover': { borderColor: '#6366f1', background: 'rgba(99,102,241,0.06)' },
          }}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); handleFileChange(e.dataTransfer.files[0]); }}
        >
          <input ref={fileInputRef} type="file" accept=".xlsx,.csv" style={{ display: 'none' }}
            onChange={e => handleFileChange(e.target.files[0])} />
          <Box sx={{ width: 64, height: 64, borderRadius: 3, mx: 'auto', mb: 2, background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(34,211,238,0.15))', border: '1px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CloudUploadIcon sx={{ fontSize: 32, color: '#6366f1' }} />
          </Box>
          <Typography variant="h6" sx={{ color: '#e2e8f0', mb: 0.5 }}>Drop your file here</Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>or click to browse — supports .xlsx and .csv</Typography>
          {selectedFile && <Chip icon={<InsertDriveFileIcon sx={{ fontSize: 16 }} />} label={selectedFile.name} sx={{ bgcolor: 'rgba(99,102,241,0.2)', color: '#a5b4fc' }} />}
        </Paper>

        {error && <Alert severity="error">{error}</Alert>}
        {uploadSuccess && !error && <Alert severity="success">File uploaded! Processing has started.</Alert>}

        <Button variant="contained" size="large" disabled={!selectedFile || uploading} onClick={handleUpload}
          startIcon={uploading ? <CircularProgress size={16} sx={{ color: 'white' }} /> : <CloudUploadIcon />}
          sx={{ py: 1.5 }}>
          {uploading ? 'Uploading…' : 'Upload File'}
        </Button>

        {/* Job Status */}
        {(latestJob || loading) && (
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Latest Upload Job
              </Typography>
              {polling && <Chip label="Live" size="small" sx={{ bgcolor: 'rgba(34,211,238,0.1)', color: '#22d3ee', fontSize: '0.7rem' }} />}
            </Box>

            {loading && !latestJob ? <CircularProgress size={24} sx={{ color: '#6366f1' }} /> : latestJob ? (
              <>
                <Stack spacing={1.5}>
                  {[
                    { label: 'File', value: latestJob.file_name },
                    { label: 'Job ID', value: `#${latestJob.job_id}` },
                  ].map(({ label, value }) => (
                    <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>{label}</Typography>
                      <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>{value}</Typography>
                    </Box>
                  ))}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>Status</Typography>
                    {statusInfo && <Chip label={statusInfo.label} size="small" sx={{ bgcolor: `${statusInfo.color}18`, color: statusInfo.color, fontWeight: 700, fontSize: '0.72rem' }} />}
                  </Box>
                </Stack>

                {progress && (
                  <>
                    <Divider sx={{ my: 2, borderColor: 'rgba(99,102,241,0.12)' }} />
                    <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>Progress</Typography>
                      <Typography variant="caption" sx={{ color: '#6366f1', fontWeight: 700 }}>{progress.percent}%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={progress.percent} />
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      {[['Total', progress.total, '#94a3b8'], ['Processed', progress.processed, '#22d3ee'], ['Succeeded', progress.succeeded, '#34d399'], ['Failed', progress.failed, '#f87171']].map(([label, value, color]) => (
                        <Grid key={label} item xs={3} sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" sx={{ color, fontWeight: 700, fontSize: '1.1rem' }}>{value}</Typography>
                          <Typography variant="caption" sx={{ color: '#475569' }}>{label}</Typography>
                        </Grid>
                      ))}
                    </Grid>
                  </>
                )}
              </>
            ) : null}
          </Paper>
        )}
      </Stack>
    </Box>
  );
}
