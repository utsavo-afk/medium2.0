import { auth, googleAuthProvider } from '../lib/firebase'
import toast from 'react-hot-toast'
import { useCallback, useContext, useState, useEffect } from 'react'
import { UserContext } from '../lib/context'
import debounce from 'lodash.debounce'
import { firestore } from '../lib/firebase'
import Metatags from '../comopnents/Metatags'

const EnterPage = () => {
  const { user, username } = useContext(UserContext)
  return (
    <>
      <Metatags title="Signup Page" />
      <main>{user ? username ? <SignOutButton /> : <UsernameForm /> : <SignInButton />}</main>
    </>
  )
}

// sign in with google
function SignInButton() {
  const signInWithGoogle = async () => {
    try {
      await auth.signInWithPopup(googleAuthProvider)
    } catch (error) {
      toast.error('Could not sign in.')
    }
  }

  return (
    <button className="btn-google" onClick={signInWithGoogle}>
      <img src="/google.png" alt="google logo" /> Sign In
    </button>
  )
}

// sign out
function SignOutButton() {
  return <button onClick={() => auth.signOut()}>Sign Out</button>
}

function UsernameForm() {
  const { user, username } = useContext(UserContext)
  const [formValue, setFormValue] = useState('')
  const [isValid, setIsValid] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async event => {
    event.preventDefault()

    // Create refs for both documents
    const userDoc = firestore.doc(`users/${user.uid}`)
    const usernameDoc = firestore.doc(`usernames/${formValue}`)

    // Commit both docs together as a batch write.
    const batch = firestore.batch()
    batch.set(userDoc, { username: formValue, photoURL: user.photoURL, displayName: user.displayName })
    batch.set(usernameDoc, { uid: user.uid })

    try {
      await batch.commit()
    } catch (error) {
      // handle error show toast
    }
  }

  const onChange = event => {
    // Force form value typed in form to match correct format
    const val = event.target.value.toLowerCase()
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/

    // Only set form value if length is < 3 OR it passes regex
    if (val.length < 3) {
      setFormValue(val)
      setIsLoading(false)
      setIsValid(false)
    }

    if (re.test(val)) {
      setFormValue(val)
      setIsLoading(true)
      setIsValid(false)
    }
  }

  useEffect(() => {
    checkUsername(formValue)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValue])

  // Hit the database for username match after each debounced change
  // useCallback is required for debounce to work
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checkUsername = useCallback(
    debounce(async username => {
      if (username.length >= 3) {
        const ref = firestore.doc(`usernames/${username}`)
        const { exists } = await ref.get()
        console.log('Firestore read executed!')
        setIsValid(!exists)
        setIsLoading(false)
      }
    }, 500),
    [],
  )

  return (
    !username && (
      <section>
        <h3>Choose Username</h3>
        <form onSubmit={onSubmit}>
          <input name="username" placeholder="myname" value={formValue} onChange={onChange} />
          <UsernameMessage username={formValue} isValid={isValid} loading={isLoading} />
          <button type="submit" className="btn-green" disabled={!isValid}>
            Choose
          </button>

          <h3>Debug State</h3>
          <div>
            Username: {formValue}
            <br />
            Loading: {isLoading.toString()}
            <br />
            Username Valid: {isValid.toString()}
          </div>
        </form>
      </section>
    )
  )
}

function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return <p>Checking...</p>
  } else if (isValid) {
    return <p className="text-success">{username} is available!</p>
  } else if (username && !isValid) {
    return <p className="text-danger">That username is taken!</p>
  } else {
    return <p></p>
  }
}
export default EnterPage
