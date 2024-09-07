import './App.css';
import Header from './Components/Header';
import CreateTracker from './Components/CreateTracker';
import Logger from './Components/Logger';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { refreshAccessToken } from './store/auth';
import { fetchUser } from './store/trackers'; // Import your `fetchUser` action
import { AppDispatch } from './store/index';

interface State {
  auth: {
    accessToken: string;
    isAuth: boolean;
    user: {
      firstName: string;
    };
  };
  tracker: {
    trackers: any[];
  };
}

const url = import.meta.env.VITE_BACKEND_URL;

function App() {
  const authState = useSelector((state: State) => state.auth);
  const trackerState = useSelector((state: State) => state.tracker);
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Dispatch the fetchUser action to retrieve the user's trackers
        await dispatch(fetchUser(authState.accessToken));
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    // Refresh access token if not authenticated
    if (authState.accessToken == null && !authState.isAuth) {
      dispatch(refreshAccessToken(url));
    }

    // Fetch user data once authenticated
    if (authState.isAuth) {
      loadData();
    } else {
      setLoading(false);
    }

  }, [dispatch, authState.accessToken, authState.isAuth]);

  const foundUser = trackerState.trackers.length > 0;

  return (
    <>
      <Header authState={authState} />
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <h1>Loading...</h1>
        </div>
      ) : authState.isAuth && !foundUser ? (
        <CreateTracker />
      ) : authState.isAuth && foundUser ? (
        <Logger />
      ) : null}
    </>
  );
}

export default App;
