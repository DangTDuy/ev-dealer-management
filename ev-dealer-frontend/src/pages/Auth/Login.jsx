/**
 * Login Page
 * TODO: Implement login form with email/password
 * - Email input
 * - Password input
 * - Remember me checkbox
 * - Login button
 * - Link to Register and Forgot Password
 */

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Call login API
    console.log('Login:', { email, password })
  }

  return (
    <div className="login-page">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      <div className="links">
        <Link to="/register">Create account</Link>
        <Link to="/forgot-password">Forgot password?</Link>
      </div>
    </div>
  )
}

export default Login

