import './App.css'
import logo from './assets/logo.png'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Login from './Components/Login'
import { refreshAccessToken } from './store/user'

const url = import.meta.env.VITE_BACKEND_URL

interface State {
  auth: {
    accessToken: string;
    user: {
      firstName: string;
    };
  };
}


function App() {
  const auth = useSelector((state: State) => state.auth)
  const dispatch = useDispatch()
  console.log(auth)

  useEffect(() => {
    if (!auth.accessToken) {
      dispatch(refreshAccessToken(url))
    }
  })

  useEffect(() => {
    // Perform any side effects or actions when auth changes
    if (auth.accessToken) {
      // console.log('User is logged in')
    }
  }, [auth])

  const handleClick = () => {
    try {
      fetch(`${url}/test`, {
        method: 'GET',
      }).then((response) => {
        console.log(response)
      }
      ).then((data) => {
        console.log(data)
      }
      )
    } catch (error) {
      console.error('Error:', error
      )
    }
  }

  return (
    <>
      <img className="logo" src={logo} alt="logo" />
      <h1>Health Tracker</h1>
      {!auth.accessToken ? (
        <div>
          <Login />
        </div>
      ) : (
        <div>
          <h2>Welcome back {auth.user.firstName}!</h2>
        </div>
      )}
      {auth.accessToken && (
        <>
          <button
          >
            Logout
          </button>
        </>
      )}
      <button onClick={handleClick}>test me</button>
    </>
  )
}

export default App;
