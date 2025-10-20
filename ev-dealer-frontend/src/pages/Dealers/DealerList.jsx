/**
 * Dealer List Page
 * TODO: Implement dealer list with:
 * - Search bar
 * - Filters (region, status)
 * - Table: Name, Region, Contact, Sales Target, Debt, Status, Actions
 * - Add New Dealer button (Admin only)
 * - View performance button
 */

const DealerList = () => {
  return (
    <div className="dealer-list-page">
      <div className="page-header">
        <h1>Dealers</h1>
        <button>Add New Dealer</button>
      </div>

      {/* Search and Filters */}
      <div className="filters">
        <input type="search" placeholder="Search dealers..." />
        <select>
          <option>All Regions</option>
          <option>North</option>
          <option>South</option>
          <option>East</option>
          <option>West</option>
        </select>
      </div>

      {/* Dealer Table */}
      <div className="dealer-table">
        {/* TODO: Add Table component */}
        <p>Dealer list will be displayed here</p>
      </div>
    </div>
  )
}

export default DealerList

