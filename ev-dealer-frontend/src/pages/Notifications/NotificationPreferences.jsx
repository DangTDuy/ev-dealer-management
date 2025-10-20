/**
 * Notification Preferences Page
 * TODO: Implement preferences form with:
 * - Email notifications toggle
 * - SMS notifications toggle
 * - Notification types (Orders, Deliveries, Payments, System)
 * - Save preferences button
 */

const NotificationPreferences = () => {
  return (
    <div className="notification-preferences-page">
      <h1>Notification Preferences</h1>

      <form>
        <div className="preference-section">
          <h3>Notification Channels</h3>
          <label>
            <input type="checkbox" defaultChecked />
            Email Notifications
          </label>
          <label>
            <input type="checkbox" />
            SMS Notifications
          </label>
          <label>
            <input type="checkbox" defaultChecked />
            In-App Notifications
          </label>
        </div>

        <div className="preference-section">
          <h3>Notification Types</h3>
          <label>
            <input type="checkbox" defaultChecked />
            New Orders
          </label>
          <label>
            <input type="checkbox" defaultChecked />
            Delivery Updates
          </label>
          <label>
            <input type="checkbox" defaultChecked />
            Payment Notifications
          </label>
          <label>
            <input type="checkbox" />
            Promotions
          </label>
          <label>
            <input type="checkbox" defaultChecked />
            System Messages
          </label>
        </div>

        <button type="submit">Save Preferences</button>
      </form>
    </div>
  )
}

export default NotificationPreferences

