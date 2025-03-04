'use client'

// components/ServerDashboardMui.tsx
import React, { useState } from 'react';
import {
  Container,
  
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';

// Define a TypeScript interface for server data
interface Server {
  id: number;
  name: string;
  ip: string;
  status: 'Up' | 'Degraded' | 'Down' | string;
  responseTime: string;
  uptime: string;
  lastChecked: string;
}

// Example JSON data for servers
const serversData: Server[] = [
  {
    id: 1,
    name: " Open AI",
    ip: "192.168.1.101",
    status: "Up",
    responseTime: "120ms",
    uptime: "99.9%",
    lastChecked: "2025-02-26T15:30:00Z",
  },
  {
    id: 2,
    name: "Stripe",
    ip: "192.168.1.102",
    status: "Degraded",
    responseTime: "250ms",
    uptime: "95.4%",
    lastChecked: "2025-02-26T15:30:00Z",
  },
  {
    id: 3,
    name: "Pulsetic",
    ip: "192.168.1.103",
    status: "Down",
    responseTime: "N/A",
    uptime: "N/A",
    lastChecked: "2025-02-26T15:30:00Z",
  }
];

// Function to determine the color for the Chip based on server status
const getChipColor = (status: string): "default" | "success" | "warning" | "error" => {
  switch (status) {
    case "Up":
      return "success";
    case "Degraded":
      return "warning";
    case "Down":
      return "error";
    default:
      return "default";
  }
};

const ServerDashboardMui: React.FC = () => {
  // State for filter and sort
  const [filterText, setFilterText] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'status'>('name');

  // State for dialog (popup)
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);

  // Handler when a row is clicked
  const handleRowClick = (server: Server) => {
    setSelectedServer(server);
    setOpenDialog(true);
  };

  // Close dialog handler
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedServer(null);
  };

  // Apply filtering and sorting to the servers list
  const filteredServers = serversData
    .filter(server =>
      server.name.toLowerCase().includes(filterText.toLowerCase()) ||
      server.ip.includes(filterText)
    )
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'status') {
        return a.status.localeCompare(b.status);
      }
      return 0;
    });

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      

      {/* Filter and Sort Controls */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
        <TextField
          label="Filter by name or IP"
          variant="outlined"
          sx={{
            "& .MuiInputLabel-root": {
      color: "black", // default label color
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "green", // label color when focused
    },
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused fieldset": {
                borderColor: "green", // Focused state border color
              },
            },
          }}
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          fullWidth
        />
        <FormControl variant="outlined" sx={{ minWidth: 120 }}>
          <InputLabel id="sort-by-label">Sort By</InputLabel>
          <Select
            labelId="sort-by-label"
            label="Sort By"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'status')}
          >
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="status">Status</MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* Server Table */}
      <TableContainer component={Paper}>
        <Table aria-label="server status table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>IP Address</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Response Time</TableCell>
              <TableCell>Uptime</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredServers.map((server) => (
              <TableRow
                key={server.id}
                hover
                sx={{ cursor: 'pointer' }}
                onClick={() => handleRowClick(server)}
              >
                <TableCell>{server.name}</TableCell>
                <TableCell>{server.ip}</TableCell>
                <TableCell>
                  <Chip label={server.status} color={getChipColor(server.status)} />
                </TableCell>
                <TableCell>{server.responseTime}</TableCell>
                <TableCell>{server.uptime}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Server Details Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Server Details</DialogTitle>
        <DialogContent dividers>
          {selectedServer && (
            <>
              <DialogContentText><strong>Name:</strong> {selectedServer.name}</DialogContentText>
              <DialogContentText><strong>IP Address:</strong> {selectedServer.ip}</DialogContentText>
              <DialogContentText><strong>Status:</strong> {selectedServer.status}</DialogContentText>
              <DialogContentText><strong>Response Time:</strong> {selectedServer.responseTime}</DialogContentText>
              <DialogContentText><strong>Uptime:</strong> {selectedServer.uptime}</DialogContentText>
              <DialogContentText><strong>Last Checked:</strong> {new Date(selectedServer.lastChecked).toLocaleString()}</DialogContentText>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ServerDashboardMui;

