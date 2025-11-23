import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios
// import { mockOrders } from '../../data/mockDataSales'; // Remove mock data import

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

export default function SalesDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [orders, setOrders] = useState([]); // Change to orders
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchOrders = async () => { // Change function name
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:5036/api/Sales/orders'); // Fetch orders through API Gateway
      setOrders(response.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load sales data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(); // Call fetchOrders
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  // Adjust filtering logic for orders
  const filteredOrders = orders.filter(order => {
    // Temporarily disable all filters to ensure all fetched orders are displayed
    return true; 
  });

  const handleViewOrder = (orderId) => { // Change to handleViewOrder
    navigate(`/sales/${orderId}`); // Navigate to order detail
  };

  const handleCreateQuote = () => {
    navigate('/sales/quote/new');
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
              gap: '8px',
              color: '#64748B',
              fontSize: '14px'
            }}>
              <UserIcon />
              <span>admin@enduser.com</span>
            </div>
          </div>
        </div>
      </header>

      <div style={{ 
        maxWidth: '1280px', 
        margin: '0 auto',
        padding: '24px'
      }}>
        {/* Control Panel */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 300px',
          gap: '24px',
          marginBottom: '24px'
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
                    <option value="shipped">Đã giao hàng</option>
                    <option value="delivered">Đã nhận hàng</option>
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

          {/* Thống kê nhanh */}
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
              margin: '0 0 16px 0' 
            }}>
              Tổng quan
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                backgroundColor: '#F0F9FF',
                borderRadius: '8px'
              }}>
                <span style={{ fontSize: '14px', color: '#0369A1' }}>Tổng đơn hàng</span>
                <span style={{ fontSize: '18px', fontWeight: '700', color: '#0369A1' }}>
                  {orders.length}
                </span>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                backgroundColor: '#FEF7CD',
                borderRadius: '8px'
              }}>
                <span style={{ fontSize: '14px', color: '#92400E' }}>Chờ xử lý</span>
                <span style={{ fontSize: '18px', fontWeight: '700', color: '#92400E' }}>
                  {orders.filter(o => o.status.toLowerCase() === 'pending').length}
                </span>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                backgroundColor: '#D1FAE5',
                borderRadius: '8px'
              }}>
                <span style={{ fontSize: '14px', color: '#065F46' }}>Đã giao hàng</span>
                <span style={{ fontSize: '18px', fontWeight: '700', color: '#065F46' }}>
                  {orders.filter(o => o.status.toLowerCase() === 'delivered').length}
                </span>
              </div>
            </div>
            
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
                marginTop: '16px',
                fontSize: '14px'
              }}
            >
              <PlusIcon />
              Tạo báo giá mới
            </button>
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
              minWidth: '800px',
              tableLayout: 'fixed'
            }}>
              <colgroup>
                <col style={{ width: '15%' }} /> {/* Mã đơn hàng */}
                <col style={{ width: '20%' }} /> {/* Khách hàng ID */}
                <col style={{ width: '20%' }} /> {/* Xe điện ID */}
                <col style={{ width: '15%' }} /> {/* Tổng tiền */}
                <col style={{ width: '15%' }} /> {/* Trạng thái */}
                <col style={{ width: '15%' }} /> {/* Thao tác */}
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
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    ID Xe
                  </th>
                  <th style={{ 
                    padding: '16px 12px', 
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    Tổng tiền
                  </th>
                  <th style={{ 
                    padding: '16px 12px', 
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    Trạng thái
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
                  filteredOrders.map((order, index) => (
                    <tr 
                      key={order.id} 
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
                          {order.id}
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
                            {order.customerId}
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
                          {/* <img 
                            src={order.vehicleImage} 
                            alt={order.vehicle} 
                            style={{ 
                              width: '48px', 
                              height: '32px', 
                              objectFit: 'cover', 
                              borderRadius: '6px',
                              flexShrink: 0
                            }}
                          /> */}
                          <span style={{ 
                            color: '#0F172A',
                            fontSize: '14px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {order.vehicleId} (SL: {order.quantity})
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
                          {formatCurrency(order.totalPrice)}
                        </div>
                        {/* order.paymentType === 'installment' && (
                          <div style={{ 
                            fontSize: '12px', 
                            color: '#64748B',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            Đặt cọc: {formatCurrency(order.downPayment)}
                          </div>
                        ) */}
                      </td>
                      <td style={{ 
                        padding: '16px 12px', 
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        <span style={{ 
                          fontSize: '14px', 
                          color: order.status.toLowerCase() === 'pending' ? '#F59E0B' : (order.status.toLowerCase() === 'confirmed' ? '#10B981' : '#EF4444'),
                          fontWeight: '500',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {order.status}
                        </span>
                      </td>
                      <td style={{ 
                        padding: '16px 12px', 
                        whiteSpace: 'nowrap', 
                        textAlign: 'center',
                        overflow: 'hidden'
                      }}>
                        <button 
                          onClick={() => handleViewOrder(order.id)}
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
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ 
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