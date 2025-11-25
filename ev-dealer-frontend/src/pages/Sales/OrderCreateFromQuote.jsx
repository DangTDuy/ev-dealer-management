import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Icons (re-using from SalesList for consistency)
const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
);

const SaveIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
    <polyline points="17 21 17 13 7 13 7 21"></polyline>
    <polyline points="7 3 7 8 15 8"></polyline>
  </svg>
);

export default function OrderCreateFromQuote() {
  const { quoteId } = useParams();
  const navigate = useNavigate();
  const [quote, setQuote] = useState(null);
  const [customerInfo, setCustomerInfo] = useState(null); // State for customer details
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New order fields
  const [paymentMethod, setPaymentMethod] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [salesPersonId, setSalesPersonId] = useState(1); // Default sales person ID, should be dynamic

  useEffect(() => {
    const fetchQuoteAndCustomer = async () => {
      try {
        setLoading(true);
        // Fetch Quote details
        const quoteResponse = await axios.get(`http://localhost:5036/api/Sales/quotes/${quoteId}`);
        const fetchedQuote = quoteResponse.data;
        setQuote(fetchedQuote);
        console.log('Fetched Quote:', fetchedQuote); // Log the fetched quote data

        // Fetch Customer details ONLY if customerId is a valid positive number
        if (typeof fetchedQuote.customerId === 'number' && fetchedQuote.customerId > 0) {
          const customerResponse = await axios.get(`http://localhost:5036/api/customers/${fetchedQuote.customerId}`);
          setCustomerInfo(customerResponse.data);
          console.log('Fetched Customer Info:', customerResponse.data); // Log the fetched customer data
        } else {
          console.warn('Báo giá không có customerId hợp lệ, bỏ qua việc lấy chi tiết khách hàng.');
          setCustomerInfo(null); // Ensure customerInfo is null if no customerId
        }

      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load quote or customer details.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuoteAndCustomer();
  }, [quoteId]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const handleCreateOrder = async () => {
    if (!paymentMethod || !deliveryDate) {
      alert('Vui lòng điền đầy đủ Phương thức thanh toán và Ngày giao hàng mong muốn.');
      return;
    }

    // Prepare OrderItems from quote details
    // Ensure quantity is at least 1 to avoid validation errors
    const orderItems = [{
      vehicleId: quote.vehicleId,
      colorVariantId: quote.colorVariantId,
      quantity: quote.quantity && quote.quantity > 0 ? quote.quantity : 1, // Ensure quantity is valid
      unitPrice: quote.unitPrice,
      // TODO: If 'Discount' or 'PromotionApplied' are needed for OrderItem,
      // their source from the quote object or new input fields need to be defined.
    }];

    const payload = {
      quoteId: parseInt(quoteId),
      customerId: quote.customerId,
      dealerId: 1, // TODO: Replace with actual dealer ID (e.g., from user context or selection)
      salesPersonId: salesPersonId, // New: SalesPersonId
      paymentMethod: paymentMethod,
      deliveryDate: deliveryDate,
      notes: deliveryAddress ? `Địa chỉ giao hàng: ${deliveryAddress}. ${quote.notes || ''}` : quote.notes,
      paymentType: quote.paymentType, // Added paymentType from quote to main order payload
      orderItems: orderItems // This array will be processed by the backend to create OrderItem records
    };

    try {
      setLoading(true);
      await axios.post('http://localhost:5036/api/Sales/orders', payload);
      alert('Đơn hàng đã được tạo thành công!');
      navigate('/sales/quotes'); // Navigate back to quote list after creation
    } catch (err) {
      console.error('Error creating order:', err.response ? err.response.data : err.message);
      alert(`Tạo đơn hàng thất bại. Lỗi: ${err.response?.data?.title || err.message}`);
      if (err.response && err.response.data && err.response.data.errors) {
        console.error('Validation Errors:', err.response.data.errors);
        let errorMessages = '';
        for (const key in err.response.data.errors) {
          if (err.response.data.errors.hasOwnProperty(key)) {
            errorMessages += `${key}: ${err.response.data.errors[key].join(', ')}\n`;
          }
        }
        alert(`Lỗi xác thực:\n${errorMessages}`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Đang tải dữ liệu báo giá...</div>
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

  if (!quote) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'orange' }}>
        <div>Không tìm thấy báo giá.</div>
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
          position: 'sticky',
          top: 0,
          zIndex: 10,
          backgroundColor: '#F8FAFC',
          paddingTop: '24px',
          paddingBottom: '16px',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => navigate('/sales/quotes')}
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
                Tạo Đơn Hàng từ Báo Giá #{quoteId}
              </h1>
            </div>
          </div>

          <button
            onClick={handleCreateOrder}
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
            <SaveIcon />
            {loading ? 'Đang tạo...' : 'Tạo Đơn Hàng'}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          {/* Left Column: Quote Details (Read-only) */}
          <div style={{ minWidth: 0 }}>
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
                    ID Khách hàng
                  </label>
                  <input
                    type="text"
                    value={quote.customerId}
                    readOnly
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #CBD5E1',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: '#F1F5F9',
                      height: '40px',
                      boxSizing: 'border-box',
                      color: '#374151'
                    }}
                  />
                </div>
                <div style={{ minWidth: 0 }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Tên khách hàng
                  </label>
                  <input
                    type="text"
                    value={customerInfo?.name || 'Đang tải...'}
                    readOnly
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #CBD5E1',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: '#F1F5F9',
                      height: '40px',
                      boxSizing: 'border-box',
                      color: '#374151'
                    }}
                  />
                </div>
                <div style={{ minWidth: 0 }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    value={customerInfo?.phone || 'Đang tải...'}
                    readOnly
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #CBD5E1',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: '#F1F5F9',
                      height: '40px',
                      boxSizing: 'border-box',
                      color: '#374151'
                    }}
                  />
                </div>
                <div style={{ minWidth: 0 }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Email
                  </label>
                  <input
                    type="text"
                    value={customerInfo?.email || 'Đang tải...'}
                    readOnly
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #CBD5E1',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: '#F1F5F9',
                      height: '40px',
                      boxSizing: 'border-box',
                      color: '#374151'
                    }}
                  />
                </div>
                <div style={{ minWidth: 0, gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    value={customerInfo?.address || 'Đang tải...'}
                    readOnly
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #CBD5E1',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: '#F1F5F9',
                      height: '40px',
                      boxSizing: 'border-box',
                      color: '#374151'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Vehicle Information */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#0F172A', marginBottom: '20px' }}>
                Chi tiết xe
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <div style={{ minWidth: 0 }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    ID Xe
                  </label>
                  <input
                    type="text"
                    value={quote.vehicleId}
                    readOnly
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #CBD5E1',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: '#F1F5F9',
                      height: '40px',
                      boxSizing: 'border-box',
                      color: '#374151'
                    }}
                  />
                </div>
                <div style={{ minWidth: 0 }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Màu sắc
                  </label>
                  <input
                    type="text"
                    value={quote.colorVariantId || 'N/A'}
                    readOnly
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #CBD5E1',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: '#F1F5F9',
                      height: '40px',
                      boxSizing: 'border-box',
                      color: '#374151'
                    }}
                  />
                </div>
                <div style={{ minWidth: 0 }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Số lượng
                  </label>
                  <input
                    type="text"
                    value={quote.quantity}
                    readOnly
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #CBD5E1',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: '#F1F5F9',
                      height: '40px',
                      boxSizing: 'border-box',
                      color: '#374151'
                    }}
                  />
                </div>
                <div style={{ minWidth: 0 }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Đơn giá
                  </label>
                  <input
                    type="text"
                    value={formatCurrency(quote.unitPrice)}
                    readOnly
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #CBD5E1',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: '#F1F5F9',
                      height: '40px',
                      boxSizing: 'border-box',
                      color: '#374151'
                    }}
                  />
                </div>
                <div style={{ minWidth: 0, gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Tổng tiền
                  </label>
                  <input
                    type="text"
                    value={formatCurrency(quote.totalPrice)}
                    readOnly
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #CBD5E1',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: '#F1F5F9',
                      height: '40px',
                      boxSizing: 'border-box',
                      color: '#374151'
                    }}
                  />
                </div>
                <div style={{ minWidth: 0, gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Khuyến mãi/Ghi chú báo giá
                  </label>
                  <textarea
                    value={quote.notes || 'Không có'}
                    readOnly
                    rows={2}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #CBD5E1',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: '#F1F5F9',
                      resize: 'vertical',
                      boxSizing: 'border-box',
                      minHeight: '80px',
                      color: '#374151'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Payment Type */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#0F172A', marginBottom: '20px' }}>
                Hình thức thanh toán báo giá
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <div style={{ minWidth: 0 }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Loại thanh toán
                  </label>
                  <input
                    type="text"
                    value={quote.paymentType === 'Full' ? 'Trả thẳng' : 'Trả góp'}
                    readOnly
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #CBD5E1',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: '#F1F5F9',
                      height: '40px',
                      boxSizing: 'border-box',
                      color: '#374151'
                    }}
                  />
                </div>
                {quote.paymentType === 'Installment' && (
                  <>
                    <div style={{ minWidth: 0 }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                        Trả trước (%)
                      </label>
                      <input
                        type="text"
                        value={`${quote.downPaymentPercent || 0}%`}
                        readOnly
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #CBD5E1',
                          borderRadius: '8px',
                          fontSize: '14px',
                          backgroundColor: '#F1F5F9',
                          height: '40px',
                          boxSizing: 'border-box',
                          color: '#374151'
                        }}
                      />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                        Kỳ hạn (tháng)
                      </label>
                      <input
                        type="text"
                        value={`${quote.loanTerm || 0} tháng`}
                        readOnly
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #CBD5E1',
                          borderRadius: '8px',
                          fontSize: '14px',
                          backgroundColor: '#F1F5F9',
                          height: '40px',
                          boxSizing: 'border-box',
                          color: '#374151'
                        }}
                      />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                        Lãi suất (%/năm)
                      </label>
                      <input
                        type="text"
                        value={`${quote.interestRate || 0}%`}
                        readOnly
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #CBD5E1',
                          borderRadius: '8px',
                          fontSize: '14px',
                          backgroundColor: '#F1F5F9',
                          height: '40px',
                          boxSizing: 'border-box',
                          color: '#374151'
                        }}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: New Order Details (User Input) */}
          <div style={{ minWidth: 0 }}>
            {/* Order Information */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#0F172A', marginBottom: '20px' }}>
                Thông tin Đơn hàng
              </h2>

              {/* Payment Method */}
              <div style={{ marginBottom: '20px' }}>
                <label htmlFor="paymentMethod" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Phương thức thanh toán <span style={{ color: 'red' }}>*</span>
                </label>
                <select
                  id="paymentMethod"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: '#F8FAFC',
                    height: '40px',
                    boxSizing: 'border-box',
                    color: '#374151'
                  }}
                >
                  <option value="">-- Chọn phương thức --</option>
                  <option value="Cash">Tiền mặt</option>
                  <option value="Bank transfer">Chuyển khoản ngân hàng</option>
                </select>
              </div>

              {/* Preferred Delivery Date */}
              <div style={{ marginBottom: '20px' }}>
                <label htmlFor="deliveryDate" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Ngày giao hàng mong muốn <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="date"
                  id="deliveryDate"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: '#F8FAFC',
                    height: '40px',
                    boxSizing: 'border-box',
                    color: '#374151'
                  }}
                />
              </div>

              {/* Delivery Address */}
              <div style={{ marginBottom: '20px' }}>
                <label htmlFor="deliveryAddress" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Địa chỉ giao hàng (nếu giao tận nơi)
                </label>
                <input
                  type="text"
                  id="deliveryAddress"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Nhập địa chỉ giao hàng..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: '#F8FAFC',
                    height: '40px',
                    boxSizing: 'border-box',
                    color: '#374151'
                  }}
                />
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
          color: #374151; /* Ensure text color is visible */
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
          color: #374151; /* Ensure text color is visible */
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