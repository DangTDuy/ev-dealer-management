import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios
import { useAuth } from '../../context/AuthContext'; // Import useAuth

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

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

// New StatusBadge component
const StatusBadge = ({ status }) => {
  const statusStyles = {
    pending: { text: 'Chờ xử lý', color: '#F59E0B', backgroundColor: '#FFFBEB' },
    confirmed: { text: 'Đã xác nhận', color: '#10B981', backgroundColor: '#D1FAE5' },
    indelivery: { text: 'Đang giao', color: '#3B82F6', backgroundColor: '#EFF6FF' },
    completed: { text: 'Hoàn tất', color: '#065F46', backgroundColor: '#D1FAE5' },
    cancelled: { text: 'Đã hủy', color: '#EF4444', backgroundColor: '#FEF2F2' },
  };

  const style = statusStyles[status?.toLowerCase()] || { text: status, color: '#64748B', backgroundColor: '#F1F5F9' };

  return (
    <span style={{
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '9999px',
      fontSize: '12px',
      fontWeight: '500',
      color: style.color,
      backgroundColor: style.backgroundColor,
    }}>
      {style.text}
    </span>
  );
};


export default function SalesDashboard() {
  const { user, isStaff, isManager, isAdmin } = useAuth(); // Get user role info
  
  // Debug logging
  console.log('🔍 User Auth Info:', { user, isStaff, isManager, isAdmin });
  
  // Helper to read fields with multiple casing/variants from API responses
  const pick = (obj, ...keys) => {
    for (const k of keys) {
      if (!obj) continue;
      if (Object.prototype.hasOwnProperty.call(obj, k) && obj[k] !== undefined) return obj[k];
    }
    return undefined;
  };
  const [searchTerm, setSearchTerm] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [orders, setOrders] = useState([]); // Change to orders
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:5036/api/Sales/orders');
      console.log('Raw API response:', response.data);
      
      // Handle both OData format { value: [...], Count: 3 } and direct array
      const ordersData = Array.isArray(response.data) 
        ? response.data 
        : (response.data?.value || response.data?.data || []);
      
      console.log('Parsed orders:', ordersData);
      setOrders(ordersData);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load sales data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  // Adjust filtering logic for orders (use safe fallbacks)
  const filteredOrders = orders.filter(order => {
    const idVal = pick(order, 'orderID', 'OrderID', 'orderId', 'id');
    const custVal = pick(order, 'customerId', 'CustomerId');
    const statusVal = String(pick(order, 'status', 'Status') ?? '').toLowerCase();
    const paymentVal = String(pick(order, 'paymentStatus', 'PaymentStatus') ?? '').toLowerCase();

    const matchesSearchTerm = String(idVal ?? '').includes(searchTerm);
    const matchesCustomerSearch = String(custVal ?? '').includes(customerSearch);
    const matchesStatus = statusFilter === 'all' || statusVal === statusFilter;
    const matchesPayment = paymentFilter === 'all' || paymentVal === paymentFilter;

    return matchesSearchTerm && matchesCustomerSearch && matchesStatus && matchesPayment;
  });

  const handleViewOrder = (orderId) => {
    if (!orderId || orderId === 'undefined') {
      console.error('Invalid order ID:', orderId);
      alert('Lỗi: ID đơn hàng không hợp lệ. Vui lòng thử lại.');
      return;
    }
    console.log('Navigating to order:', orderId);
    navigate(`/sales/${orderId}`);
  };

  const handleCreateQuote = () => {
    navigate('/sales/quote/new');
  };

  const handleViewQuotes = () => {
    navigate('/sales/quotes'); // New route for quote list
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#F8FAFC'
      }}>
        <div>Đang tải dữ liệu...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#F8FAFC',
        color: 'red'
      }}>
        <div>Lỗi: {error}</div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#F8FAFC',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #E2E8F0',
        padding: '16px 24px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1280px',
          margin: '0 auto'
        }}>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: '700', 
            color: '#0F172A', 
            margin: 0 
          }}>
            Quản lý Đơn hàng
          </h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <UserIcon />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>{user?.fullName || user?.name || '...'}</span>
                <span style={{ fontSize: '12px', backgroundColor: '#D1FAE5', color: '#059669', padding: '4px 8px', borderRadius: '9999px', fontWeight: 600 }}>
                  {user?.role ? user.role.replace(/([a-z])([A-Z])/g, '$1 $2') : 'Chưa xác định'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div style={{ 
        maxWidth: '1280px', 
        margin: '0 auto',
        padding: '24px'
      }}>
        {/* Role card removed per request; header now shows compact role badge */}

        {/* Control Panel (Sticky) */}
        <div style={{
          position: 'sticky', // Make this section sticky
          top: 0, // Stick to the top
          zIndex: 10, // Ensure it stays above other content
          backgroundColor: '#F8FAFC', // Match background to avoid transparency issues
          paddingTop: '24px', // Add padding to compensate for sticky position
          paddingBottom: '24px', // Add padding to separate from content below
          display: 'grid',
          gridTemplateColumns: '1fr 300px',
          gap: '24px',
          marginBottom: '0px' // Remove bottom margin as paddingBottom handles spacing
        }}>
          {/* Bộ lọc và tìm kiếm - BỐ CỤC MỚI 2x2 */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            padding: '20px'
          }}>
            <h2 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#0F172A', 
              margin: '0 0 20px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <FilterIcon />
              Bộ lọc & Tìm kiếm
            </h2>
            
            {/* BỐ CỤC MỚI: 2 HÀNG 2 CỘT */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gridTemplateRows: 'auto auto',
              gap: '20px',
              alignItems: 'end'
            }}>
              {/* Hàng 1 - Cột 1: Tìm kiếm mã đơn */}
              <div style={{ minWidth: 0 }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#374151', 
                  marginBottom: '8px' 
                }}>
                  Mã đơn hàng
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{ 
                    position: 'absolute', 
                    left: '12px', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    color: '#9CA3AF',
                    zIndex: 1
                  }}>
                    <SearchIcon />
                  </div>
                  <input
                    type="text"
                    placeholder="Nhập mã đơn..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: '100%',
                      paddingLeft: '40px',
                      paddingRight: '12px',
                      paddingTop: '10px',
                      paddingBottom: '10px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: '#F9FAFB',
                      position: 'relative',
                      height: '40px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Hàng 1 - Cột 2: Tìm kiếm khách hàng */}
              <div style={{ minWidth: 0 }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#374151', 
                  marginBottom: '8px' 
                }}>
                  ID Khách hàng
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{ 
                    position: 'absolute', 
                    left: '12px', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    color: '#9CA3AF',
                    zIndex: 1
                  }}>
                    <SearchIcon />
                  </div>
                  <input
                    type="text"
                    placeholder="Nhập ID khách hàng..."
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    style={{
                      width: '100%',
                      paddingLeft: '40px',
                      paddingRight: '12px',
                      paddingTop: '10px',
                      paddingBottom: '10px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: '#F9FAFB',
                      position: 'relative',
                      height: '40px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Hàng 2 - Cột 1: Trạng thái */}
              <div style={{ minWidth: 0 }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#374151', 
                  marginBottom: '8px' 
                }}>
                  Trạng thái
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: '#F9FAFB',
                      color: '#374151',
                      height: '40px',
                      boxSizing: 'border-box',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      minWidth: '100%',
                      maxWidth: '100%',
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 12px center',
                      backgroundSize: '16px',
                      paddingRight: '36px'
                    }}
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="pending">Chờ xử lý</option>
                    <option value="confirmed">Đã xác nhận</option>
                    <option value="indelivery">Đang giao</option>
                    <option value="completed">Hoàn tất</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </div>
              </div>

              {/* Hàng 2 - Cột 2: Hình thức thanh toán */}
              <div style={{ minWidth: 0 }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#374151', 
                  marginBottom: '8px' 
                }}>
                  Thanh toán
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={paymentFilter}
                    onChange={(e) => setPaymentFilter(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: '#F9FAFB',
                      color: '#374151',
                      height: '40px',
                      boxSizing: 'border-box',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      minWidth: '100%',
                      maxWidth: '100%',
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 12px center',
                      backgroundSize: '16px',
                      paddingRight: '36px'
                    }}
                  >
                    <option value="all">Tất cả hình thức</option>
                    <option value="pending">Chờ thanh toán</option>
                    <option value="paid">Đã thanh toán</option>
                    <option value="partiallypaid">Thanh toán một phần</option>
                    <option value="refunded">Đã hoàn tiền</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Thống kê nhanh & Actions */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h2 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#0F172A', 
              margin: '0 0 16px 0' 
            }}>
              Thao tác
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1 }}>
              {/* Nút cho Staff */}
              {(isStaff || isAdmin) && (
                <button 
                  onClick={handleCreateQuote}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    backgroundColor: '#3B82F6',
                    color: 'white',
                    padding: '12px',
                    borderRadius: '8px',
                    fontWeight: '500',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  <PlusIcon />
                  Tạo báo giá
                </button>
              )}

              {/* Nút cho Manager */}
              {(isManager || isAdmin) && (
                <button 
                  // onClick={handleApproveQuotes} // Sẽ thêm hàm này sau
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    backgroundColor: '#F59E0B',
                    color: 'white',
                    padding: '12px',
                    borderRadius: '8px',
                    fontWeight: '500',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  <CheckIcon />
                  Duyệt báo giá
                </button>
              )}

              {/* Nút chung */}
              <button 
                onClick={handleViewQuotes}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  backgroundColor: '#10B981',
                  color: 'white',
                  padding: '12px',
                  borderRadius: '8px',
                  fontWeight: '500',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                <EyeIcon />
                Danh sách báo giá
              </button>
            </div>
          </div>
        </div>

        {/* Danh sách đơn hàng */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          overflow: 'hidden'
        }}>
          <div style={{ 
            padding: '20px 24px', 
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <h2 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                color: '#0F172A', 
                margin: '0 0 4px 0' 
              }}>
                Danh sách đơn hàng
              </h2>
              <p style={{ 
                fontSize: '14px', 
                color: '#64748B', 
                margin: 0 
              }}>
                {filteredOrders.length} đơn hàng được tìm thấy
              </p>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              minWidth: '1200px', // Increased min-width for better spacing
              tableLayout: 'fixed'
            }}>
              <colgroup>
                {['12%','15%','15%','15%','12%','12%','19%'].map((w, i) => (
                  <col key={i} style={{ width: w }} />
                ))}
              </colgroup>
              <thead style={{ 
                backgroundColor: '#F8FAFC', 
                borderBottom: '1px solid #E2E8F0' 
              }}>
                <tr>
                  <th style={{ 
                    padding: '16px 12px', 
                    textAlign: 'left', 
                    fontSize: '12px', 
                    fontWeight: '600', 
                    color: '#475569', 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.05em',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    Mã đơn hàng
                  </th>
                  <th style={{ 
                    padding: '16px 12px', 
                    textAlign: 'left', 
                    fontSize: '12px', 
                    fontWeight: '600', 
                    color: '#475569', 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.05em',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    ID Khách hàng
                  </th>
                  <th style={{ 
                    padding: '16px 12px', 
                    textAlign: 'left',
                    fontSize: '12px', 
                    fontWeight: '600', 
                    color: '#475569', 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.05em',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    Xe
                  </th>
                  <th style={{ 
                    padding: '16px 12px', 
                    textAlign: 'left',
                    fontSize: '12px', 
                    fontWeight: '600', 
                    color: '#475569', 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.05em',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    Tổng tiền
                  </th>
                  <th style={{ 
                    padding: '16px 12px', 
                    textAlign: 'left',
                    fontSize: '12px', 
                    fontWeight: '600', 
                    color: '#475569', 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.05em',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    Trạng thái
                  </th>
                  <th style={{ 
                    padding: '16px 12px', 
                    textAlign: 'left',
                    fontSize: '12px', 
                    fontWeight: '600', 
                    color: '#475569', 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.05em',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    Thanh toán
                  </th>
                  <th style={{ 
                    padding: '16px 12px', 
                    whiteSpace: 'nowrap', 
                    textAlign: 'center',
                    overflow: 'hidden'
                  }}>
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order, index) => {
                    const orderItems = pick(order, 'orderItems', 'OrderItems') || [];
                    const firstItem = orderItems[0] || {};
                    return (
                    <tr 
                      key={pick(order, 'orderID','OrderID','orderId','id') ?? Math.random()} 
                      style={{ 
                        borderBottom: index < filteredOrders.length - 1 ? '1px solid #F1F5F9' : 'none'
                      }}
                    >
                      <td style={{ 
                        padding: '16px 12px', 
                        whiteSpace: 'nowrap',
                        fontSize: '14px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        <span style={{ 
                          fontWeight: '600', 
                          color: '#3B82F6'
                        }}>
                          {pick(order, 'orderNumber','OrderNumber') ?? pick(order, 'orderID','OrderID','orderId','id')}
                        </span>
                      </td>
                      <td style={{ 
                        padding: '16px 12px', 
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        <div>
                          <div style={{ 
                            fontSize: '14px', 
                            fontWeight: '500', 
                            color: '#0F172A',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {pick(order,'customerId','CustomerId')}
                          </div>
                          <div style={{ 
                            fontSize: '12px', 
                            color: '#64748B',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {/* order.customerPhone */}
                          </div>
                        </div>
                      </td>
                      <td style={{ 
                        padding: '16px 12px', 
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          gap: '12px'
                        }}>
                          <span style={{ 
                            color: '#0F172A',
                            fontSize: '14px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {`ID: ${pick(firstItem, 'vehicleId', 'VehicleId')} (SL: ${pick(firstItem, 'quantity', 'Quantity')})`}
                          </span>
                        </div>
                      </td>
                      <td style={{ 
                        padding: '16px 12px', 
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        <div style={{ 
                          fontWeight: '600', 
                          color: '#0F172A',
                          fontSize: '14px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {formatCurrency(pick(order,'totalPrice','TotalPrice') ?? 0)}
                        </div>
                      </td>
                      <td style={{ 
                        padding: '16px 12px', 
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        <StatusBadge status={pick(order, 'status', 'Status')} />
                      </td>
                      <td style={{ 
                        padding: '16px 12px', 
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        <span style={{ 
                          fontSize: '14px', 
                          color: pick(order, 'paymentStatus', 'PaymentStatus')?.toLowerCase() === 'pending' ? '#F59E0B' : (pick(order, 'paymentStatus', 'PaymentStatus')?.toLowerCase() === 'paid' ? '#10B981' : '#EF4444'),
                          fontWeight: '500',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {pick(order,'paymentStatus','PaymentStatus')}
                        </span>
                      </td>
                      <td style={{ 
                        padding: '16px 12px', 
                        whiteSpace: 'nowrap', 
                        textAlign: 'center',
                        overflow: 'hidden'
                      }}>
                        <button 
                          onClick={() => handleViewOrder(pick(order, 'orderID','OrderID','orderId','id'))}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            color: '#3B82F6',
                            fontWeight: '500',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '14px',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            transition: 'all 0.2s'
                          }}
                          onMouseOver={(e) => {
                            e.target.style.color = '#2563EB';
                            e.target.style.backgroundColor = '#EFF6FF';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.color = '#3B82F6';
                            e.target.style.backgroundColor = 'transparent';
                          }}
                        >
                          <EyeIcon />
                          Xem chi tiết
                        </button>
                      </td>
                    </tr>
                  );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" style={{ // Changed colSpan to 7
                      padding: '48px 24px', 
                      textAlign: 'center' 
                    }}>
                      <div style={{ 
                        color: '#94A3B8'
                      }}>
                        Không tìm thấy đơn hàng nào
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* CSS để đảm bảo tính ổn định */}
      <style>{`
        /* Cố định hoàn toàn kích thước select và input */
        select, input[type="text"] {
          height: 40px !important;
          box-sizing: border-box !important;
          min-width: 100% !important;
          max-width: 100% !important;
        }
        
        select {
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          white-space: nowrap !important;
        }
        
        /* Đảm bảo bảng không thay đổi kích thước */
        table {
          table-layout: fixed !important;
        }
        
        /* Đảm bảo các cột có kích thước cố định */
        col {
          width: auto !important;
        }
        
        /* Xử lý text overflow trong bảng */
        td, th {
          overflow: hidden !important;
          text-overflow: ellipsis !important;
        }
        
        /* Cải thiện hiển thị options trong select */
        select option {
          background-color: white;
          color: #374151;
          padding: 8px 12px;
        }
        
        select option:hover,
        select option:focus,
        select option:active {
          background-color: #3B82F6 !important;
          color: white !important;
        }
        
        select option:checked {
          background-color: #3B82F6 !important;
          color: white !important;
        }
      `}</style>
    </div>
  );
}