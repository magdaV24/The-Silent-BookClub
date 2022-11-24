import './Login.css'
import React, { useState } from 'react'
import { useLogin } from '../../hooks/useLogin'
import { Link } from 'react-router-dom'

export default function Login() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, error, isPending } = useLogin()

  const handleSubmit = (e) => {
    e.preventDefault()
    login(email, password)
  }
  return (
    <form onSubmit={handleSubmit} className='login-form'>

      <h2>Sign in</h2>

      <label>
        <input
          type='email'
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
        />
        <span>E-mail</span>
      </label>

      <label>
        <input
          type='password'
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          required
        />
        <span>Password</span>
      </label>

      <div className='text'>
        <small>Don't have an account?</small>
        <small><Link to='./signin'>Sign up</Link></small>
      </div>

      {!isPending && <button>Log in</button>}
      {isPending && <button disabled>Loading...</button>}
      {error && <p>{error}</p>}
    </form>
  )
}
