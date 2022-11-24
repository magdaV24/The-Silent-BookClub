import './Events.css'

import React  from 'react'
import Sidebar from '../../components/Sidebar'
import UsersBar from '../../components/UsersBar'
import { useCollection } from '../../hooks/useCollection'
import { Link } from 'react-router-dom'

export default function Events() {

  const { documents, error } = useCollection('event-list')

  return (
    <div className='events-page'>
        <Sidebar />
        <div className='added-events'>
            {error && <p>{error}</p>}
            {documents && documents.map((event) => (
              <div key={event.id} className='event'>
                <div className='title'>
                <h2>{event.title} by<span>{event.author}</span></h2>
                <div className='tags'>
                  {event.tagsList.map((tag) => (
                    <p  key={Math.random().toString()}>{tag.genere}</p>
                  ))}
                </div>
                </div>
                <div>{event.participants && event.participants.length} users will participate in this event!</div>
                <div className='created-by'>
                <h4>This event was created by: </h4>
                {event.createdBy.map(({id, displayName}) => (
                   <h4 key={id + Math.random().toString()}>
                     {displayName}
                   </h4>
                ))}
                </div>
                <div className='date'>Discussions will take place {event.date.toDate().toString().slice(0, 15)}. Join us!</div>
                <div className='description'>Why was this book chosen? <span>{event.description}</span></div>
                <Link to={`/event/${event.id}`} className='button'>Read More!</Link>
          </div>
              
            ))}
            <Link to='/addevent' className='btn'>Suggest an event!</Link>
        </div>

        <UsersBar />
    </div>

  )
}
