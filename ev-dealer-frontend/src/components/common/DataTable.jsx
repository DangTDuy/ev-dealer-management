import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  InputAdornment,
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Stack,
  Button,
  Avatar,
  useTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  Share as ShareIcon
} from '@mui/icons-material';

const DataTable = ({
  columns = [],
  data = [],
  title = '',
  searchable = true,
  pagination = true,
  selectable = false,
  actions = [],
  onRowClick,
  onSelectionChange,
  className = ''
}) => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  // Filter data based on search term
  const filteredData = data.filter(row =>
    Object.values(row).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Pagination
  const paginatedData = pagination
    ? filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : filteredData;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = paginatedData.map((row, index) => page * rowsPerPage + index);
      setSelectedRows(newSelected);
      onSelectionChange?.(newSelected);
    } else {
      setSelectedRows([]);
      onSelectionChange?.([]);
    }
  };

  const handleRowClick = (event, row, index) => {
    if (selectable) {
      const rowIndex = page * rowsPerPage + index;
      const newSelected = selectedRows.includes(rowIndex)
        ? selectedRows.filter(item => item !== rowIndex)
        : [...selectedRows, rowIndex];
      
      setSelectedRows(newSelected);
      onSelectionChange?.(newSelected);
    }
    onRowClick?.(row, index);
  };

  const handleActionClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleActionClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      active: { color: 'success', label: 'Hoạt động' },
      inactive: { color: 'error', label: 'Không hoạt động' },
      pending: { color: 'warning', label: 'Chờ xử lý' },
      completed: { color: 'success', label: 'Hoàn thành' },
      cancelled: { color: 'error', label: 'Đã hủy' }
    };

    const config = statusConfig[status?.toLowerCase()] || { color: 'default', label: status };
    return (
      <Chip
        label={config.label}
        color={config.color}
        size="small"
        sx={{ fontWeight: 600 }}
      />
    );
  };

  const renderCellContent = (column, row) => {
    const value = row[column.field];

    switch (column.type) {
      case 'avatar':
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar
              src={value?.src}
              sx={{ width: 32, height: 32 }}
            >
              {value?.alt || value?.charAt(0)?.toUpperCase()}
            </Avatar>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {value?.name || value}
            </Typography>
          </Box>
        );
      
      case 'status':
        return getStatusChip(value);
      
      case 'chip':
        return (
          <Chip
            label={value}
            color={column.color || 'primary'}
            size="small"
            sx={{ fontWeight: 600 }}
          />
        );
      
      case 'actions':
        return (
          <Stack direction="row" spacing={0.5}>
            {actions.map((action, index) => (
              <Tooltip key={index} title={action.tooltip}>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    action.onClick(row);
                  }}
                  sx={{ color: action.color || 'primary.main' }}
                >
                  {action.icon}
                </IconButton>
              </Tooltip>
            ))}
            <Tooltip title="Thêm">
              <IconButton
                size="small"
                onClick={(e) => handleActionClick(e, row)}
                sx={{ color: 'text.secondary' }}
              >
                <MoreVertIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        );
      
      case 'number':
        return (
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </Typography>
        );
      
      default:
        return (
          <Typography variant="body2" sx={{ color: 'text.primary' }}>
            {value}
          </Typography>
        );
    }
  };

  return (
    <Box className={`data-table fade-in ${className}`}>
      {/* Table Header */}
      {title && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
            {title}
          </Typography>
        </Box>
      )}

      {/* Search Bar */}
      {searchable && (
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <TextField
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{ width: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              size="small"
            >
              Bộ lọc
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              size="small"
            >
              Xuất
            </Button>
          </Stack>
        </Box>
      )}

      {/* Table */}
      <TableContainer 
        component={Paper} 
        sx={{ 
          borderRadius: 2,
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
          overflow: 'hidden'
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'grey.50' }}>
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selectedRows.length > 0 && selectedRows.length < paginatedData.length}
                    checked={paginatedData.length > 0 && selectedRows.length === paginatedData.length}
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
              )}
              {columns.map((column) => (
                <TableCell
                  key={column.field}
                  sx={{
                    fontWeight: 600,
                    color: 'text.primary',
                    fontSize: '0.875rem',
                    backgroundColor: 'grey.50',
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  {column.headerName}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row, index) => (
              <TableRow
                key={row.id || index}
                hover
                selected={selectedRows.includes(page * rowsPerPage + index)}
                onClick={(e) => handleRowClick(e, row, index)}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                  '&.Mui-selected': {
                    backgroundColor: 'primary.light',
                    '&:hover': {
                      backgroundColor: 'primary.main',
                    },
                  },
                }}
              >
                {selectable && (
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedRows.includes(page * rowsPerPage + index)}
                      onChange={(e) => {
                        e.stopPropagation();
                        const rowIndex = page * rowsPerPage + index;
                        const newSelected = selectedRows.includes(rowIndex)
                          ? selectedRows.filter(item => item !== rowIndex)
                          : [...selectedRows, rowIndex];
                        setSelectedRows(newSelected);
                        onSelectionChange?.(newSelected);
                      }}
                    />
                  </TableCell>
                )}
                {columns.map((column) => (
                  <TableCell
                    key={column.field}
                    sx={{
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      py: 1.5
                    }}
                  >
                    {renderCellContent(column, row)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {pagination && (
        <TablePagination
          component="div"
          count={filteredData.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="Số hàng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) => 
            `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
          }
          sx={{
            borderTop: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper'
          }}
        />
      )}

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleActionClose}
      >
        <MenuItem onClick={handleActionClose}>
          <ViewIcon fontSize="small" sx={{ mr: 1 }} />
          Xem chi tiết
        </MenuItem>
        <MenuItem onClick={handleActionClose}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Chỉnh sửa
        </MenuItem>
        <MenuItem onClick={handleActionClose}>
          <ShareIcon fontSize="small" sx={{ mr: 1 }} />
          Chia sẻ
        </MenuItem>
        <MenuItem onClick={handleActionClose} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Xóa
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default DataTable;
