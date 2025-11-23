import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import axios from 'axios'; // Import axios
// import { mockOrder, mockPaymentSchedule, mockContracts } from '../../data/mockDataSales'; // Remove mock data import
=======
import { mockOrder, mockPaymentSchedule, mockContracts } from '../../data/mockDataSales';
import NotificationToast from '../../components/Notification/NotificationToast';
>>>>>>> cbe64c56a5e561b432393d9ee6c4eac729f9aaf1

// Icons
const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
);

const EditIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const DownloadIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const UploadIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const DollarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);

const FileIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

export default function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Add error state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentNote, setPaymentNote] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [contracts, setContracts] = useState([]);
  const [payments, setPayments] = useState([]);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [completing, setCompleting] = useState(false);

  const fetchOrderDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch order details through API Gateway
      const orderResponse = await axios.get(`http://localhost:5036/api/Sales/orders/${orderId}`);
      setOrder(orderResponse.data);

      // Fetch payments for this order through API Gateway
      const paymentsResponse = await axios.get(`http://localhost:5036/api/Payments?orderId=${orderId}`);
      setPayments(paymentsResponse.data);

      // Fetch contracts for this order through API Gateway
      const contractsResponse = await axios.get(`http://localhost:5036/api/Contracts?orderId=${orderId}`);
      setContracts(contractsResponse.data);

    } catch (err) {
      console.error('Error fetching order details:', err);
      setError('Failed to load order details.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [orderId]); // Refetch when orderId changes

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Chờ xử lý', color: '#F59E0B', bgColor: '#FEF3C7' },
      confirmed: { label: 'Đã xác nhận', color: '#3B82F6', bgColor: '#DBEAFE' },
      shipped: { label: 'Đã giao hàng', color: '#8B5CF6', bgColor: '#EDE9FE' },
      delivered: { label: 'Đã nhận hàng', color: '#10B981', bgColor: '#D1FAE5' },
      cancelled: { label: 'Đã hủy', color: '#EF4444', bgColor: '#FEE2E2' },
    };
    const config = statusConfig[status.toLowerCase()] || statusConfig.pending;
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

const handleRecordPayment = async () => {
  if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
    alert('Vui lòng nhập số tiền hợp lệ');
    return;
  }

  try {
    const payload = {
      orderId: parseInt(orderId),
      amount: parseFloat(paymentAmount),
      paymentMethod: "Cash", // Defaulting to Cash for now, can be selected via UI
      notes: paymentNote,
    };
    await axios.post('http://localhost:5036/api/Payments', payload); // Call through API Gateway
    alert('Ghi nhận thanh toán thành công!');
    setShowPaymentModal(false);
    setPaymentAmount('');
    setPaymentNote('');
    fetchOrderDetail(); // Refresh data
  } catch (err) {
    console.error('Error recording payment:', err.response ? err.response.data : err.message);
    alert('Ghi nhận thanh toán thất bại.');
  }
};

const handleUpdateStatus = async () => {
  if (!newStatus) {
    alert('Vui lòng chọn trạng thái mới');
    return;
  }
  
  try {
    const payload = { status: newStatus };
    await axios.put(`http://localhost:5036/api/Sales/orders/${orderId}/status`, payload); // Call through API Gateway
    alert('Cập nhật trạng thái thành công!');
    setShowStatusModal(false);
    setNewStatus('');
    fetchOrderDetail(); // Refresh data
  } catch (err) {
    console.error('Error updating order status:', err.response ? err.response.data : err.message);
    alert('Cập nhật trạng thái thất bại.');
  }
};

<<<<<<< HEAD
// Xử lý lỗi ảnh (giữ nguyên, nhưng có thể cần cập nhật đường dẫn ảnh mặc định)
=======
const handleCompleteOrder = async () => {
  if (completing) return;
  
  // Validation
  if (!order.customer.email) {
    setNotification({
      open: true,
      message: 'Email khách hàng không hợp lệ',
      severity: 'error'
    });
    return;
  }
  
  setCompleting(true);
  
  try {
    const requestData = {
      customerName: order.customer.name,
      customerEmail: order.customer.email,
      vehicleModel: order.vehicle.model || order.vehicle.name,
      totalAmount: order.orderInfo.totalPrice,
      paymentMethod: order.payment.type === 'full' ? 'Full Payment' : 'Installment',
      quantity: 1
    };
    
    const response = await fetch('http://localhost:5003/api/orders/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to complete order');
    }
    
    const result = await response.json();
    
    // Update order status to completed
    setOrder({
      ...order,
      orderInfo: {
        ...order.orderInfo,
        status: 'completed'
      }
    });
    
    setNotification({
      open: true,
      message: `Đơn hàng hoàn tất thành công! Email xác nhận đã được gửi đến ${order.customer.email}. Mã đơn: ${result.orderId}`,
      severity: 'success'
    });
  } catch (error) {
    console.error('Error completing order:', error);
    setNotification({
      open: true,
      message: `Lỗi khi hoàn tất đơn hàng: ${error.message}`,
      severity: 'error'
    });
  } finally {
    setCompleting(false);
  }
};

const handleCloseNotification = () => {
  setNotification({ ...notification, open: false });
};

// Xử lý lỗi ảnh
>>>>>>> cbe64c56a5e561b432393d9ee6c4eac729f9aaf1
const handleImageError = (e) => {
  e.target.src = '/src/assets/img/default-car.png'; // Update path if needed
  e.target.alt = 'Không thể tải ảnh';
};

const handleUploadContract = async (e) => {
  const file = e.target.files[0];
  if (file) {
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
      alert('Chỉ chấp nhận file PDF, DOC, DOCX');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File không được vượt quá 10MB');
      return;
    }

    try {
      const payload = {
        orderId: parseInt(orderId),
        contractDetails: `Uploaded: ${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB)`, // Store some details
        // In a real app, you'd upload the file to a storage service and store its URL here
      };
      await axios.post('http://localhost:5036/api/Contracts', payload); // Call through API Gateway
      alert('Tải lên hợp đồng thành công!');
      fetchOrderDetail(); // Refresh contracts
    } catch (err) {
      console.error('Error uploading contract:', err.response ? err.response.data : err.message);
      alert('Tải lên hợp đồng thất bại.');
    } finally {
      e.target.value = ''; // Reset input file
    }
  }
};

  const handleDownloadContract = (contract) => {
    alert(`Đang tải xuống: ${contract.contractDetails}`); // Use contractDetails for now
    // In a real app, you'd trigger a download from a stored URL
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'red' }}>
        <div>Lỗi: {error}</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Không tìm thấy đơn hàng</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB', padding: '24px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          marginBottom: '24px',
          paddingBottom: '16px',
          borderBottom: '1px solid #E5E7EB'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              onClick={() => navigate('/sales')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: 'white',
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#F3F4F6'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
            >
              <BackIcon />
              Quay lại
            </button>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                Chi tiết đơn hàng: {order.id}
              </h1>
              <p style={{ color: '#6B7280', margin: '4px 0 0 0', fontSize: '14px' }}>
                Ngày đặt: {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {getStatusBadge(order.status)} {/* Use order.status */}
            <button 
              onClick={() => setShowStatusModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                backgroundColor: '#F3F4F6',
                color: '#374151',
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#E5E7EB'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#F3F4F6'}
            >
              <EditIcon />
              Cập nhật trạng thái
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          {/* Main Content */}
          <div>
            {/* Customer Information (Placeholder as we don't have customer details from OrderDto) */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px',
              border: '1px solid #E5E7EB'
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                Thông tin khách hàng
              </h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <div>
                  <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 4px 0' }}>ID Khách hàng</p>
                  <p style={{ fontSize: '15px', fontWeight: '500', color: '#111827', margin: 0 }}>
                    {order.customerId}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 4px 0' }}>Tên khách hàng</p>
                  <p style={{ fontSize: '15px', fontWeight: '500', color: '#111827', margin: 0 }}>
                    {/* Placeholder: Fetch from CustomerService */}
                    N/A (ID: {order.customerId})
                  </p>
                </div>
                {/* Other customer details would go here after fetching from CustomerService */}
              </div>
            </div>

            {/* Vehicle Information (Placeholder as we don't have vehicle details from OrderDto) */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px',
              border: '1px solid #E5E7EB'
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                Thông tin xe
              </h2>
              
              <div style={{ display: 'flex', gap: '20px' }}>
                {/* <img 
                  src={order.vehicle.image} 
                  alt={order.vehicle.name}
                  style={{ width: '200px', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
                /> */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                    <div>
                      <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 4px 0' }}>ID Xe</p>
                      <p style={{ fontSize: '15px', fontWeight: '500', color: '#111827', margin: 0 }}>
                        {order.vehicleId}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 4px 0' }}>Tên xe</p>
                      <p style={{ fontSize: '15px', fontWeight: '500', color: '#111827', margin: 0 }}>
                        {/* Placeholder: Fetch from VehicleService */}
                        N/A (ID: {order.vehicleId})
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 4px 0' }}>Số lượng</p>
                      <p style={{ fontSize: '15px', fontWeight: '500', color: '#111827', margin: 0 }}>
                        {order.quantity}
                      </p>
                    </div>
                    {/* Other vehicle details would go here after fetching from VehicleService */}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Schedule */}
            {/* This section needs more complex logic to generate payment schedule based on order.paymentMethod */}
            {/* For now, we'll just list payments directly fetched from API */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px',
              border: '1px solid #E5E7EB'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>
                  Lịch sử thanh toán
                </h2>
                <button
                  onClick={() => setShowPaymentModal(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    backgroundColor: '#2563EB',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  <DollarIcon />
                  Ghi nhận thanh toán
                </button>
              </div>
              
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151' }}>ID</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Số tiền</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Phương thức</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Trạng thái</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Ngày thanh toán</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.length > 0 ? payments.map((payment) => (
                      <tr key={payment.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                        <td style={{ padding: '12px', fontSize: '14px' }}>{payment.id}</td>
                        <td style={{ padding: '12px', fontSize: '14px', fontWeight: '500' }}>
                          {formatCurrency(payment.amount)}
                        </td>
                        <td style={{ padding: '12px', fontSize: '14px' }}>{payment.paymentMethod}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '500',
                            color: payment.status.toLowerCase() === 'completed' ? '#059669' : '#D97706',
                            backgroundColor: payment.status.toLowerCase() === 'completed' ? '#D1FAE5' : '#FEF3C7'
                          }}>
                            {payment.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px', fontSize: '14px' }}>
                          {new Date(payment.paymentDate).toLocaleDateString()}
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="5" style={{ padding: '12px', textAlign: 'center', color: '#6B7280' }}>
                          Chưa có thanh toán nào.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Contracts */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px',
              border: '1px solid #E5E7EB'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>
                  Hợp đồng
                </h2>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    backgroundColor: '#F3F4F6',
                    color: '#374151',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}>
                    <UploadIcon />
                    Tải lên
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleUploadContract}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>
              
              <div style={{ display: 'grid', gap: '12px' }}>
                {contracts.length > 0 ? contracts.map((contract) => (
                  <div key={contract.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    backgroundColor: '#FAFAFA'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <FileIcon style={{ color: '#6B7280' }} />
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: '500', color: '#111827', margin: 0 }}>
                          {contract.contractNumber}
                        </p>
                        <p style={{ fontSize: '12px', color: '#6B7280', margin: '4px 0 0 0' }}>
                          {new Date(contract.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownloadContract(contract)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        backgroundColor: 'white',
                        color: '#374151',
                        border: '1px solid #D1D5DB',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '13px'
                      }}
                    >
                      <DownloadIcon />
                      Tải xuống
                    </button>
                  </div>
                )) : (
                  <div style={{ padding: '12px', textAlign: 'center', color: '#6B7280' }}>
                    Chưa có hợp đồng nào.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Order Summary */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px',
              border: '1px solid #E5E7EB'
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                Tóm tắt đơn hàng
              </h2>
              
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', color: '#6B7280' }}>Mã đơn hàng</span>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>{order.id}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', color: '#6B7280' }}>Ngày đặt</span>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', color: '#6B7280' }}>Ngày cập nhật</span>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>{new Date(order.updatedAt).toLocaleDateString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', color: '#6B7280' }}>Mã báo giá</span>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>{order.quoteId}</span>
                </div>
                {/* Placeholder for Sales Person and Branch */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', color: '#6B7280' }}>Nhân viên</span>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>N/A</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', color: '#6B7280' }}>Chi nhánh</span>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>N/A</span>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px',
              border: '1px solid #E5E7EB'
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                Thông tin thanh toán
              </h2>
              
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', color: '#6B7280' }}>Hình thức</span>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                    {order.paymentMethod}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', color: '#6B7280' }}>Trạng thái thanh toán</span>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                    {order.paymentStatus}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', color: '#6B7280' }}>Tổng số lượng</span>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                    {order.quantity}
                  </span>
                </div>
                {/* Placeholder for other payment details like downPayment, loanTerm, etc. */}
              </div>
              
              <div style={{ 
                paddingTop: '16px', 
                borderTop: '1px solid #E5E7EB',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>Tổng cộng</span>
                <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#2563EB' }}>
                  {formatCurrency(order.totalPrice)}
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px',
              border: '1px solid #E5E7EB'
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                Thao tác nhanh
              </h2>
              
              <div style={{ display: 'grid', gap: '12px' }}>
                <button
                  onClick={() => window.print()}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#F3F4F6',
                    color: '#374151',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <DownloadIcon />
                  In đơn hàng
                </button>
                
                <button
                  onClick={handleCompleteOrder}
                  disabled={completing || order.orderInfo.status === 'completed'}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: (completing || order.orderInfo.status === 'completed') ? '#9CA3AF' : '#10B981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: (completing || order.orderInfo.status === 'completed') ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    opacity: (completing || order.orderInfo.status === 'completed') ? 0.6 : 1
                  }}
                >
                  {completing ? 'Đang xử lý...' : (order.orderInfo.status === 'completed' ? 'Đã hoàn tất' : 'Hoàn tất đơn hàng')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            width: '90%',
            maxWidth: '500px'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
              Ghi nhận thanh toán
            </h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                Số tiền thanh toán
              </label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
                placeholder="Nhập số tiền"
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                Ghi chú
              </label>
              <textarea
                value={paymentNote}
                onChange={(e) => setPaymentNote(e.target.value)}
                rows={3}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '8px',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
                placeholder="Thêm ghi chú (không bắt buộc)"
              />
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowPaymentModal(false)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#F3F4F6',
                  color: '#374151',
                  border: '1px solid #D1D5DB',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Hủy
              </button>
              <button
                onClick={handleRecordPayment}
                disabled={!paymentAmount}
                style={{
                  padding: '10px 20px',
                  backgroundColor: paymentAmount ? '#2563EB' : '#9CA3AF',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: paymentAmount ? 'pointer' : 'not-allowed',
                  fontSize: '14px'
                }}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            width: '90%',
            maxWidth: '400px'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
              Cập nhật trạng thái đơn hàng
            </h3>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                Trạng thái mới
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              >
                <option value="">-- Chọn trạng thái --</option>
                <option value="pending">Chờ xử lý</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="shipped">Đã giao hàng</option>
                <option value="delivered">Đã nhận hàng</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowStatusModal(false)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#F3F4F6',
                  color: '#374151',
                  border: '1px solid #D1D5DB',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Hủy
              </button>
              <button
                onClick={handleUpdateStatus}
                disabled={!newStatus}
                style={{
                  padding: '10px 20px',
                  backgroundColor: newStatus ? '#2563EB' : '#9CA3AF',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: newStatus ? 'pointer' : 'not-allowed',
                  fontSize: '14px'
                }}
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Notification Toast */}
      <NotificationToast
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={handleCloseNotification}
        autoHideDuration={6000}
      />
    </div>
  );
}