import'./Navbar.css'
import { Link} from 'react-router-dom'
import{ useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext'
import React from 'react'
import Avatar from './Avatar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faArrowAltCircleRight, faEnvelope } from '@fortawesome/free-regular-svg-icons'
import { faBook } from '@fortawesome/free-solid-svg-icons'
import { useCollection } from '../hooks/useCollection'

export default function Navbar() {
  const { logout } = useLogout()
  const { user } = useAuthContext()

  const { documents, error } = useCollection("notifications", [
    "notificationTo",
    "==",
    user.displayName
  ]);

  const len = documents && Object.keys(documents).length

  return (
    <nav className='navbar'>
      {error && {error}}
      <ul>
        <li className='site-name'><Link to="/home" target='_blank'>A Silent Bookclub</Link></li>
        <div className='buttons'>
          
          {!user && 
          (
          <>
          <li><Link to="/login" target='_blank'><FontAwesomeIcon icon={faBook}/></Link></li>
          </>
          )}
          
          {user && (
            <>
            <li><button onClick={logout} className='btn'><FontAwesomeIcon icon={faArrowAltCircleRight} /></button></li>
            <li><Link to="/user" target='_blank'><FontAwesomeIcon icon={faUser}/></Link></li>
            <li><Link to='/notifications' target='_blank'><FontAwesomeIcon icon={faEnvelope}/>{Number(len) > 0 && <div className='icon'>{len}</div>}</Link></li>
            <Avatar src={user.photoURL}/>
            </>
          )}
        </div>
      </ul>
    </nav>
  )
}
