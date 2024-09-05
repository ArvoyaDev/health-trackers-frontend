import './App.css'
import Header from './Components/Header'
import CreateTracker from './Components/CreateTracker'
import Logger from './Components/Logger'
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
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${url}/db/user`,
          {
            headers: {
              Authorization: `Bearer ${authState.accessToken}`
            }
          }
        );
        console.log(res.data);
        setFoundUser(true);
      } catch (err) {
        console.log(err);
        setFoundUser(false);
      } finally {
        setLoading(false);
      }
    }

    if (authState.accessToken == null && !authState.isAuth) {
      dispatch(refreshAccessToken(url));
    }
    if (authState.isAuth) {
      fetchData();
    } else {
      setLoading(false);
    }

  }, [dispatch, authState.accessToken, authState.isAuth, setFoundUser]);

  return (
    <>
      <Header authState={authState} />
      {loading ? <p>Loading...</p> : authState.isAuth && !foundUser ? <CreateTracker /> : authState.isAuth && foundUser ? <Logger /> : null}
    </>
  )
}

export default App;
