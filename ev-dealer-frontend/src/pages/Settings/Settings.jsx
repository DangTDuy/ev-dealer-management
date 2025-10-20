/**
 * Settings Page
 * TODO: Implement settings with tabs:
 * - Profile (name, email, phone, avatar)
 * - Change Password
 * - Role & Permissions (Admin only)
 * - System Settings (Admin only)
 */

import { useState } from 'react'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile')

  return (
    <div className="settings-page">
      <h1>Settings</h1>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={activeTab === 'profile' ? 'active' : ''}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button
          className={activeTab === 'password' ? 'active' : ''}
          onClick={() => setActiveTab('password')}
        >
          Change Password
        </button>
        <button
          className={activeTab === 'permissions' ? 'active' : ''}
          onClick={() => setActiveTab('permissions')}
        >
          Permissions
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'profile' && (
          <div className="profile-settings">
            <h2>Profile Settings</h2>
            <form>
              <input type="text" placeholder="Full Name" defaultValue="John Doe" />
              <input type="email" placeholder="Email" defaultValue="john@example.com" />
              <input type="tel" placeholder="Phone" defaultValue="(123) 456-7890" />
              <input type="file" accept="image/*" />
              <button type="submit">Update Profile</button>
            </form>
          </div>
        )}

        {activeTab === 'password' && (
          <div className="password-settings">
            <h2>Change Password</h2>
            <form>
              <input type="password" placeholder="Current Password" />
              <input type="password" placeholder="New Password" />
              <input type="password" placeholder="Confirm New Password" />
              <button type="submit">Change Password</button>
            </form>
          </div>
        )}

        {activeTab === 'permissions' && (
          <div className="permissions-settings">
            <h2>Role & Permissions</h2>
            <p>Manage user roles and permissions (Admin only)</p>
            {/* TODO: Add role management UI */}
          </div>
        )}
      </div>
    </div>
  )
}

export default Settings

