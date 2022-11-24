import './Signin.css'

import React, { useState } from 'react'
import { useSignin } from '../../hooks/useSignin'
import { Link } from 'react-router-dom'

export default function Signin() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [photo, setPhoto] = useState(null)
  const [photoError, setPhotoError] = useState(null)
  const { signin, error, isPending } = useSignin('')

  const handleSubmit = (e) => {
    e.preventDefault()
    signin(email, password, displayName, photo)
  }

  const handleFileChange = (e) => {
    setPhoto(null)

    let pfp = e.target.files[0]

    if(!pfp){
      setPhotoError('Choose a profile picture!')
      return
    }

    if(!pfp.type.includes('image')){
      setPhotoError('Choose an image as your profile picture!')
      return
    }

    if(pfp.size > 100000){
      setPhotoError('Choose a smaller sized image!')
      return
    }

    setPhotoError(null)
    setPhoto(pfp)
  }

  

  return (
    <form onSubmit={handleSubmit} className='signin-form'>

      <h2>Signin</h2>

      <div className='user-info'>
      <label>
        <input
          type='email'
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          className='user-input'
          required
        />
        <span className='user-span'>E-mail</span>
      </label>

      <label>
        <input
          type='password'
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          className='user-input'
          required
        />
        <span className='user-span'>Password</span>
      </label>

      <label>
        <input
          type='text'
          onChange={(e) => setDisplayName(e.target.value)}
          value={displayName}
          className='user-input'
          required
        />
        <span className='user-span'>Username</span>
      </label>
      </div>

      <label className='profile-picture'>
        <span>Profile picture</span>
        <input
          type='file'
          required
          onChange={handleFileChange}
        />
      </label>

      <div className='text'>
        <small>Already have an account?</small>
        <small><Link to='./login'>Log in</Link></small>
      </div>

      <div className='terms'>
        <input type='checkbox' required/>
        <span className='terms-span'>By clicking here, I state that I have read and understood the terms and conditions.</span>
      </div>

      {!isPending && <button>Create Account</button>}
      {isPending && <button disabled>Creating your account...</button>}
      {error && <p>{error}</p>}
      {photoError && <p>{error}</p>}
    </form>
  )
}

