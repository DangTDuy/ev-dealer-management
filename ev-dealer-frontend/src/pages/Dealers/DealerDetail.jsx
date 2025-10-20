/**
 * Dealer Detail Page
 * TODO: Implement dealer detail view with:
 * - Dealer information (name, region, contact, contract)
 * - Performance metrics (sales, target, achievement %)
 * - Performance chart (monthly sales)
 * - Debt information
 * - Contract upload/view
 * - Edit dealer button
 */

import { useParams } from 'react-router-dom'

const DealerDetail = () => {
  const { id } = useParams()

  return (
    <div className="dealer-detail-page">
      <div className="page-header">
        <h1>Dealer Details</h1>
        <div className="actions">
          <button>Edit</button>
          <button>Upload Contract</button>
        </div>
      </div>

      <div className="dealer-content">
        {/* Information */}
        <div className="info">
          <h2>ABC Motors</h2>
          <p>Region: North</p>
          <p>Contact: dealer@example.com</p>
          <p>Phone: (123) 456-7890</p>
        </div>

        {/* Performance Metrics */}
        <div className="metrics">
          <div className="metric-card">
            <h3>Sales Target</h3>
            <p>100 units</p>
          </div>
          <div className="metric-card">
            <h3>Achieved</h3>
            <p>75 units (75%)</p>
          </div>
          <div className="metric-card">
            <h3>Debt</h3>
            <p>$50,000</p>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="chart">
          <h3>Monthly Performance</h3>
          {/* TODO: Add Recharts chart */}
        </div>
      </div>
    </div>
  )
}

export default DealerDetail

