/**
 * Customer Detail Page
 * TODO: Implement customer detail view with:
 * - Customer profile (name, email, phone, address)
 * - Purchase history table
 * - Test drive history
 * - Feedback/complaints
 * - Schedule test drive button
 * - Edit customer button
 */

import { useParams } from 'react-router-dom'

const CustomerDetail = () => {
  const { id } = useParams()

  return (
    <div className="customer-detail-page">
      <div className="page-header">
        <h1>Customer Details</h1>
        <div className="actions">
          <button>Edit</button>
          <button>Schedule Test Drive</button>
        </div>
      </div>

      <div className="customer-content">
        {/* Profile */}
        <div className="profile">
          <h2>John Doe</h2>
          <p>Email: john@example.com</p>
          <p>Phone: (123) 456-7890</p>
          <p>Address: 123 Main St, City, State</p>
        </div>

        {/* Purchase History */}
        <div className="section">
          <h3>Purchase History</h3>
          {/* TODO: Add table */}
        </div>

        {/* Test Drives */}
        <div className="section">
          <h3>Test Drive History</h3>
          {/* TODO: Add table */}
        </div>

        {/* Feedback */}
        <div className="section">
          <h3>Feedback & Complaints</h3>
          {/* TODO: Add list */}
        </div>
      </div>
    </div>
  )
}

export default CustomerDetail

