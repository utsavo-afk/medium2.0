import { useAuthState } from 'react-firebase-hooks/auth'
import { useEffect, useState } from 'react'
import { auth, firestore } from './../lib/firebase'
function useUserData() {
  const [user] = useAuthState(auth)
  const [username, setUsername] = useState(null)

  // to subscribe and listen to user doc
  useEffect(() => {
    // turn off realtime subscription to doc
    let unsubscribe
    if (user) {
      const userRef = firestore.collection('users').doc(user.uid)
      unsubscribe = userRef.onSnapshot(doc => {
        setUsername(doc.data()?.username)
      })
    } else {
      setUsername(null)
    }
    return unsubscribe
  }, [user])
  return { user, username }
}

export { useUserData }
