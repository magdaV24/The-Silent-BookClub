import { useReducer, useEffect, useState } from "react";
import { projectFirestore, timestamp } from "../firebase/config";

let initialState = {
    document: null,
    isPending: false,
    error: null,
    success: null
}

const firestoreReducer = (state, action) => {
    switch(action.type){
        case 'IS_PENDING':
            return { isPending: true }
        case 'ADDED_DOCUMENT':
            return { isPending: false, document: action.payload, success: true, error: null }
        case 'DELETED_DOCCUMENT':
            return { isPending: false, document: null, success: true, error: null }
        case 'ERROR':
            return { isPending: false, document: null, success: false, error: action.payload }  
        case 'UPDATED_DOCUMENT':
            return{ isPending: false, document: action.payload, success: true, error: null }  

        default:
            return state
    }
}

export const useFirestore = (collection) => {

    const [response, dispatch] = useReducer(firestoreReducer, initialState)
    const [isCancelled, setIsCancelled] = useState(false)

    const ref = projectFirestore.collection(collection)

    const dispatchIfNotCancelled = (action) => {
        if(!isCancelled){
            dispatch(action)
        }
    }


    const addDocument = async (doc) => {
        dispatch({ type: 'IS_PENDING' })

        try{
            const createdAt = timestamp.fromDate(new Date())
            const addedDocs = await ref.add({ ...doc, createdAt })
            dispatchIfNotCancelled({ type: 'ADDED_DOCUMENT', payload: addedDocs })
        }
        catch(err){
            dispatchIfNotCancelled({ type: 'ERROR', payload: err.message })
        }
    }

    
    const deleteDocument = async (id) =>{
        dispatch({ type: 'IS_PENDING' })

        try{
            await ref.doc(id).delete()
            dispatchIfNotCancelled({ type: 'DELETED_DOCUMENT'})
        }
        catch(err){
            dispatchIfNotCancelled({ type: 'ERROR', payload: 'Could not delete this document!'})
        }
    }

    const updateDocument = async (id, updates) =>{
        dispatch({ type: 'IS_PENDING' })

        try {
            const updatedDocument = await ref.doc(id).update(updates)
            dispatchIfNotCancelled({ type: 'UPDATED_DOCUMENT', payload: updatedDocument})
            return updatedDocument
        }
        catch(err){
            dispatchIfNotCancelled({ type: 'ERROR', payload: err.message })
            return null
        }
    }


   
    useEffect(() => {
        return () => setIsCancelled(true)
    },[])

    return { addDocument, deleteDocument, updateDocument, response}
}
    
