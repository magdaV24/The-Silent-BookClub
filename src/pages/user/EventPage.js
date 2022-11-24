import './EventPage.css'
import React from 'react'
import { useParams } from 'react-router-dom'
import { useDocument } from '../../hooks/useDocument'
import Participants from '../../components/Participants'
import Sidebar from '../../components/Sidebar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenFancy } from '@fortawesome/free-solid-svg-icons'
import CommentForm from '../../components/CommentForm'
import Comments from '../../components/Comments'



export default function EventPage() {

    const { id } = useParams()
    const { error, document } = useDocument('event-list', id)

    if(error){
        return <p>{error}</p>
    }

    if(!document){
        return <p>Loading document...</p>
    }

  return (
    <div className='body'>
        <Sidebar />

        <div className='event-page'>
            <div className='header'>
                <div className='title'>
                    <span className='bold'>{document.title} by</span>
                    <span className='inclined'>{document.author}</span>
                </div>
                <div className='tags inclined'>
                  {document.tagsList.map((tag) => (
                    <p  key={Math.random()}>{tag.genere}</p>
                  ))}
                </div>
                <div className='user'>This book was suggested by:  
                {document.createdBy.map(({id, displayName}) => (
                   <p key={Math.random()}>
                     {displayName}
                   </p>
                ))}
                </div>
            </div>

            <div className='participants'>
                <Participants event={document}/>
            </div>

            <div>
                <p>A short description of {document.title}: {document.description}</p>
            </div>

            <div>
                In addition to the synopsis for this book, here are some interesting facts about it:
                <div>
                    {document.factList.map((fact) => (
                        <div key={Math.random()} className="fact-list">
                            <li><FontAwesomeIcon icon={faPenFancy} />{fact}</li>
                        </div>
                        ))}
                </div> 
            </div>

            <div>Rules of conduct!</div>


            <div>
                <h4>Discussions take place below:</h4>
                <CommentForm parentId={null} project={document} parentComment={null}/>
                <Comments document={document} />
            </div>

        </div>
       
        
    </div>
  )
}
