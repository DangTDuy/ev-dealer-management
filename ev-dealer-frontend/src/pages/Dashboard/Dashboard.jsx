/**
 * Dashboard Page
 * TODO: Implement dashboard with:
 * - Summary cards (Total Sales, Customers, Vehicles, Revenue)
 * - Monthly sales chart
 * - Top selling vehicles chart
 * - Recent activities table
 * - Quick actions
 */

const Dashboard = () => {
  return (
    <div className="dashboard-page">
      <h1>Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card">
          <h3>Total Sales</h3>
          <p className="value">1,234</p>
        </div>
        <div className="card">
          <h3>Customers</h3>
          <p className="value">567</p>
        </div>
        <div className="card">
          <h3>Vehicles</h3>
          <p className="value">89</p>
        </div>
        <div className="card">
          <h3>Revenue</h3>
          <p className="value">$1.2M</p>
        </div>
      </div>

      {/* Charts */}
      <div className="charts">
        <div className="chart">
          <h3>Monthly Sales</h3>
          {/* TODO: Add Recharts line/bar chart */}
        </div>
        <div className="chart">
          <h3>Top Vehicles</h3>
          {/* TODO: Add Recharts pie chart */}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="recent-activities">
        <h3>Recent Activities</h3>
        {/* TODO: Add table component */}
      </div>
    </div>
  )
}

export default Dashboard

