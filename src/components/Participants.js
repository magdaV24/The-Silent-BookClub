import './Participants.css'
import React, { useState } from 'react'
import { useFirestore } from '../hooks/useFirestore'
import { useAuthContext } from '../hooks/useAuthContext'
import Avatar from './Avatar'

export default function Participants( { event } ) {

    const { updateDocument, response } = useFirestore('event-list')
    const [participants, setParticipants] = useState([])
    const { user } = useAuthContext()

    
    const participate = async (e) =>{
        e.preventDefault()

    const newParticipant = {
      displayName: user.displayName,
      photoURL: user.photoURL,
      id: user.uid
    }

    let ids = [];

    event.participants.map((participant) => (
      ids.push(participant.id)
    ))
    
    console.log(ids)

      if(newParticipant && !ids.includes(newParticipant.id)){
        await updateDocument( event.id, {
          participants: [ ...event.participants, newParticipant]
        })
      } else {
        return
      }

      if(!response.error){
        setParticipants('')
      }

      return participants
      
    }

  return (
    <div className='participants'>
        <div className='participants-bar'>
            {event.participants && event.participants.map((participant) => (
                <div className='user-box' key={Math.random(0, 2000).toString()}>
                    {participant.displayName}
                    <Avatar src={participant.photoURL} />
                </div>
            ))}
        </div>
        
        <button onClick={participate}>Participate!</button>
    </div>
  )
}
