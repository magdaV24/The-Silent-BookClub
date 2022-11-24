import { useState, useEffect } from "react"
import { projectAuth, projectStorage, projectFirestore } from '../firebase/config'
import { useAuthContext } from './useAuthContext'

export const useSignin = () => {

    const [isCanceled, setIsCanceled] = useState(false)
    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const { dispatch } = useAuthContext()

    const signin = async (email, password, displayName, picture) => {

        //username, photo for a profile are props that firebase auth. allows us to add

        setError(null)
        setIsPending(true)

        try {
            //sign up user
            const res = await projectAuth.createUserWithEmailAndPassword(email, password)


            if (!res) {
                throw new Error('Could not complete Sign Up!')
            }

            //upload the user's profile picture
            const uploadPath = `picture/${res.user.uid}/${picture.name}`
            const img = await projectStorage.ref(uploadPath).put(picture)
            const imgURL = await img.ref.getDownloadURL()
            // add username 

            await res.user.updateProfile({ displayName, photoURL: imgURL })

            //create user document

            await projectFirestore.collection('users').doc(res.user.uid).set({
                online: true,
                displayName,
                photoURL: imgURL
            })

            //dispatch login action:

            dispatch({ type: 'LOGIN', payload: res.user })

            if (!isCanceled) {
                setIsPending(false)
                setError(null)
            }
        }

        catch (err) {
            if (!isCanceled) {
                console.log(err.message)
                setError(err.message)
                setIsPending(false)
            }
        }

    }

    useEffect(() => {
        return () => setIsCanceled(true)
    }, [])

    return { error, isPending, signin }
}
    
