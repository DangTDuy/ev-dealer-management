import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Icons
const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>
);

const DownloadIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

export default function QuoteCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  // Customer info
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    idNumber: ''
  });
  
  // Quote items
  const [quoteItems, setQuoteItems] = useState([
    { vehicleId: '', vehicleName: '', quantity: 1, unitPrice: 0, discount: 0 }
  ]);
  
  // Payment info
  const [paymentInfo, setPaymentInfo] = useState({
    type: 'full', // 'full' or 'installment'
    downPaymentPercent: 30,
    loanTerm: 12, // months
    interestRate: 8.5 // %
  });
  
  // Additional info
  const [additionalInfo, setAdditionalInfo] = useState({
    deliveryDate: '',
    notes: '',
    salesPerson: 'User John Doe',
    validUntil: ''
  });

  // Mock vehicle data
  const vehicles = [
    { id: 'vf8', name: 'VinFast VF8', price: 1200000000, image: 'https://via.placeholder.com/80x60?text=VF8' },
    { id: 'vf9', name: 'VinFast VF9', price: 1500000000, image: 'https://via.placeholder.com/80x60?text=VF9' },
    { id: 'vf5', name: 'VinFast VF5', price: 500000000, image: 'https://via.placeholder.com/80x60?text=VF5' },
    { id: 'vf6', name: 'VinFast VF6', price: 750000000, image: 'https://via.placeholder.com/80x60?text=VF6' },
    { id: 'vfe34', name: 'VinFast VF e34', price: 650000000, image: 'https://via.placeholder.com/80x60?text=VFe34' }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const calculateTotal = () => {
    return quoteItems.reduce((total, item) => {
      const itemTotal = item.unitPrice * item.quantity;
      const discountAmount = itemTotal * (item.discount / 100);
      return total + (itemTotal - discountAmount);
    }, 0);
  };

  const calculateDownPayment = () => {
    const total = calculateTotal();
    return total * (paymentInfo.downPaymentPercent / 100);
  };

  const calculateLoanAmount = () => {
    const total = calculateTotal();
    return total - calculateDownPayment();
  };

  const calculateMonthlyPayment = () => {
    if (paymentInfo.type === 'full') return 0;
    
    const loanAmount = calculateLoanAmount();
    const monthlyRate = paymentInfo.interestRate / 100 / 12;
    const numPayments = paymentInfo.loanTerm;
    
    if (monthlyRate === 0) return loanAmount / numPayments;
    
    return loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
           (Math.pow(1 + monthlyRate, numPayments) - 1);
  };

  const addQuoteItem = () => {
    setQuoteItems([...quoteItems, { 
      vehicleId: '', 
      vehicleName: '', 
      quantity: 1, 
      unitPrice: 0, 
      discount: 0 
    }]);
  };

  const removeQuoteItem = (index) => {
    const newItems = quoteItems.filter((_, i) => i !== index);
    setQuoteItems(newItems.length > 0 ? newItems : [{ 
      vehicleId: '', 
      vehicleName: '', 
      quantity: 1, 
      unitPrice: 0, 
      discount: 0 
    }]);
  };

  const updateQuoteItem = (index, field, value) => {
    const newItems = [...quoteItems];
    newItems[index][field] = value;
    
    // Auto-fill vehicle info when vehicle is selected
    if (field === 'vehicleId') {
      const vehicle = vehicles.find(v => v.id === value);
      if (vehicle) {
        newItems[index].vehicleName = vehicle.name;
        newItems[index].unitPrice = vehicle.price;
      }
    }
    
    setQuoteItems(newItems);
  };

  const handleGenerateQuote = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const quoteData = {
        customer: customerInfo,
        items: quoteItems,
        payment: paymentInfo,
        additional: additionalInfo,
        total: calculateTotal(),
        createdAt: new Date().toISOString()
      };
      
      console.log('Generated quote:', quoteData);
      setLoading(false);
      
      // Navigate to quote detail or show success message
      alert('Báo giá đã được tạo thành công!');
      navigate('/sales');
    }, 1500);
  };

  const handleDownloadQuote = () => {
    // Simulate PDF download
    alert('Đang tải xuống báo giá PDF...');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB', padding: '24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
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
                Tạo Báo Giá Mới
              </h1>
              <p style={{ color: '#6B7280', margin: '0 0 0 0', fontSize: '14px' }}>
                Tạo báo giá cho khách hàng
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={handleDownloadQuote}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                backgroundColor: 'white',
                color: '#374151',
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#F3F4F6'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
            >
              <DownloadIcon />
              Lưu nháp
            </button>
            <button 
              onClick={handleGenerateQuote}
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                backgroundColor: loading ? '#9CA3AF' : '#2563EB',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {loading ? 'Đang xử lý...' : 'Tạo báo giá'}
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
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                    placeholder="Nhập họ và tên"
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                    placeholder="Nhập số điện thoại"
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                    placeholder="Nhập email"
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Số CMND/CCCD
                  </label>
                  <input
                    type="text"
                    value={customerInfo.idNumber}
                    onChange={(e) => setCustomerInfo({...customerInfo, idNumber: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                    placeholder="Nhập số CMND/CCCD"
                  />
                </div>
                
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                    placeholder="Nhập địa chỉ"
                  />
                </div>
              </div>
            </div>

            {/* Vehicle Selection */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px',
              border: '1px solid #E5E7EB'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>
                  Chi tiết xe
                </h2>
                <button
                  onClick={addQuoteItem}
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
                  <PlusIcon />
                  Thêm xe
                </button>
              </div>
              
              {quoteItems.map((item, index) => (
                <div key={index} style={{
                  padding: '16px',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  marginBottom: index < quoteItems.length - 1 ? '16px' : '0'
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '12px', alignItems: 'end' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                        Chọn xe
                      </label>
                      <select
                        value={item.vehicleId}
                        onChange={(e) => updateQuoteItem(index, 'vehicleId', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                      >
                        <option value="">-- Chọn xe --</option>
                        {vehicles.map(vehicle => (
                          <option key={vehicle.id} value={vehicle.id}>
                            {vehicle.name} - {formatCurrency(vehicle.price)}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                        Số lượng
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuoteItem(index, 'quantity', parseInt(e.target.value) || 1)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                    
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                        Đơn giá
                      </label>
                      <input
                        type="text"
                        value={formatCurrency(item.unitPrice)}
                        readOnly
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '8px',
                          fontSize: '14px',
                          backgroundColor: '#F9FAFB'
                        }}
                      />
                    </div>
                    
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                        Giảm giá (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={item.discount}
                        onChange={(e) => updateQuoteItem(index, 'discount', parseFloat(e.target.value) || 0)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          border: '1px solid #D1D5DB',
                          borderRadius: '8px',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                    
                    <button
                      onClick={() => removeQuoteItem(index)}
                      disabled={quoteItems.length === 1}
                      style={{
                        padding: '10px',
                        backgroundColor: quoteItems.length === 1 ? '#F3F4F6' : '#FEE2E2',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: quoteItems.length === 1 ? 'not-allowed' : 'pointer',
                        color: quoteItems.length === 1 ? '#9CA3AF' : '#DC2626'
                      }}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                  
                  {item.vehicleId && (
                    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #F3F4F6' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                        <span style={{ color: '#6B7280' }}>Thành tiền:</span>
                        <span style={{ fontWeight: '600', color: '#111827' }}>
                          {formatCurrency((item.unitPrice * item.quantity) * (1 - item.discount / 100))}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Payment Information */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid #E5E7EB'
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                Thông tin thanh toán
              </h2>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Hình thức thanh toán
                </label>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="paymentType"
                      value="full"
                      checked={paymentInfo.type === 'full'}
                      onChange={(e) => setPaymentInfo({...paymentInfo, type: e.target.value})}
                    />
                    <span style={{ fontSize: '14px' }}>Trả toàn bộ</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="paymentType"
                      value="installment"
                      checked={paymentInfo.type === 'installment'}
                      onChange={(e) => setPaymentInfo({...paymentInfo, type: e.target.value})}
                    />
                    <span style={{ fontSize: '14px' }}>Trả góp</span>
                  </label>
                </div>
              </div>
              
              {paymentInfo.type === 'installment' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      Trả trước (%)
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="90"
                      value={paymentInfo.downPaymentPercent}
                      onChange={(e) => setPaymentInfo({...paymentInfo, downPaymentPercent: parseInt(e.target.value) || 30})}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      Kỳ hạn (tháng)
                    </label>
                    <select
                      value={paymentInfo.loanTerm}
                      onChange={(e) => setPaymentInfo({...paymentInfo, loanTerm: parseInt(e.target.value)})}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    >
                      <option value={6}>6 tháng</option>
                      <option value={12}>12 tháng</option>
                      <option value={24}>24 tháng</option>
                      <option value={36}>36 tháng</option>
                      <option value={48}>48 tháng</option>
                      <option value={60}>60 tháng</option>
                    </select>
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      Lãi suất (%/năm)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={paymentInfo.interestRate}
                      onChange={(e) => setPaymentInfo({...paymentInfo, interestRate: parseFloat(e.target.value) || 0})}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        border: '1px solid #D1D5DB',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Quote Summary */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px',
              border: '1px solid #E5E7EB'
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                Tóm tắt báo giá
              </h2>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Nhân viên bán hàng
                </label>
                <input
                  type="text"
                  value={additionalInfo.salesPerson}
                  onChange={(e) => setAdditionalInfo({...additionalInfo, salesPerson: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Ngày giao xe dự kiến
                </label>
                <input
                  type="date"
                  value={additionalInfo.deliveryDate}
                  onChange={(e) => setAdditionalInfo({...additionalInfo, deliveryDate: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Báo giá có hiệu lực đến
                </label>
                <input
                  type="date"
                  value={additionalInfo.validUntil}
                  onChange={(e) => setAdditionalInfo({...additionalInfo, validUntil: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Ghi chú
                </label>
                <textarea
                  value={additionalInfo.notes}
                  onChange={(e) => setAdditionalInfo({...additionalInfo, notes: e.target.value})}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                  placeholder="Thêm ghi chú cho báo giá..."
                />
              </div>
            </div>

            {/* Price Calculation */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid #E5E7EB'
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                Chi tiết giá
              </h2>
              
              <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
                  <span style={{ color: '#6B7280' }}>Tổng cộng:</span>
                  <span style={{ color: '#111827' }}>{formatCurrency(calculateTotal())}</span>
                </div>
                
                {paymentInfo.type === 'installment' && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
                      <span style={{ color: '#6B7280' }}>Trả trước ({paymentInfo.downPaymentPercent}%):</span>
                      <span style={{ color: '#111827' }}>{formatCurrency(calculateDownPayment())}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
                      <span style={{ color: '#6B7280' }}>Số tiền vay:</span>
                      <span style={{ color: '#111827' }}>{formatCurrency(calculateLoanAmount())}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
                      <span style={{ color: '#6B7280' }}>Góp hàng tháng:</span>
                      <span style={{ color: '#111827' }}>{formatCurrency(calculateMonthlyPayment())}</span>
                    </div>
                  </>
                )}
              </div>
              
              <div style={{ 
                paddingTop: '12px', 
                borderTop: '1px solid #E5E7EB',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>Tổng thanh toán:</span>
                <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#2563EB' }}>
                  {formatCurrency(calculateTotal())}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}