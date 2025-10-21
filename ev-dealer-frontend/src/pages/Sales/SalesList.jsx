import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Simple SVG Icons
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);

const FilterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
);

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const DollarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const RefreshIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 4 23 10 17 10"/>
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const ChevronUpIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="18 15 12 9 6 15"/>
  </svg>
);

export default function SalesList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(true);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const itemsPerPage = 10;

  // Mock data with more details
  const mockOrders = [
    {
      id: 'ORD-2025-001',
      customer: 'Nguyễn Văn A',
      vehicle: 'VinFast VF8',
      quantity: 1,
      totalAmount: 1200000000,
      status: 'completed',
      paymentType: 'full',
      orderDate: '2025-10-15',
      customerPhone: '0912345678',
      customerEmail: 'nguyenvana@email.com',
      vehicleImage: 'https://via.placeholder.com/100x60?text=VF8',
      downPayment: 300000000,
      remainingAmount: 900000000,
    },
    {
      id: 'ORD-2025-002',
      customer: 'Trần Thị B',
      vehicle: 'VinFast VF9',
      quantity: 2,
      totalAmount: 3000000000,
      status: 'confirmed',
      paymentType: 'installment',
      orderDate: '2025-10-18',
      customerPhone: '0923456789',
      customerEmail: 'tranthib@email.com',
      vehicleImage: 'https://via.placeholder.com/100x60?text=VF9',
      downPayment: 900000000,
      remainingAmount: 2100000000,
    },
    {
      id: 'ORD-2025-003',
      customer: 'Lê Văn C',
      vehicle: 'VinFast VF5',
      quantity: 1,
      totalAmount: 500000000,
      status: 'pending',
      paymentType: 'full',
      orderDate: '2025-10-20',
      customerPhone: '0934567890',
      customerEmail: 'levanc@email.com',
      vehicleImage: 'https://via.placeholder.com/100x60?text=VF5',
      downPayment: 500000000,
      remainingAmount: 0,
    },
    {
      id: 'ORD-2025-004',
      customer: 'Phạm Thị D',
      vehicle: 'VinFast VF6',
      quantity: 1,
      totalAmount: 750000000,
      status: 'cancelled',
      paymentType: 'installment',
      orderDate: '2025-10-19',
      customerPhone: '0945678901',
      customerEmail: 'phamthid@email.com',
      vehicleImage: 'https://via.placeholder.com/100x60?text=VF6',
      downPayment: 225000000,
      remainingAmount: 525000000,
    },
    {
      id: 'ORD-2025-005',
      customer: 'Hoàng Văn E',
      vehicle: 'VinFast VF e34',
      quantity: 1,
      totalAmount: 650000000,
      status: 'confirmed',
      paymentType: 'installment',
      orderDate: '2025-10-21',
      customerPhone: '0956789012',
      customerEmail: 'hoangvane@email.com',
      vehicleImage: 'https://via.placeholder.com/100x60?text=VFe34',
      downPayment: 195000000,
      remainingAmount: 455000000,
    },
    {
      id: 'ORD-2025-006',
      customer: 'Vũ Thị F',
      vehicle: 'VinFast VF8 Plus',
      quantity: 1,
      totalAmount: 1350000000,
      status: 'pending',
      paymentType: 'full',
      orderDate: '2025-10-22',
      customerPhone: '0967890123',
      customerEmail: 'vuthif@email.com',
      vehicleImage: 'https://via.placeholder.com/100x60?text=VF8+',
      downPayment: 1350000000,
      remainingAmount: 0,
    },
  ];

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 500);
  }, []);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Chờ xử lý', color: '#F59E0B', bgColor: '#FEF3C7' },
      confirmed: { label: 'Đã xác nhận', color: '#3B82F6', bgColor: '#DBEAFE' },
      completed: { label: 'Hoàn thành', color: '#10B981', bgColor: '#D1FAE5' },
      cancelled: { label: 'Đã hủy', color: '#EF4444', bgColor: '#FEE2E2' },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span 
        style={{
          padding: '4px 12px',
          borderRadius: '9999px',
          fontSize: '12px',
          fontWeight: '600',
          color: config.color,
          backgroundColor: config.bgColor,
          border: `1px solid ${config.color}30`
        }}
      >
        {config.label}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.vehicle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || order.paymentType === paymentFilter;
    
    let matchesDate = true;
    if (dateRange.from && dateRange.to) {
      const orderDate = new Date(order.orderDate);
      const fromDate = new Date(dateRange.from);
      const toDate = new Date(dateRange.to);
      matchesDate = orderDate >= fromDate && orderDate <= toDate;
    } else if (dateRange.from) {
      const orderDate = new Date(order.orderDate);
      const fromDate = new Date(dateRange.from);
      matchesDate = orderDate >= fromDate;
    } else if (dateRange.to) {
      const orderDate = new Date(order.orderDate);
      const toDate = new Date(dateRange.to);
      matchesDate = orderDate <= toDate;
    }
    
    return matchesSearch && matchesStatus && matchesPayment && matchesDate;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPaymentFilter('all');
    setDateRange({ from: '', to: '' });
    setCurrentPage(1);
  };

  const exportData = () => {
    // Function to export data as CSV or Excel
    console.log('Exporting data...');
  };

const handleViewOrder = (orderId) => {
  navigate(`/sales/${orderId}`);
};

  const handleCreateQuote = () => {
    navigate('/sales/quote/new');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Đang tải...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB', padding: '24px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontSize: '30px', fontWeight: 'bold', color: '#111827', margin: '0 0 4px 0' }}>Quản lý Đơn hàng</h1>
              <p style={{ color: '#6B7280', margin: 0 }}>Theo dõi và quản lý tất cả đơn hàng xe điện</p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={exportData}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'white',
                  color: '#374151',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontWeight: '500',
                  border: '1px solid #D1D5DB',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#F9FAFB'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
              >
                <DownloadIcon />
                Xuất dữ liệu
              </button>
              <button 
                onClick={handleCreateQuote}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#2563EB',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontWeight: '500',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#1D4ED8'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#2563EB'}
              >
                <PlusIcon />
                Tạo báo giá
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
              border: '1px solid #F3F4F6',
              transition: 'box-shadow 0.2s'
            }}
            onMouseOver={(e) => e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'}
            onMouseOut={(e) => e.target.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 4px 0' }}>Tổng đơn hàng</p>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: '0 0 4px 0' }}>{orders.length}</p>
                  <p style={{ fontSize: '12px', color: '#9CA3AF', margin: 0 }}>Tháng này</p>
                </div>
                <div style={{ width: '48px', height: '48px', backgroundColor: '#DBEAFE', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <DollarIcon />
                </div>
              </div>
            </div>
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
              border: '1px solid #F3F4F6',
              transition: 'box-shadow 0.2s'
            }}
            onMouseOver={(e) => e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'}
            onMouseOut={(e) => e.target.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 4px 0' }}>Chờ xử lý</p>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#F59E0B', margin: '0 0 4px 0' }}>
                    {orders.filter(o => o.status === 'pending').length}
                  </p>
                  <p style={{ fontSize: '12px', color: '#9CA3AF', margin: 0 }}>Cần xác nhận</p>
                </div>
                <div style={{ width: '48px', height: '48px', backgroundColor: '#FEF3C7', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CalendarIcon />
                </div>
              </div>
            </div>
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
              border: '1px solid #F3F4F6',
              transition: 'box-shadow 0.2s'
            }}
            onMouseOver={(e) => e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'}
            onMouseOut={(e) => e.target.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 4px 0' }}>Đã xác nhận</p>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#3B82F6', margin: '0 0 4px 0' }}>
                    {orders.filter(o => o.status === 'confirmed').length}
                  </p>
                  <p style={{ fontSize: '12px', color: '#9CA3AF', margin: 0 }}>Đang xử lý</p>
                </div>
                <div style={{ width: '48px', height: '48px', backgroundColor: '#DBEAFE', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <EyeIcon />
                </div>
              </div>
            </div>
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
              border: '1px solid #F3F4F6',
              transition: 'box-shadow 0.2s'
            }}
            onMouseOver={(e) => e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'}
            onMouseOut={(e) => e.target.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 4px 0' }}>Hoàn thành</p>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#10B981', margin: '0 0 4px 0' }}>
                    {orders.filter(o => o.status === 'completed').length}
                  </p>
                  <p style={{ fontSize: '12px', color: '#9CA3AF', margin: 0 }}>Đã giao xe</p>
                </div>
                <div style={{ width: '48px', height: '48px', backgroundColor: '#D1FAE5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <DollarIcon />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          border: '1px solid #F3F4F6',
          marginBottom: '24px'
        }}>
          <div style={{ padding: '16px', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FilterIcon />
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>Bộ lọc</h2>
              {(searchTerm || statusFilter !== 'all' || paymentFilter !== 'all' || dateRange.from || dateRange.to) && (
                <span style={{
                  marginLeft: '8px',
                  padding: '2px 8px',
                  backgroundColor: '#DBEAFE',
                  color: '#1D4ED8',
                  fontSize: '12px',
                  borderRadius: '9999px'
                }}>
                  Đang áp dụng
                </span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={resetFilters}
                style={{
                  fontSize: '14px',
                  color: '#2563EB',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <RefreshIcon />
                Đặt lại
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                style={{
                  color: '#6B7280',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {showFilters ? <ChevronUpIcon /> : <ChevronDownIcon />}
              </button>
            </div>
          </div>
          
          {showFilters && (
            <div style={{ padding: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                {/* Search */}
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Tìm kiếm
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }}>
                      <SearchIcon />
                    </div>
                    <input
                      type="text"
                      placeholder="Mã đơn, khách hàng, xe..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        width: '100%',
                        paddingLeft: '40px',
                        paddingRight: '16px',
                        padding: '10px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '8px',
                        fontSize: '14px',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#2563EB'}
                      onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Trạng thái
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: 'white',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#2563EB'}
                    onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                  >
                    <option value="all">Tất cả</option>
                    <option value="pending">Chờ xử lý</option>
                    <option value="confirmed">Đã xác nhận</option>
                    <option value="completed">Hoàn thành</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </div>

                {/* Payment Type Filter */}
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Hình thức thanh toán
                  </label>
                  <select
                    value={paymentFilter}
                    onChange={(e) => setPaymentFilter(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: 'white',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#2563EB'}
                    onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                  >
                    <option value="all">Tất cả</option>
                    <option value="full">Thanh toán đầy đủ</option>
                    <option value="installment">Trả góp</option>
                  </select>
                </div>

                {/* Date Range From */}
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Từ ngày
                  </label>
                  <input
                    type="date"
                    value={dateRange.from}
                    onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      fontSize: '14px',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#2563EB'}
                    onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                  />
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginTop: '16px' }}>
                {/* Date Range To */}
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Đến ngày
                  </label>
                  <input
                    type="date"
                    value={dateRange.to}
                    onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      fontSize: '14px',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#2563EB'}
                    onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Orders Table */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          border: '1px solid #F3F4F6',
          overflow: 'hidden'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                <tr>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Mã đơn hàng
                  </th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Khách hàng
                  </th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Xe điện
                  </th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Số lượng
                  </th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Tổng tiền
                  </th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Thanh toán
                  </th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Trạng thái
                  </th>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Ngày đặt
                  </th>
                  <th style={{ padding: '16px 24px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody style={{ borderBottom: '1px solid #E5E7EB' }}>
                {paginatedOrders.length > 0 ? (
                  paginatedOrders.map((order) => (
                    <tr key={order.id} style={{ borderBottom: '1px solid #E5E7EB', transition: 'background-color 0.2s' }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <td style={{ padding: '16px 24px', whiteSpace: 'nowrap' }}>
                        <span style={{ fontWeight: '500', color: '#2563EB' }}>{order.id}</span>
                      </td>
                      <td style={{ padding: '16px 24px', whiteSpace: 'nowrap' }}>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>{order.customer}</div>
                          <div style={{ fontSize: '12px', color: '#6B7280' }}>{order.customerPhone}</div>
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <img 
                            src={order.vehicleImage} 
                            alt={order.vehicle} 
                            style={{ width: '48px', height: '32px', objectFit: 'cover', borderRadius: '4px', marginRight: '12px' }}
                          />
                          <span style={{ color: '#111827' }}>{order.vehicle}</span>
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px', whiteSpace: 'nowrap' }}>
                        <span style={{ color: '#111827' }}>{order.quantity}</span>
                      </td>
                      <td style={{ padding: '16px 24px', whiteSpace: 'nowrap' }}>
                        <div>
                          <div style={{ fontWeight: '600', color: '#111827' }}>
                            {formatCurrency(order.totalAmount)}
                          </div>
                          {order.paymentType === 'installment' && (
                            <div style={{ fontSize: '12px', color: '#6B7280' }}>
                              Đặt cọc: {formatCurrency(order.downPayment)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px', whiteSpace: 'nowrap' }}>
                        <span style={{ fontSize: '14px', color: order.paymentType === 'full' ? '#10B981' : '#F59E0B' }}>
                          {order.paymentType === 'full' ? 'Đầy đủ' : 'Trả góp'}
                        </span>
                      </td>
                      <td style={{ padding: '16px 24px', whiteSpace: 'nowrap' }}>
                        {getStatusBadge(order.status)}
                      </td>
                      <td style={{ padding: '16px 24px', whiteSpace: 'nowrap' }}>
                        <span style={{ color: '#6B7280' }}>{order.orderDate}</span>
                      </td>
                      <td style={{ padding: '16px 24px', whiteSpace: 'nowrap', textAlign: 'center' }}>
                        <button 
                          onClick={() => handleViewOrder(order.id)}  // ← Đã truyền order.id
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            color: '#2563EB',
                            fontWeight: '500',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'color 0.2s'
                          }}
                          onMouseOver={(e) => e.target.style.color = '#1D4ED8'}
                          onMouseOut={(e) => e.target.style.color = '#2563EB'}
                        >
                          <EyeIcon />
                          Xem
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" style={{ padding: '48px 24px', textAlign: 'center' }}>
                      <div style={{ color: '#9CA3AF' }}>
                        <div style={{ margin: '0 auto 12px auto', opacity: '0.5', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <SearchIcon />
                        </div>
                        <p style={{ fontSize: '18px', fontWeight: '500', margin: '0 0 4px 0' }}>Không tìm thấy đơn hàng</p>
                        <p style={{ fontSize: '14px', margin: 0 }}>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {paginatedOrders.length > 0 && (
            <div style={{ padding: '16px 24px', borderTop: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '14px', color: '#6B7280' }}>
                Hiển thị {((currentPage - 1) * itemsPerPage) + 1} đến {Math.min(currentPage * itemsPerPage, filteredOrders.length)} của {filteredOrders.length} đơn hàng
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  style={{
                    padding: '8px 16px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    opacity: currentPage === 1 ? 0.5 : 1,
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => currentPage !== 1 && (e.target.style.backgroundColor = '#F9FAFB')}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
                >
                  Trước
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      backgroundColor: currentPage === i + 1 ? '#2563EB' : 'white',
                      color: currentPage === i + 1 ? 'white' : '#374151',
                      border: currentPage === i + 1 ? 'none' : '1px solid #D1D5DB',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => currentPage !== i + 1 && (e.target.style.backgroundColor = '#F9FAFB')}
                    onMouseOut={(e) => currentPage !== i + 1 && (e.target.style.backgroundColor = 'white')}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  style={{
                    padding: '8px 16px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    opacity: currentPage === totalPages ? 0.5 : 1,
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => currentPage !== totalPages && (e.target.style.backgroundColor = '#F9FAFB')}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}