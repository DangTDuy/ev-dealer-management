import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

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
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentNote, setPaymentNote] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [contracts, setContracts] = useState([]);
  const [payments, setPayments] = useState([]);

  // Mock order data
  const mockOrder = {
    id: orderId,
    customer: {
      name: 'Nguyễn Văn A',
      phone: '0912345678',
      email: 'nguyenvana@email.com',
      address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
      idNumber: '123456789',
      idIssueDate: '2020-01-15',
      idIssuePlace: 'TP.HCM'
    },
    vehicle: {
      name: 'VinFast VF8 Plus',
      model: 'VF8',
      color: 'Đen',
      vin: 'VF8VN2025001234',
      price: 1350000000,
      image: 'https://via.placeholder.com/300x200?text=VF8+Plus'
    },
    orderInfo: {
      orderDate: '2025-10-15',
      expectedDeliveryDate: '2025-11-30',
      salesPerson: 'John Doe',
      branch: 'VinFast Quận 1',
      status: 'confirmed',
      quantity: 1,
      unitPrice: 1350000000,
      discount: 50000000,
      totalPrice: 1300000000
    },
    payment: {
      type: 'installment',
      downPayment: 390000000,
      downPaymentPaid: 390000000,
      loanAmount: 910000000,
      loanTerm: 24,
      interestRate: 8.5,
      monthlyPayment: 41350000
    }
  };

  // Mock payment schedule
  const mockPaymentSchedule = [
    { month: 1, dueDate: '2025-12-15', amount: 41350000, status: 'paid', paidDate: '2025-12-10' },
    { month: 2, dueDate: '2026-01-15', amount: 41350000, status: 'paid', paidDate: '2026-01-12' },
    { month: 3, dueDate: '2026-02-15', amount: 41350000, status: 'pending', paidDate: null },
    { month: 4, dueDate: '2026-03-15', amount: 41350000, status: 'pending', paidDate: null },
    { month: 5, dueDate: '2026-04-15', amount: 41350000, status: 'pending', paidDate: null },
    { month: 6, dueDate: '2026-05-15', amount: 41350000, status: 'pending', paidDate: null }
  ];

  // Mock contracts
  const mockContracts = [
    { id: 1, name: 'Hợp đồng mua bán xe.pdf', uploadDate: '2025-10-16', size: '2.3 MB' },
    { id: 2, name: 'Hợp đồng tài chính.pdf', uploadDate: '2025-10-16', size: '1.8 MB' }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setOrder(mockOrder);
      setPayments(mockPaymentSchedule);
      setContracts(mockContracts);
      setLoading(false);
    }, 500);
  }, [orderId]);

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
      processing: { label: 'Đang xử lý', color: '#8B5CF6', bgColor: '#EDE9FE' },
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

  const handleRecordPayment = () => {
    // Simulate API call
    const newPayment = {
      month: payments.filter(p => p.status === 'pending').length + 1,
      dueDate: new Date().toISOString().split('T')[0],
      amount: parseFloat(paymentAmount),
      status: 'paid',
      paidDate: new Date().toISOString().split('T')[0],
      note: paymentNote
    };
    
    setPayments([...payments, newPayment]);
    setShowPaymentModal(false);
    setPaymentAmount('');
    setPaymentNote('');
    alert('Ghi nhận thanh toán thành công!');
  };

  const handleUpdateStatus = () => {
    setOrder({...order, orderInfo: {...order.orderInfo, status: newStatus}});
    setShowStatusModal(false);
    setNewStatus('');
    alert('Cập nhật trạng thái thành công!');
  };

  const handleUploadContract = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newContract = {
        id: contracts.length + 1,
        name: file.name,
        uploadDate: new Date().toISOString().split('T')[0],
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      };
      setContracts([...contracts, newContract]);
      alert('Tải lên hợp đồng thành công!');
    }
  };

  const handleDownloadContract = (contract) => {
    alert(`Đang tải xuống: ${contract.name}`);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Đang tải...</div>
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
                Ngày đặt: {order.orderInfo.orderDate}
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {getStatusBadge(order.orderInfo.status)}
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
            {/* Customer Information */}
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
                  <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 4px 0' }}>Họ và tên</p>
                  <p style={{ fontSize: '15px', fontWeight: '500', color: '#111827', margin: 0 }}>
                    {order.customer.name}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 4px 0' }}>Số điện thoại</p>
                  <p style={{ fontSize: '15px', fontWeight: '500', color: '#111827', margin: 0 }}>
                    {order.customer.phone}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 4px 0' }}>Email</p>
                  <p style={{ fontSize: '15px', fontWeight: '500', color: '#111827', margin: 0 }}>
                    {order.customer.email}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 4px 0' }}>Số CMND/CCCD</p>
                  <p style={{ fontSize: '15px', fontWeight: '500', color: '#111827', margin: 0 }}>
                    {order.customer.idNumber}
                  </p>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 4px 0' }}>Địa chỉ</p>
                  <p style={{ fontSize: '15px', fontWeight: '500', color: '#111827', margin: 0 }}>
                    {order.customer.address}
                  </p>
                </div>
              </div>
            </div>

            {/* Vehicle Information */}
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
                <img 
                  src={order.vehicle.image} 
                  alt={order.vehicle.name}
                  style={{ width: '200px', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                    <div>
                      <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 4px 0' }}>Tên xe</p>
                      <p style={{ fontSize: '15px', fontWeight: '500', color: '#111827', margin: 0 }}>
                        {order.vehicle.name}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 4px 0' }}>Màu sắc</p>
                      <p style={{ fontSize: '15px', fontWeight: '500', color: '#111827', margin: 0 }}>
                        {order.vehicle.color}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 4px 0' }}>Số VIN</p>
                      <p style={{ fontSize: '15px', fontWeight: '500', color: '#111827', margin: 0 }}>
                        {order.vehicle.vin}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 4px 0' }}>Số lượng</p>
                      <p style={{ fontSize: '15px', fontWeight: '500', color: '#111827', margin: 0 }}>
                        {order.orderInfo.quantity}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Schedule */}
            {order.payment.type === 'installment' && (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '24px',
                border: '1px solid #E5E7EB'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>
                    Lịch thanh toán
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
                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Kỳ</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Ngày đến hạn</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Số tiền</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Trạng thái</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Ngày thanh toán</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment, index) => (
                        <tr key={index} style={{ borderBottom: '1px solid #F3F4F6' }}>
                          <td style={{ padding: '12px', fontSize: '14px' }}>Tháng {payment.month}</td>
                          <td style={{ padding: '12px', fontSize: '14px' }}>{payment.dueDate}</td>
                          <td style={{ padding: '12px', fontSize: '14px', fontWeight: '500' }}>
                            {formatCurrency(payment.amount)}
                          </td>
                          <td style={{ padding: '12px' }}>
                            {payment.status === 'paid' ? (
                              <span style={{
                                padding: '2px 8px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                fontWeight: '500',
                                color: '#059669',
                                backgroundColor: '#D1FAE5'
                              }}>
                                Đã thanh toán
                              </span>
                            ) : (
                              <span style={{
                                padding: '2px 8px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                fontWeight: '500',
                                color: '#D97706',
                                backgroundColor: '#FEF3C7'
                              }}>
                                Chờ thanh toán
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '12px', fontSize: '14px' }}>
                            {payment.paidDate || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Contracts */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
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
                {contracts.map((contract) => (
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
                          {contract.name}
                        </p>
                        <p style={{ fontSize: '12px', color: '#6B7280', margin: '4px 0 0 0' }}>
                          {contract.uploadDate} • {contract.size}
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
                ))}
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
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>{order.orderInfo.orderDate}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', color: '#6B7280' }}>Ngày giao dự kiến</span>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>{order.orderInfo.expectedDeliveryDate}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', color: '#6B7280' }}>Nhân viên</span>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>{order.orderInfo.salesPerson}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', color: '#6B7280' }}>Chi nhánh</span>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>{order.orderInfo.branch}</span>
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
                    {order.payment.type === 'full' ? 'Trả toàn bộ' : 'Trả góp'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', color: '#6B7280' }}>Đơn giá</span>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                    {formatCurrency(order.orderInfo.unitPrice)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', color: '#6B7280' }}>Giảm giá</span>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                    -{formatCurrency(order.orderInfo.discount)}
                  </span>
                </div>
                {order.payment.type === 'installment' && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '14px', color: '#6B7280' }}>Trả trước</span>
                      <span style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                        {formatCurrency(order.payment.downPayment)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '14px', color: '#6B7280' }}>Kỳ hạn</span>
                      <span style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                        {order.payment.loanTerm} tháng
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '14px', color: '#6B7280' }}>Lãi suất</span>
                      <span style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                        {order.payment.interestRate}%/năm
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '14px', color: '#6B7280' }}>Góp hàng tháng</span>
                      <span style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                        {formatCurrency(order.payment.monthlyPayment)}
                      </span>
                    </div>
                  </>
                )}
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
                  {formatCurrency(order.orderInfo.totalPrice)}
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
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
                  onClick={() => alert('Gửi email xác nhận thành công!')}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#2563EB',
                    color: 'white',
                    border: 'none',
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
                  Gửi email xác nhận
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
                <option value="processing">Đang xử lý</option>
                <option value="completed">Hoàn thành</option>
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
    </div>
  );
}