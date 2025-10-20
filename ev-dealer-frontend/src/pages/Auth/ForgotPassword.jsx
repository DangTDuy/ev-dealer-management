/**
 * Forgot Password Page
 * TODO: Implement password reset request form
 * - Email input
 * - Send reset link button
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Call forgot password API
    console.log('Reset password for:', email)
  }

  return (
    <div className="forgot-password-page">
      <h2>Forgot Password</h2>
      <p>Enter your email to receive a password reset link</p>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Send Reset Link</button>
      </form>
      <div className="links">
        <Link to="/login">Back to Login</Link>
      </div>
    </div>
  )
}

export default ForgotPassword

