/* eslint-disable no-loop-func */
import React from 'react'
import { useState } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'
import './CommentForm.css'
import { useFirestore } from '../hooks/useFirestore'
import { timestamp } from '../firebase/config'

export default function CommentForm({ project, parentId, parentComment }) {

    const [comm, setComm] = useState('')
    const { user } = useAuthContext()
    const { updateDocument,  response } = useFirestore('event-list')
  

    const submitComment = async (e) => {
        e.preventDefault()

        let newComment = {
            displayName: user.displayName,
            photoURL: user.photoURL,
            content: comm,
            createdAt: timestamp.fromDate(new Date()),
            parentId: parentId || null,
            id: Math.random(),
            children: [],
            likes: 0,
            dislikes: 0
        }

        if (parentId == null) {
            await updateDocument(project.id, {
                comments: [ ...project.comments, newComment ]
            })
        } else {
            await updateDocument(project.id, {
                children: [ ...parentComment.children, newComment ]
            })
        }

       

        if (!response.error) {
            setComm('')
        }


    }

    return (
        <form className='comment-form' onSubmit={submitComment}>
            <label>
                <textarea
                    required
                    onChange={(e) => setComm(e.target.value)}
                    value={comm}
                >
                </textarea>
            </label>
            <button>Add Comment!</button>
        </form>
    )
}
