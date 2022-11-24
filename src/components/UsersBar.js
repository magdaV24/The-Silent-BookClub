import './UsersBar.css'
import React from 'react'
import Avatar from './Avatar'
import { useCollection } from '../hooks/useCollection'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEarthEurope } from '@fortawesome/free-solid-svg-icons'

export default function UsersBar() {
    const { error, documents } = useCollection('users')

  return (
    <div className='users-list'>
        {error && <p>{error}</p>}
        {documents && documents.map((user) => (
            <div key={user.id} className='user'>
                <div className='user-name'>
                { user.online && <FontAwesomeIcon icon={faEarthEurope} className='icon online'/> }
                { !user.online && <FontAwesomeIcon icon={faEarthEurope} className='icon offline'/> }
                <span>{user.displayName}</span>
                </div>
                <Avatar src={user.photoURL} />
            </div>
        ))}
    </div>
  )
}
