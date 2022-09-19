import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/storage'
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBk1clOkA3sxp_qrDlq1qxTBgKb8wlTwho',
  authDomain: 'fir-545e4.firebaseapp.com',
  projectId: 'fir-545e4',
  storageBucket: 'fir-545e4.appspot.com',
  messagingSenderId: '974517767626',
  appId: '1:974517767626:web:e10ee272c5cc3498ee9333',
  measurementId: 'G-1HB7N2H10B',
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

const auth = firebase.auth()
const firestore = firebase.firestore()
const storage = firebase.storage()
const googleAuthProvider = new firebase.auth.GoogleAuthProvider()

// helpers
const getUserByUsername = async username => {
  const usersRef = firestore.collection('users')
  const query = usersRef.where('username', '==', username).limit(1)
  const userDoc = (await query.get()).docs[0]
  return userDoc
}

// convert any non serializable doc data like firestore timestamps
const postToJSON = doc => {
  const data = doc.data()

  return {
    ...data,
    createdAt: data?.createdAt.toMillis() || 0,
    updatedAt: data?.updatedAt.toMillis() || 0,
  }
}

const fromMillis = firebase.firestore.Timestamp.fromMillis
const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp
const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED
const increment = firebase.firestore.FieldValue.increment

export {
  auth,
  firestore,
  storage,
  googleAuthProvider,
  getUserByUsername,
  postToJSON,
  fromMillis,
  serverTimestamp,
  STATE_CHANGED,
  increment,
}
