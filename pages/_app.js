import Navbar from '../comopnents/Navbar'
import '../styles/globals.css'
import { Toaster } from 'react-hot-toast'
import { UserContext } from '../lib/context'
import { useUserData } from '../lib/hooks'

function MyApp({ Component, pageProps }) {
  const userData = useUserData()
  return (
    <UserContext.Provider value={userData}>
      <Toaster position="bottom-right" />
      <Navbar />
      <Component {...pageProps} />
    </UserContext.Provider>
  )
}

export default MyApp
