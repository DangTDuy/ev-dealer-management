/**
 * Sales/Orders List Page
 * TODO: Implement sales list with:
 * - Search and filters (status, date range, payment type)
 * - Table with: Order ID, Customer, Vehicle, Total, Status, Payment, Date, Actions
 * - Status badges (Pending, Confirmed, Completed, Cancelled)
 * - View details button
 */

const SalesList = () => {
  return (
    <div className="sales-list-page">
      <div className="page-header">
        <h1>Sales & Orders</h1>
        <button>Create Quote</button>
      </div>

      {/* Filters */}
      <div className="filters">
        <input type="search" placeholder="Search orders..." />
        <select>
          <option>All Status</option>
          <option>Pending</option>
          <option>Confirmed</option>
          <option>Completed</option>
        </select>
        <input type="date" placeholder="From Date" />
        <input type="date" placeholder="To Date" />
      </div>

      {/* Orders Table */}
      <div className="orders-table">
        {/* TODO: Add Table component */}
        <p>Orders will be displayed here</p>
      </div>
    </div>
  )
}

export default SalesList

