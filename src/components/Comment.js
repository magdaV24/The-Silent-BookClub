import './CommentForm.css'
import React, { useState } from 'react'
import Avatar from './Avatar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReply, faSquarePen, faThumbsDown, faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import CommentForm from './CommentForm'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { useFirestore } from '../hooks/useFirestore'
import { useCollection } from '../hooks/useCollection'

const EditBox = ( {comment} ) => {


    return (
        <form className='edit-box'>
            <textarea>
                {comment.content}
        </textarea>
        <button>Edit Comment!</button>
        </form>
    )
}

const Comment = ({ comment }) => {

    const { updateDocument } = useFirestore('event-list')
    const { documents } = useCollection('event-list')


    const [isReplaying, setIsReplaying] = useState(false)
    const [isEditing, setIsEditing] = useState(false)

    const giveLike = async (e) =>{
        e.preventDefault()

        let like = comment.likes

         await updateDocument(comment.id, {
            likes: like + 1
         })

         console.log(comment.likes)

    }


    return (
        <div className='box'>
            <div key={comment.id}>
                <li className='comment'>
                    <div className='user'>
                        <Avatar src={comment.photoURL} />
                        <p>{comment.displayName}</p>
                    </div>
                    <div className='comment-date'>
                        <p>{formatDistanceToNow(comment.createdAt.toDate(), { addSuffix: true })}</p>
                    </div>
                    <div className='content'>
                        <p>{comment.content}</p>
                    </div>
                    <div className='buttons'>
                        <div className='actions'>
                            <button className="replay" onClick={() => setIsReplaying(prev => !prev)}><FontAwesomeIcon icon={faReply} /></button>
                            <button className="edit" onClick={() => setIsEditing(prev => !prev)}><FontAwesomeIcon icon={faSquarePen} /></button>
                        </div>
                        <div className='reactions'>
                            <div className='like'>
                                <button className='like_btn' onClick={giveLike}><FontAwesomeIcon icon={faThumbsUp} /></button>
                                <div className='likes'>{comment.likes}</div>
                            </div>
                            <div className='like'>
                                <button className='dislike_btn'><FontAwesomeIcon icon={faThumbsDown} /></button>
                                <div className='dislikes'>{comment.dislikes}</div>
                            </div>
                        </div>
                    </div>
                </li>
                <div className='reply-box'>
                    {isReplaying && (
                        <CommentForm parentId={comment.id} project={documents} parentComment={comment} />
                    )}
                </div>

                <div className='editing-box'>
                    {isEditing && (
                        <EditBox comment={comment} project={comment}/>
                    )}
                </div>

            </div>
        </div>
    )
}


export default Comment