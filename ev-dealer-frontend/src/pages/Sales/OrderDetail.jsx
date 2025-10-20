/**
 * Order Detail Page
 * TODO: Implement order detail view with:
 * - Order information (ID, date, status)
 * - Customer details
 * - Vehicle details
 * - Payment information
 * - Payment schedule (for installments)
 * - Contract document
 * - Status update buttons
 */

import { useParams } from 'react-router-dom'

const OrderDetail = () => {
  const { id } = useParams()

  return (
    <div className="order-detail-page">
      <h1>Order #{id}</h1>
      
      <div className="order-info">
        <div className="section">
          <h3>Order Information</h3>
          <p>Status: <span className="badge">Confirmed</span></p>
          <p>Date: 2024-01-15</p>
          <p>Total: $45,000</p>
        </div>

        <div className="section">
          <h3>Customer</h3>
          <p>Name: John Doe</p>
          <p>Email: john@example.com</p>
          <p>Phone: (123) 456-7890</p>
        </div>

        <div className="section">
          <h3>Vehicle</h3>
          <p>Model: Tesla Model 3</p>
          <p>Color: White</p>
        </div>

        <div className="section">
          <h3>Payment</h3>
          <p>Type: Installment</p>
          <p>Paid: $15,000</p>
          <p>Remaining: $30,000</p>
        </div>
      </div>

      <div className="actions">
        <button>Update Status</button>
        <button>View Contract</button>
        <button>Record Payment</button>
      </div>
    </div>
  )
}

export default OrderDetail

