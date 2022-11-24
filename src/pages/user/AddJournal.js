import './AddJournal.css'

import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { useFirestore } from '../../hooks/useFirestore'
import { useAuthContext } from '../../hooks/useAuthContext'

export default function AddJournal() {

    const [date, setDate] = useState('')
    const [notes, setNotes] = useState('')
    const [quote, setQuote] = useState('')
    const [quoteList, setQuoteList] = useState([])
    const quoteInput = useRef(null)

    const { user } = useAuthContext()

    const { addDocument, response } = useFirestore('journal-entries')

    const handleSubmit = (e) => {
        e.preventDefault()
        const createdBy = user.displayName
        addDocument({ date, notes, quoteList, createdBy })
        console.log(createdBy)
    }

    const handleClick = (e) => {
        e.preventDefault()
        const qt = quote.trim()

        if(qt && !quoteList.includes(qt)){
            setQuoteList(prevQuoteList => [...prevQuoteList, qt])
        }

        setQuote('')
        quoteInput.current.focus()

    }

    useEffect(() => {
        if(response.success){
            setDate('')
            setNotes('')
        }
    },[response.success])

  return (
    <div className='add-journal'>
        <form className='journal-form' onSubmit={handleSubmit}>
            
            <h2>Write down your thoughts here!</h2>

            <label>
                <span>Date</span>
                <input 
                    type='date'
                    onChange={(e) => setDate(e.target.value)}
                    value={date}
                >
                </input>
            </label>

            <label>
                <span>Your thoughts</span>
                <textarea onChange={(e) => setNotes(e.target.value)} value={notes}>
                </textarea>
            </label>

            <label>
                <span>Add quotes</span>
                <textarea onChange={(e) => setQuote(e.target.value)}
                     value={quote}
                     ref={quoteInput}>
                </textarea>
                <button onClick={handleClick}>Add quote</button>
            </label>

            <button>Add to Journal!</button>
        </form>
    </div>
  )
}
