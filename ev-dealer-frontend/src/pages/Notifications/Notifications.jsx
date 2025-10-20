/**
 * Notifications Page
 * TODO: Implement notifications center with:
 * - List of notifications (new orders, deliveries, payments, system messages)
 * - Mark as read/unread
 * - Delete notification
 * - Filter by type
 * - Notification preferences link
 */

const Notifications = () => {
  return (
    <div className="notifications-page">
      <div className="page-header">
        <h1>Notifications</h1>
        <div className="actions">
          <button>Mark All as Read</button>
          <button>Preferences</button>
        </div>
      </div>

      {/* Filters */}
      <div className="filters">
        <button className="active">All</button>
        <button>Orders</button>
        <button>Deliveries</button>
        <button>Payments</button>
        <button>System</button>
      </div>

      {/* Notification List */}
      <div className="notification-list">
        <div className="notification-item unread">
          <div className="icon">📦</div>
          <div className="content">
            <h4>New Order Received</h4>
            <p>Order #1234 from John Doe</p>
            <span className="time">2 hours ago</span>
          </div>
          <button>×</button>
        </div>

        <div className="notification-item">
          <div className="icon">💰</div>
          <div className="content">
            <h4>Payment Received</h4>
            <p>$15,000 payment for Order #1233</p>
            <span className="time">5 hours ago</span>
          </div>
          <button>×</button>
        </div>

        {/* TODO: Add more notifications */}
      </div>
    </div>
  )
}

export default Notifications

