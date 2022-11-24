import { useEffect, useState } from "react"
import { projectAuth, projectFirestore } from '../firebase/config'
import { useAuthContext } from './useAuthContext'

export const useLogout = () => {

    const [isCanceled, setIsCanceled] = useState(false)
    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const { dispatch, user } = useAuthContext()

    const logout = async () => {

        setError(null)
        setIsPending(true)
        
        try {

            const { uid } = user

            await projectFirestore.collection('users').doc(uid).update({online: false})

            await projectAuth.signOut()

            // dispatch logout action

            dispatch({ type: 'LOGOUT' })

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

    return { logout, error, isPending }
}
    
