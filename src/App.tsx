import './App.css'
import Header from './Components/Header'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { refreshAccessToken } from './store/auth'
import { useSelector } from 'react-redux'
import { AppDispatch } from './store/index'

interface State {
  auth: {
    accessToken: string;
    isAuth: boolean;
    user: {
      firstName: string;
    };
  };
}

const url = import.meta.env.VITE_BACKEND_URL;


function App() {
  const authState = useSelector((state: State) => state.auth)
  const dispatch = useDispatch<AppDispatch>();
  const [foundUser, setFoundUser] = useState<boolean>(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${url}/db/user`,
          {
            headers: {
              Authorization: `Bearer ${authState.accessToken}`
            }
          }
        );
        setFoundUser(true)
        console.log(res)
      } catch (err) {
        setFoundUser(false);
        console.log(err);
      }
    }

    if (authState.accessToken == null && !authState.isAuth) {
      dispatch(refreshAccessToken(url));
    }
    if (authState.isAuth) {
      fetchData();
    }

  }, [dispatch, authState.accessToken, authState.isAuth, setFoundUser]);




  return (
    <>
      <Header authState={authState} />
      {authState.isAuth && !foundUser ? <p>Get Started! Start tracking now!</p> : authState.isAuth && foundUser ? < p > Here is your data</p > : null}
    </>

  )
}

export default App;
