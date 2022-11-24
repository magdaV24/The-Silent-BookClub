import './EventForm.css'
import React, { useEffect, useRef, useState } from 'react'
import Select from 'react-select'
import { timestamp } from '../../firebase/config'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useFirestore } from '../../hooks/useFirestore'
import { useHistory } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'


const genere = [
    {value: 'classic', label: 'Classic'},
    {value: 'adventure', label: 'Adventure'},
    {value: 'romance', label: 'Romance'},
    {value: 'horror', label: 'Horror'},
    {value: 'thriller', label: 'Thriller'},
    {value: 'poetry', label: 'Poetry'},
    {value: 'fantasy', label: 'Fantasy'},
    {value: 'philosophy', label: 'Philosophy'},
    {value: 'history', label: 'History'},
    {value: 'modern-classic', label: 'Modern Classic'},
    {value: 'retelling', label: 'Retelling'},
    {value: 'contemporary', label: 'Contemporary'}
]

export default function EventForm() {

    const { user } = useAuthContext()

    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [date, setDate] = useState('')
    const [description, setDescription] = useState('')
    const [tags, setTags] = useState([])
    const participants = []
    const [fact, setFact] = useState('')
    const [factList, setFactList] = useState([])
    const factInput = useRef(null)

    const { addDocument, response } = useFirestore('event-list')

    const [error, setError] = useState(null)

    const history = useHistory()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)

        if(tags.length < 1){
            setError('Choose at least one genere!')
            return
        }

        const createdBy = [
            { displayName: user.displayName },
            { photoURL: user.photoURL },
            { id: user.uid }
        ]

        const tagsList = tags.map((tag) => {
            return {
                genere: tag.value
            } 
        })

        const event = {
            title, 
            author,
            date: timestamp.fromDate(new Date(date)),
            description,
            tagsList,
            createdBy,
            participants,
            factList,
            comments: []
        }
        
        await addDocument(event)
        console.log(event)

        if(!response.error){
            history.push('/events')
        }

    }

    
    const handleClick = (e) => {
        e.preventDefault()
        const newFact =  fact.trim()

        if( newFact && !factList.includes(newFact)){
            setFactList(prevFactsList => [...prevFactsList, newFact])
        }

        setFact('')
        factInput.current.focus()
    }

    useEffect(() => {
        if(response.success){
            setTitle('')
            setAuthor('')
            setDate('')
            setDescription('')
            setTags([])
        }
    }, [response.success])

    
  return (
    <div className='add-event'>
        <Sidebar />
        <form className='event-form' onSubmit={handleSubmit}>

            <h2>Create an Event:</h2>

            <label>
                <span>The book's title:</span>
                <input
                    type='text'
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                    required 
                    />
            </label>

            <label>
                <span>The book's author:</span>
                <input
                    type='text'
                    onChange={(e) => setAuthor(e.target.value)}
                    value={author}
                    required 
                    />
            </label>

            <label>
                <span>The event's date:</span>
                <input
                    type='date'
                    onChange={(e) => setDate(e.target.value)}
                    value={date}
                    required 
                    />
            </label>

            <label className='description'>
                <span>Add a description of the book:</span>
                <textarea
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                    required 
                    >
                </textarea>
            </label>

            <label className='tags'>
                <span>Select the book's genere(s):</span>
                <Select 
                    onChange={(option) => setTags(option)}
                    options={genere}
                    isMulti
                    className='select'
                    placeholder='Select the generes'
                    />
            </label>

            <div className='fun-fact-box'>
                <span>Add some fun facts! <br></br>
                <small>Adding a few fun facts about the book you have chosen could determine someone to join this event! <br></br>You can start by adding the year your book of choice was published, but the more inetresting your information is, the more discussions it will create!</small>
                </span>
                <textarea onChange={(e) => setFact(e.target.value)}
                     value={fact}
                     ref={factInput}>
                </textarea>
                <button onClick={handleClick}>Add fun fact!</button>
            </div>

            <button>Create Event!</button>
            {error && <p>{error}</p>}
        </form>
    </div>
  )
}
