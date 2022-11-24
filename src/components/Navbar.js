import'./Navbar.css'
import { Link} from 'react-router-dom'
import{ useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext'
import React from 'react'
import Avatar from './Avatar'


export default function Navbar() {

  const { logout } = useLogout()
  const { user } = useAuthContext()



  return (
    <nav className='navbar'>
      <ul>
        <li className='site-name'><Link to="/home" target='_blank'>A Silent Bookclub</Link></li>
        <div className='buttons'>
          
          {!user && 
          (
          <>
          <li><Link to="/login" target='_blank'>Login</Link></li>
          <li><Link to="/signin" target='_blank'>Signin</Link></li>
          <li><Link to="/about" target='_blank'>About</Link></li>
          <li><Link to="/contact" target='_blank'>Contact</Link></li>
          </>
          )}
          
          {user && (
            <>
            <li><button onClick={logout} className='btn'>Logout</button></li>
            <li><Link to="/user" target='_blank'>User</Link></li>
            <li><Link to="/about" target='_blank'>About</Link></li>
            <li><Link to="/contact" target='_blank'>Contact</Link></li>
            <li><Link to='/user' target='_blank' className='username'>Welcome, {user.displayName}</Link></li>
            <Avatar src={user.photoURL}/>
            </>
          )}
        </div>
      </ul>
    </nav>
  )
}
