/**
 * Auth Layout - For Login, Register, Forgot Password pages
 * TODO: Implement centered layout for authentication pages
 */

import { Outlet } from 'react-router-dom'

const AuthLayout = () => {
  return (
    <div className="auth-layout">
      <div className="auth-container">
        <div className="auth-header">
          <h1>EV Dealer Management</h1>
        </div>
        <Outlet />
      </div>
    </div>
  )
}

export default AuthLayout

