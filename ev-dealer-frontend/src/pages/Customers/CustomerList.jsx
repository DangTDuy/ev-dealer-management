/**
 * Customer List Page
 * TODO: Implement customer list with:
 * - Search bar
 * - Filters (status, dealer)
 * - Table: Name, Email, Phone, Total Purchases, Status, Actions
 * - Add New Customer button
 * - View details button
 */

const CustomerList = () => {
  return (
    <div className="customer-list-page">
      <div className="page-header">
        <h1>Customers</h1>
        <button>Add New Customer</button>
      </div>

      {/* Search and Filters */}
      <div className="filters">
        <input type="search" placeholder="Search customers..." />
        <select>
          <option>All Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>

      {/* Customer Table */}
      <div className="customer-table">
        {/* TODO: Add Table component */}
        <p>Customer list will be displayed here</p>
      </div>
    </div>
  )
}

export default CustomerList

