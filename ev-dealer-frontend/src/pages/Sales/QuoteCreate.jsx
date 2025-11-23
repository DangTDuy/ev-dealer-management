import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios

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
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 0 0 1 2 2v2"/>
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
  const [vehicles, setVehicles] = useState([]); // State for real vehicle data
  const [fetchingVehicles, setFetchingVehicles] = useState(true);
  const [vehiclesError, setVehiclesError] = useState(null);

  const [customers, setCustomers] = useState([]); // State for real customer data
  const [fetchingCustomers, setFetchingCustomers] = useState(true);
  const [customersError, setCustomersError] = useState(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState(''); // State for selected customer ID from dropdown
  
  // Customer info
  const [customerInfo, setCustomerInfo] = useState({
    id: '', // Store selected customer ID
    name: '',
    phone: '',
    email: '',
    address: '',
    idNumber: '' // This field is not in CustomerDto, so keep it empty or remove
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

  // Fetch vehicles from VehicleService
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setFetchingVehicles(true);
        // Call VehicleService through API Gateway
        const response = await axios.get('http://localhost:5036/api/vehicles'); 
        setVehicles(response.data.items); 
      } catch (err) {
        console.error('Error fetching vehicles:', err);
        setVehiclesError('Failed to load vehicle data.');
      } finally {
        setFetchingVehicles(false);
      }
    };
    fetchVehicles();
  }, []);

  // Fetch customers from CustomerService
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setFetchingCustomers(true);
        const response = await axios.get('http://localhost:5036/api/customers'); 
        setCustomers(response.data); // Assuming CustomerService returns a direct array of customers
      } catch (err) {
        console.error('Error fetching customers:', err);
        setCustomersError('Failed to load customer data.');
      } finally {
        setFetchingCustomers(false);
      }
    };
    fetchCustomers();
  }, []);

  // Handle customer selection from dropdown
  const handleCustomerSelectChange = (e) => {
    setSelectedCustomerId(e.target.value);
    // Clear displayed customer info when selection changes
    setCustomerInfo({
      id: '',
      name: '',
      phone: '',
      email: '',
      address: '',
      idNumber: ''
    });
  };

  // Handle "Check Customer" button click
  const handleCheckCustomer = () => {
    const customer = customers.find(c => c.id === parseInt(selectedCustomerId));
    if (customer) {
      setCustomerInfo({
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        address: customer.address,
        idNumber: '' // Assuming CustomerDto doesn't have idNumber
      });
    } else {
      alert('Không tìm thấy khách hàng với ID đã chọn.');
      setCustomerInfo({
        id: '',
        name: '',
        phone: '',
        email: '',
        address: '',
        idNumber: ''
      });
    }
  };

  // Validation form
const validateForm = () => {
  if (!customerInfo.id) {
    alert('Vui lòng chọn và kiểm tra thông tin khách hàng.');
    return false;
  }
  
  if (!customerInfo.name.trim()) {
    alert('Thông tin khách hàng chưa được tải hoặc không hợp lệ.');
    return false;
  }
  
  if (!customerInfo.phone.trim()) {
    alert('Thông tin khách hàng chưa được tải hoặc không hợp lệ.');
    return false;
  }

  // Kiểm tra ít nhất một xe được chọn
  const hasValidItems = quoteItems.some(item => item.vehicleId && item.quantity > 0);
  if (!hasValidItems) {
    alert('Vui lòng chọn ít nhất một xe.');
    return false;
  }

  // Kiểm tra từng xe đã chọn
  for (let item of quoteItems) {
    if (item.vehicleId && item.quantity < 1) {
      alert('Số lượng phải lớn hơn 0.');
      return false;
    }
  }

  // Validate installment details if type is installment
  if (paymentInfo.type === 'installment') {
    if (!paymentInfo.downPaymentPercent || paymentInfo.downPaymentPercent <= 0 || paymentInfo.downPaymentPercent > 100) {
      alert('Phần trăm trả trước không hợp lệ (0-100).');
      return false;
    }
    if (!paymentInfo.loanTerm || paymentInfo.loanTerm <= 0) {
      alert('Kỳ hạn vay không hợp lệ.');
      return false;
    }
    if (paymentInfo.interestRate === null || paymentInfo.interestRate < 0) {
      alert('Lãi suất không hợp lệ.');
      return false;
    }
  }

  return true;
};

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
      const vehicle = vehicles.find(v => v.id === parseInt(value)); // Parse value to int
      if (vehicle) {
        newItems[index].vehicleName = vehicle.model; // Use vehicle.model for name
        newItems[index].unitPrice = vehicle.price;
      }
    }
    
    setQuoteItems(newItems);
  };

const handleGenerateQuote = async () => {
  if (!validateForm()) {
    return;
  }

  setLoading(true);
  
  try {
    const firstQuoteItem = quoteItems.find(item => item.vehicleId);
    if (!firstQuoteItem) {
      alert('No valid vehicle selected for the quote.');
      setLoading(false);
      return;
    }

    // 1. Create Quote
    const createQuotePayload = {
      customerId: customerInfo.id, // Use selected customer ID
      vehicleId: parseInt(firstQuoteItem.vehicleId),
      quantity: firstQuoteItem.quantity,
      notes: additionalInfo.notes || `Quote for ${customerInfo.name} - ${firstQuoteItem.vehicleName}`,
      
      // Include payment details
      paymentType: paymentInfo.type === 'full' ? 'Full' : 'Installment',
      downPaymentPercent: paymentInfo.type === 'installment' ? paymentInfo.downPaymentPercent : null,
      loanTerm: paymentInfo.type === 'installment' ? paymentInfo.loanTerm : null,
      interestRate: paymentInfo.type === 'installment' ? paymentInfo.interestRate : null,
    };

    const quoteResponse = await axios.post('http://localhost:5036/api/Sales/quotes', createQuotePayload); // Call through API Gateway
    const quoteId = quoteResponse.data.id;
    console.log('Quote created successfully with ID:', quoteId);

    // 2. Update Quote Status to Accepted
    await axios.put(`http://localhost:5036/api/Sales/quotes/${quoteId}/status`, "Accepted", { // Call through API Gateway
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('Quote status updated to Accepted for ID:', quoteId);

    // 3. Create Order from Accepted Quote
    const createOrderPayload = {
      quoteId: quoteId,
      paymentMethod: paymentInfo.type === 'full' ? 'Cash' : 'Installment', // Map frontend payment type to backend
      notes: additionalInfo.notes || `Order from quote ${quoteId} for ${customerInfo.name}`,
    };
    await axios.post('http://localhost:5036/api/Sales/orders', createOrderPayload); // Call through API Gateway
    console.log('Order created successfully from Quote ID:', quoteId);
    
    alert('Đơn hàng đã được tạo thành công!');
    navigate('/sales'); // Navigate to sales list
  } catch (error) {
    console.error('Error creating order process:', error.response ? error.response.data : error.message);
    alert('Tạo đơn hàng thất bại. Vui lòng kiểm tra console để biết chi tiết.');
  } finally {
    setLoading(false);
  }
};

  const handleDownloadQuote = () => {
    // Simulate PDF download
    alert('Đang tải xuống báo giá PDF...');
  };

  if (fetchingVehicles || fetchingCustomers) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Đang tải dữ liệu...</div>
      </div>
    );
  }

  if (vehiclesError || customersError) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'red' }}>
        <div>Lỗi tải dữ liệu: {vehiclesError || customersError}</div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#F8FAFC',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          marginBottom: '24px',
          paddingBottom: '16px',
          borderBottom: '1px solid #E2E8F0'
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
                transition: 'all 0.2s',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#F3F4F6'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
            >
              <BackIcon />
              Quay lại
            </button>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#0F172A', margin: 0 }}>
                Tạo Báo Giá Mới
              </h1>
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
                transition: 'all 0.2s',
                fontSize: '14px',
                fontWeight: '500'
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
                backgroundColor: loading ? '#9CA3AF' : '#3B82F6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              {loading ? 'Đang xử lý...' : 'Tạo báo giá'}
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          {/* Main Content */}
          <div style={{ minWidth: 0 }}> {/* Thêm minWidth: 0 để tránh tràn layout */}
            {/* Customer Information */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#0F172A', marginBottom: '20px' }}>
                Thông tin khách hàng
              </h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <div style={{ minWidth: 0 }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Chọn khách hàng *
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <select
                      value={selectedCustomerId}
                      onChange={handleCustomerSelectChange}
                      style={{
                        flexGrow: 1,
                        padding: '10px 12px',
                        border: '1px solid #CBD5E1',
                        borderRadius: '8px',
                        fontSize: '14px',
                        backgroundColor: '#F8FAFC',
                        height: '40px',
                        boxSizing: 'border-box'
                      }}
                    >
                      <option value="">-- Chọn khách hàng --</option>
                      {customers.map(customer => (
                        <option key={customer.id} value={customer.id}>
                          {customer.name} ({customer.phone})
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleCheckCustomer}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#3B82F6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        height: '40px'
                      }}
                    >
                      Kiểm tra
                    </button>
                  </div>
                </div>
                
                <div style={{ minWidth: 0 }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    value={customerInfo.name}
                    readOnly
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #CBD5E1',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: '#F1F5F9',
                      height: '40px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                
                <div style={{ minWidth: 0 }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    readOnly
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #CBD5E1',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: '#F1F5F9',
                      height: '40px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                
                <div style={{ minWidth: 0 }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    readOnly
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #CBD5E1',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: '#F1F5F9',
                      height: '40px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                
                <div style={{ gridColumn: 'span 2', minWidth: 0 }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    value={customerInfo.address}
                    readOnly
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #CBD5E1',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: '#F1F5F9',
                      height: '40px',
                      boxSizing: 'border-box'
                    }}
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
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#0F172A', margin: 0 }}>
                  Chi tiết xe
                </h2>
                <button
                  onClick={addQuoteItem}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    backgroundColor: '#3B82F6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  <PlusIcon />
                  Thêm xe
                </button>
              </div>
              
              {quoteItems.map((item, index) => (
                <div key={index} style={{
                  padding: '20px',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  marginBottom: index < quoteItems.length - 1 ? '16px' : '0',
                  backgroundColor: '#F8FAFC'
                }}>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) auto', 
                    gap: '12px', 
                    alignItems: 'end' 
                  }}>
                    <div style={{ minWidth: 0 }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                        Chọn xe
                      </label>
                      <select
                        value={item.vehicleId}
                        onChange={(e) => updateQuoteItem(index, 'vehicleId', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #CBD5E1',
                          borderRadius: '8px',
                          fontSize: '14px',
                          backgroundColor: '#F8FAFC',
                          height: '40px',
                          boxSizing: 'border-box'
                        }}
                      >
                        <option value="">-- Chọn xe --</option>
                        {vehicles.map(vehicle => (
                          <option key={vehicle.id} value={vehicle.id}>
                            {vehicle.model} - {formatCurrency(vehicle.price)}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div style={{ minWidth: 0 }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                        Số lượng
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuoteItem(index, 'quantity', parseInt(e.target.value) || 1)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #CBD5E1',
                          borderRadius: '8px',
                          fontSize: '14px',
                          backgroundColor: '#F8FAFC',
                          height: '40px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                    
                    <div style={{ minWidth: 0 }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                        Đơn giá
                      </label>
                      <input
                        type="text"
                        value={formatCurrency(item.unitPrice)}
                        readOnly
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #CBD5E1',
                          borderRadius: '8px',
                          fontSize: '14px',
                          backgroundColor: '#F1F5F9',
                          height: '40px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                    
                    <div style={{ minWidth: 0 }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
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
                          padding: '10px 12px',
                          border: '1px solid #CBD5E1',
                          borderRadius: '8px',
                          fontSize: '14px',
                          backgroundColor: '#F8FAFC',
                          height: '40px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                    
                    <button
                      onClick={() => removeQuoteItem(index)}
                      disabled={quoteItems.length === 1}
                      style={{
                        padding: '10px',
                        backgroundColor: quoteItems.length === 1 ? '#F1F5F9' : '#FEE2E2',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: quoteItems.length === 1 ? 'not-allowed' : 'pointer',
                        color: quoteItems.length === 1 ? '#94A3B8' : '#DC2626',
                        height: '40px',
                        width: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                  
                  {item.vehicleId && (
                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #E2E8F0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                        <span style={{ color: '#64748B' }}>Thành tiền:</span>
                        <span style={{ fontWeight: '600', color: '#0F172A' }}>
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
              marginBottom: '24px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#0F172A', marginBottom: '20px' }}>
                Thông tin thanh toán
              </h2>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '12px' }}>
                  Hình thức thanh toán
                </label>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="paymentType"
                      value="full"
                      checked={paymentInfo.type === 'full'}
                      onChange={(e) => setPaymentInfo({...paymentInfo, type: e.target.value})}
                    />
                    <span style={{ fontSize: '14px', color: '#374151' }}>Trả toàn bộ</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="paymentType"
                      value="installment"
                      checked={paymentInfo.type === 'installment'}
                      onChange={(e) => setPaymentInfo({...paymentInfo, type: e.target.value})}
                    />
                    <span style={{ fontSize: '14px', color: '#374151' }}>Trả góp</span>
                  </label>
                </div>
              </div>
              
              {paymentInfo.type === 'installment' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  <div style={{ minWidth: 0 }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                      Trả trước (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={paymentInfo.downPaymentPercent}
                      onChange={(e) => setPaymentInfo({...paymentInfo, downPaymentPercent: parseInt(e.target.value) || 0})}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #CBD5E1',
                        borderRadius: '8px',
                        fontSize: '14px',
                        backgroundColor: '#F8FAFC',
                        height: '40px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  
                  <div style={{ minWidth: 0 }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                      Kỳ hạn (tháng)
                    </label>
                    <select
                      value={paymentInfo.loanTerm}
                      onChange={(e) => setPaymentInfo({...paymentInfo, loanTerm: parseInt(e.target.value)})}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #CBD5E1',
                        borderRadius: '8px',
                        fontSize: '14px',
                        backgroundColor: '#F8FAFC',
                        height: '40px',
                        boxSizing: 'border-box'
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
                  
                  <div style={{ minWidth: 0 }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                      Lãi suất (%/năm)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={paymentInfo.interestRate}
                      onChange={(e) => setPaymentInfo({...paymentInfo, interestRate: parseFloat(e.target.value) || 0})}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #CBD5E1',
                        borderRadius: '8px',
                        fontSize: '14px',
                        backgroundColor: '#F8FAFC',
                        height: '40px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ minWidth: 0 }}> {/* Thêm minWidth: 0 để tránh tràn layout */}
            {/* Quote Summary */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#0F172A', marginBottom: '20px' }}>
                Tóm tắt báo giá
              </h2>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Nhân viên bán hàng
                </label>
                <input
                  type="text"
                  value={additionalInfo.salesPerson}
                  onChange={(e) => setAdditionalInfo({...additionalInfo, salesPerson: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: '#F8FAFC',
                    height: '40px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Ngày giao xe dự kiến
                </label>
                <input
                  type="date"
                  value={additionalInfo.deliveryDate}
                  onChange={(e) => setAdditionalInfo({...additionalInfo, deliveryDate: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: '#F8FAFC',
                    height: '40px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Báo giá có hiệu lực đến
                </label>
                <input
                  type="date"
                  value={additionalInfo.validUntil}
                  onChange={(e) => setAdditionalInfo({...additionalInfo, validUntil: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: '#F8FAFC',
                    height: '40px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Ghi chú
                </label>
                <textarea
                  value={additionalInfo.notes}
                  onChange={(e) => setAdditionalInfo({...additionalInfo, notes: e.target.value})}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: '#F8FAFC',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                    minHeight: '80px'
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
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#0F172A', marginBottom: '20px' }}>
                Chi tiết giá
              </h2>
              
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '12px' }}>
                  <span style={{ color: '#64748B' }}>Tổng cộng:</span>
                  <span style={{ color: '#0F172A', fontWeight: '500' }}>{formatCurrency(calculateTotal())}</span>
                </div>
                
                {paymentInfo.type === 'installment' && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '12px' }}>
                      <span style={{ color: '#64748B' }}>Trả trước ({paymentInfo.downPaymentPercent}%):</span>
                      <span style={{ color: '#0F172A', fontWeight: '500' }}>{formatCurrency(calculateDownPayment())}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '12px' }}>
                      <span style={{ color: '#64748B' }}>Số tiền vay:</span>
                      <span style={{ color: '#0F172A', fontWeight: '500' }}>{formatCurrency(calculateLoanAmount())}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '12px' }}>
                      <span style={{ color: '#64748B' }}>Góp hàng tháng:</span>
                      <span style={{ color: '#0F172A', fontWeight: '500' }}>{formatCurrency(calculateMonthlyPayment())}</span>
                    </div>
                  </>
                )}
              </div>
              
              <div style={{ 
                paddingTop: '16px', 
                borderTop: '1px solid #E2E8F0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '16px', fontWeight: '600', color: '#0F172A' }}>Tổng thanh toán:</span>
                <span style={{ fontSize: '20px', fontWeight: '700', color: '#3B82F6' }}>
                  {formatCurrency(calculateTotal())}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Thêm CSS để đảm bảo tính ổn định */}
      <style>{`
        /* Cố định hoàn toàn kích thước select và input */
        select, input[type="text"], input[type="tel"], input[type="email"], input[type="number"], input[type="date"] {
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
        
        /* Đảm bảo textarea có kích thước phù hợp */
        textarea {
          box-sizing: border-box !important;
          min-width: 100% !important;
          max-width: 100% !important;
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
        
        /* Đảm bảo radio buttons có style nhất quán */
        input[type="radio"] {
          margin: 0;
        }
      `}</style>
    </div>
  );
}