/**
 * Topbar Component
 * TODO: Implement topbar with user menu, notifications bell, search
 */

const Topbar = () => {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <input type="search" placeholder="Search..." />
      </div>
      <div className="topbar-right">
        <button className="notification-btn">
          🔔 <span className="badge">5</span>
        </button>
        <div className="user-menu">
          <img src="/avatar.png" alt="User" />
          <span>John Doe</span>
        </div>
      </div>
    </header>
  )
}

export default Topbar

