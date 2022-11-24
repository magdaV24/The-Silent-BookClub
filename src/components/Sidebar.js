import './Sidebar.css'
import React from 'react'
import { Link } from 'react-router-dom'

export default function Sidebar() {
    return (
        <nav className='sidebar'>
            <ul>
                <li><Link to='/journal'>Journal</Link></li>
                <li><Link to='/events'>Events</Link></li>
            </ul>
        </nav>
    )
}
