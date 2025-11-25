import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios

// Reuse icons from QuoteCreate style
const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
);

const DownloadIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

export default function QuoteView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quote, setQuote] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [vehicle, setVehicle] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const qResp = await axios.get(`http://localhost:5036/api/Sales/quotes/${id}`);
        const q = qResp.data;
        setQuote(q);

        // fetch customer
        try {
          const cResp = await axios.get(`http://localhost:5036/api/customers/${q.customerId}`);
          setCustomer(cResp.data);
        } catch (e) {
          setCustomer({ id: q.customerId, name: '', phone: '', email: '', address: '' });
        }

        // fetch vehicle
        try {
          const vResp = await axios.get(`http://localhost:5036/api/vehicles/${q.vehicleId}`);
          const v = vResp.data && vResp.data.model ? vResp.data : (vResp.data.data ? vResp.data.data : vResp.data);
          setVehicle(v);
        } catch (e) {
          setVehicle({ id: q.vehicleId, model: '', price: q.unitPrice });
        }

      } catch (err) {
        console.error('Error fetching quote:', err);
        setError('Không thể tải thông tin báo giá.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  };

  const calculateTotals = () => {
    if (!quote) return { total: 0, downPayment: 0, monthly: 0, installmentTotal: 0 };
    const total = quote.totalPrice || 0;
    const down = quote.downPaymentPercent ? total * (quote.downPaymentPercent / 100) : 0;
    const loanAmount = total - down;
    let monthly = 0;
    if (quote.paymentType === 'Installment' && quote.loanTerm && quote.interestRate != null) {
      const monthlyRate = (quote.interestRate / 100) / 12;
      const n = quote.loanTerm;
      if (monthlyRate === 0) monthly = loanAmount / n;
      else monthly = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
    }
    const installmentTotal = quote.paymentType === 'Installment' ? (down + monthly * (quote.loanTerm || 0)) : total;
    return { total, down, monthly, installmentTotal };
  };

  const handleDownloadPdf = async () => {
    if (!quote) return;
    setLoading(true);
    try {
      const payload = {
        customerInfo: {
          id: customer?.id || quote.customerId,
          name: customer?.name || '',
          phone: customer?.phone || '',
          email: customer?.email || '',
          address: customer?.address || ''
        },
        quoteItems: [
          {
            vehicleId: quote.vehicleId,
            vehicleName: vehicle?.model || '',
            quantity: quote.quantity,
            unitPrice: quote.unitPrice,
            discountPercent: quote.discountPercent ?? 0,
            itemTotal: quote.totalPrice
          }
        ],
        paymentInfo: {
          type: quote.paymentType === 'Installment' ? 'installment' : 'full',
          downPaymentPercent: quote.downPaymentPercent,
          loanTerm: quote.loanTerm,
          interestRate: quote.interestRate
        },
        additionalInfo: {
          deliveryDate: quote.deliveryDate || '',
          notes: quote.notes || '',
          salesPerson: quote.salesRepName || '',
          validUntil: quote.validUntil || ''
        },
        totalCalculatedAmount: quote.totalPrice,
        downPaymentCalculated: quote.downPaymentPercent ? (quote.totalPrice * (quote.downPaymentPercent / 100)) : 0,
        monthlyPaymentCalculated: 0,
        installmentTotalPaymentCalculated: quote.totalPrice
      };

      const response = await axios.post('http://localhost:5036/api/Sales/generate-quote-pdf', payload, { responseType: 'blob' });
      const file = new Blob([response.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = fileURL;
      link.setAttribute('download', `BaoGiaXeDien_${quote.id || 'quote'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(fileURL);
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Tạo PDF thất bại.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Đang tải dữ liệu...</div>);
  if (error) return (<div style={{ padding: 24, color: 'red' }}>{error}</div>);

  const totals = calculateTotals();

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
              onClick={() => navigate(-1)}
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
            >
              <BackIcon />
              Quay lại
            </button>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#0F172A', margin: 0 }}>
                Chi tiết Báo giá #{quote?.id}
              </h1>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={handleDownloadPdf}
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
            >
              <DownloadIcon />
              Tải PDF
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          {/* Main Content */}
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
                <div style={{ minWidth: 0, gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Khách hàng
                  </label>
                  <input value={customer?.name || ''} readOnly style={{ width: '100%', padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '14px', backgroundColor: '#F1F5F9', height: '40px', boxSizing: 'border-box', color: '#374151' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Họ và tên
                  </label>
                  <input value={customer?.name || ''} readOnly style={{ width: '100%', padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '14px', backgroundColor: '#F1F5F9', height: '40px', boxSizing: 'border-box', color: '#374151' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Số điện thoại
                  </label>
                  <input value={customer?.phone || ''} readOnly style={{ width: '100%', padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '14px', backgroundColor: '#F1F5F9', height: '40px', boxSizing: 'border-box', color: '#374151' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Email
                  </label>
                  <input value={customer?.email || ''} readOnly style={{ width: '100%', padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '14px', backgroundColor: '#F1F5F9', height: '40px', boxSizing: 'border-box', color: '#374151' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Địa chỉ
                  </label>
                  <input value={customer?.address || ''} readOnly style={{ width: '100%', padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '14px', backgroundColor: '#F1F5F9', height: '40px', boxSizing: 'border-box', color: '#374151' }} />
                </div>
              </div>
            </div>

            {/* Vehicle Selection (read-only presentation) */}
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
              </div>

              <div style={{ padding: '20px', border: '1px solid #E2E8F0', borderRadius: '8px', backgroundColor: '#F8FAFC' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '12px', alignItems: 'end' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Xe</label>
                    <input value={vehicle?.model || quote?.vehicleId || ''} readOnly style={{ width: '100%', padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '14px', backgroundColor: '#F1F5F9', height: '40px', boxSizing: 'border-box', color: '#374151' }} />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Số lượng</label>
                    <input value={quote?.quantity || 0} readOnly style={{ width: '100%', padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '14px', backgroundColor: '#F1F5F9', height: '40px', boxSizing: 'border-box', color: '#374151' }} />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Đơn giá</label>
                    <input value={formatCurrency(quote?.unitPrice)} readOnly style={{ width: '100%', padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '14px', backgroundColor: '#F1F5F9', height: '40px', boxSizing: 'border-box', color: '#374151' }} />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Giảm giá (%)</label>
                    <input value={quote?.discountPercent ?? 0} readOnly style={{ width: '100%', padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '14px', backgroundColor: '#F1F5F9', height: '40px', boxSizing: 'border-box', color: '#374151' }} />
                  </div>
                </div>

                <div style={{ marginTop: '12px', borderTop: '1px solid #E2E8F0', paddingTop: '12px', display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ color: '#64748B' }}>Thành tiền</div>
                  <div style={{ fontWeight: 700 }}>{formatCurrency(quote?.totalPrice)}</div>
                </div>
              </div>
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
                <input value={quote?.paymentType || 'Full'} readOnly style={{ width: '160px', padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '14px', backgroundColor: '#F1F5F9', height: '40px', boxSizing: 'border-box', color: '#374151' }} />
              </div>

              {quote?.paymentType === 'Installment' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  <div style={{ minWidth: 0 }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Trả trước (%)</label>
                    <input value={quote?.downPaymentPercent ?? ''} readOnly style={{ width: '100%', padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '14px', backgroundColor: '#F1F5F9', height: '40px', boxSizing: 'border-box', color: '#374151' }} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Kỳ hạn (tháng)</label>
                    <input value={quote?.loanTerm ?? ''} readOnly style={{ width: '100%', padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '14px', backgroundColor: '#F1F5F9', height: '40px', boxSizing: 'border-box', color: '#374151' }} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Lãi suất (%/năm)</label>
                    <input value={quote?.interestRate ?? ''} readOnly style={{ width: '100%', padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '14px', backgroundColor: '#F1F5F9', height: '40px', boxSizing: 'border-box', color: '#374151' }} />
                  </div>
                </div>
              )}

              {/* Payment notes intentionally omitted (use staff notes on the right column) */}
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ minWidth: 0 }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#0F172A', marginBottom: '20px' }}>
                Thông tin nhân viên
              </h2>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>ID nhân viên</label>
                <input type="text" value={quote?.salesRepId || ''} readOnly style={{ width: '100%', padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '14px', backgroundColor: '#F1F5F9', height: '40px', boxSizing: 'border-box', color: '#374151' }} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Tên nhân viên</label>
                <input type="text" value={quote?.salesRepName || ''} readOnly style={{ width: '100%', padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '14px', backgroundColor: '#F1F5F9', height: '40px', boxSizing: 'border-box', color: '#374151' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Ghi chú</label>
                <textarea value={quote?.notes || ''} readOnly rows={3} style={{ width: '100%', padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', fontSize: '14px', backgroundColor: '#F8FAFC', resize: 'vertical', boxSizing: 'border-box', minHeight: '80px', color: '#374151' }} />
              </div>
            </div>

            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#0F172A', marginBottom: '20px' }}>Chi tiết giá</h2>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '12px' }}>
                  <span style={{ color: '#64748B' }}>Tổng cộng:</span>
                  <span style={{ color: '#0F172A', fontWeight: '500' }}>{formatCurrency(totals.total)}</span>
                </div>
                {quote?.paymentType === 'Installment' && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '12px' }}>
                      <span style={{ color: '#64748B' }}>Trả trước ({quote.downPaymentPercent}%):</span>
                      <span style={{ color: '#0F172A', fontWeight: '500' }}>{formatCurrency(totals.down)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '12px' }}>
                      <span style={{ color: '#64748B' }}>Số tiền vay:</span>
                      <span style={{ color: '#0F172A', fontWeight: '500' }}>{formatCurrency(totals.total - totals.down)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '12px' }}>
                      <span style={{ color: '#64748B' }}>Góp hàng tháng:</span>
                      <span style={{ color: '#0F172A', fontWeight: '500' }}>{formatCurrency(totals.monthly)}</span>
                    </div>
                  </>
                )}
              </div>
              <div style={{ paddingTop: '16px', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '16px', fontWeight: '600', color: '#0F172A' }}>Tổng thanh toán:</span>
                <span style={{ fontSize: '20px', fontWeight: '700', color: '#3B82F6' }}>{formatCurrency(totals.installmentTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        select, input[type="text"], input[type="tel"], input[type="email"], input[type="number"], input[type="date"] {
          height: 40px !important;
          box-sizing: border-box !important;
          min-width: 100% !important;
          max-width: 100% !important;
          color: #374151;
        }
        textarea { box-sizing: border-box !important; min-width: 100% !important; max-width: 100% !important; color: #374151; }
      `}</style>
    </div>
  );
}
