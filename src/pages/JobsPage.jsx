import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  CircularProgress,
  LinearProgress,
  Alert,
  Collapse,
  IconButton,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { fetchJobQueues } from "../store/slices/uploadSlice";

const STATUS_COLOR = {
  pending: { bg: "rgba(251,191,36,0.12)", color: "#fbbf24" },
  active: { bg: "rgba(34,211,238,0.12)", color: "#22d3ee" },
  completed: { bg: "rgba(52,211,153,0.12)", color: "#34d399" },
  failed: { bg: "rgba(248,113,113,0.12)", color: "#f87171" },
};

function JobRow({ job }) {
  const [open, setOpen] = useState(false);
  const progress = job.result?.progress;
  const state = job.result?.state || job.status;
  const sc = STATUS_COLOR[state] || STATUS_COLOR.pending;

  return (
    <>
      <TableRow sx={{ "&:hover": { background: "rgba(99,102,241,0.04)" } }}>
        <TableCell sx={{ p: 1 }}>
          <IconButton
            size="small"
            onClick={() => setOpen(!open)}
            sx={{ color: "#64748b" }}
            disabled={!progress}
          >
            {open ? (
              <KeyboardArrowUpIcon fontSize="small" />
            ) : (
              <KeyboardArrowDownIcon fontSize="small" />
            )}
          </IconButton>
        </TableCell>
        <TableCell>
          <Typography
            variant="body2"
            sx={{ fontFamily: "monospace", color: "#a5b4fc" }}
          >
            #{job.job_id}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body2" sx={{ color: "#94a3b8" }}>
            {job.file_name}
          </Typography>
        </TableCell>
        <TableCell align="center">
          <Chip
            label={state || job.status}
            size="small"
            sx={{
              bgcolor: sc.bg,
              color: sc.color,
              fontWeight: 700,
              fontSize: "0.72rem",
            }}
          />
        </TableCell>
        <TableCell align="center">
          {progress ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                justifyContent: "center",
              }}
            >
              <Box sx={{ flex: 1, maxWidth: 100 }}>
                <LinearProgress
                  variant="determinate"
                  value={progress.percent}
                />
              </Box>
              <Typography
                variant="caption"
                sx={{ color: "#6366f1", fontWeight: 700, minWidth: 32 }}
              >
                {progress.percent}%
              </Typography>
            </Box>
          ) : (
            "—"
          )}
        </TableCell>
        <TableCell>
          <Typography variant="caption" sx={{ color: "#64748b" }}>
            {new Date(job.created_at).toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </Typography>
        </TableCell>
      </TableRow>
      {progress && (
        <TableRow>
          <TableCell colSpan={6} sx={{ py: 0, border: 0 }}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box
                sx={{
                  display: "flex",
                  gap: 3,
                  px: 3,
                  py: 2,
                  background: "rgba(99,102,241,0.04)",
                  mb: 1,
                }}
              >
                {[
                  ["Total", progress.total, "#94a3b8"],
                  ["Processed", progress.processed, "#22d3ee"],
                  ["Succeeded", progress.succeeded, "#34d399"],
                  ["Failed", progress.failed, "#f87171"],
                ].map(([label, val, color]) => (
                  <Box key={label} sx={{ textAlign: "center" }}>
                    <Typography
                      variant="h6"
                      sx={{ color, fontWeight: 700, fontSize: "1.1rem" }}
                    >
                      {val}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#475569" }}>
                      {label}
                    </Typography>
                  </Box>
                ))}
                {progress.errors?.length > 0 && (
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="caption"
                      sx={{ color: "#f87171", fontWeight: 700 }}
                    >
                      Errors:
                    </Typography>
                    {progress.errors.slice(0, 3).map((e, i) => {
                      const errorText =
                        typeof e === "string"
                          ? e
                          : e?.message || e?.error || JSON.stringify(e);
                      return (
                        <Typography
                          key={i}
                          variant="caption"
                          sx={{ color: "#64748b", display: "block" }}
                        >
                          {errorText}
                        </Typography>
                      );
                    })}
                  </Box>
                )}
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export default function JobsPage() {
  const dispatch = useDispatch();
  const { jobQueues, jobCount, loading, error } = useSelector((s) => s.upload);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const load = (p, rpp) =>
    dispatch(fetchJobQueues({ page: p + 1, limit: rpp }));

  useEffect(() => {
    load(0, 10);
  }, []);

  const handlePageChange = (_, newPage) => {
    setPage(newPage);
    load(newPage, rowsPerPage);
  };
  const handleRowsChange = (e) => {
    const rpp = parseInt(e.target.value, 10);
    setRowsPerPage(rpp);
    setPage(0);
    load(0, rpp);
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ color: "#e2e8f0", mb: 0.5 }}>
          Job History
        </Typography>
        <Typography variant="body2" sx={{ color: "#64748b" }}>
          {jobCount.toLocaleString()} bulk upload jobs tracked
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "rgba(99,102,241,0.06)" }}>
                <TableCell sx={{ width: 40 }} />
                <TableCell>Job ID</TableCell>
                <TableCell>File Name</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Progress</TableCell>
                <TableCell>Created At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} sx={{ color: "#6366f1" }} />
                  </TableCell>
                </TableRow>
              ) : jobQueues.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Typography variant="body2" sx={{ color: "#475569" }}>
                      No jobs found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                jobQueues.map((job) => <JobRow key={job.job_id} job={job} />)
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={jobCount}
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsChange}
          rowsPerPageOptions={[5, 10, 25]}
          sx={{
            color: "#94a3b8",
            borderTop: "1px solid rgba(99,102,241,0.12)",
          }}
        />
      </Paper>
    </Box>
  );
}
