import './App.css'
import Header from './Components/Header'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { verifyAuthToken, refreshAccessToken } from './store/auth'
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

  useEffect(() => {
    if (authState.accessToken != null) {
      dispatch(verifyAuthToken(authState.accessToken))
    } else if (authState.accessToken == null || !authState.isAuth) {
      dispatch(refreshAccessToken(url))
    }
  }, [dispatch, authState.accessToken, authState.isAuth])


  return (
    <>
      <Header authState={authState} />
    </>

  )
}

export default App;
