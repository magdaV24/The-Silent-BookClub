import './Journal.css'

import React from 'react'
import Sidebar from '../../components/Sidebar'
import { useCollection } from '../../hooks/useCollection'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faQuoteLeft, faQuoteRight } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { useAuthContext } from '../../hooks/useAuthContext'
import Navbar from '../../components/Navbar'

export default function Journal() {

  const { user } = useAuthContext()

  const { documents, error } = useCollection('journal-entries', [
    'createdBy', '==', user.displayName
  ])

 
  
  return (
    <>
    <Navbar />
    <div className='journal-page'>
      <Sidebar />
      <Link to='/addjournal' className='btn'>Add to your journal!</Link>
      <div className='added-entries'>
        {error && <p>{error}</p>}
        {documents && documents.map((entry) => (
          <div key={entry.id} className='entry'>
            <p className='date'>{entry.date}</p>
            <p className='notes'>{entry.notes}</p>
            {entry.quoteList && entry.quoteList.map((quote) => (
              <div className='quote-box'>
                <FontAwesomeIcon icon={faQuoteLeft} className='icon'/>
                {quote}
                <FontAwesomeIcon icon={faQuoteRight} className='icon'/>
                <br></br>
              </div>
            ))}
          </div>
          
        ))}
      </div>
    </div>
    </>
  )
}
