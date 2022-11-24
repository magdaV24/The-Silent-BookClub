import './CommentForm.css'
import React from 'react'
import Comment from './Comment'

export default function Comments({document}) {

    
    return (
        <div>
            {document.comments && document.comments.map((comment) =>(
                <Comment comment = {comment} key={comment.id}/>
            ))}
        </div>
    )
}
