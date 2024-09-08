import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Components/Header';
import CreateUserAndTracker from './Components/CreateTracker';
import CreateNewTracker from './Components/CreateNewTracker';
import Logger from './Components/Logger';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { refreshAccessToken } from './store/auth';
import { fetchUser } from './store/trackers'; // Import your `fetchUser` action
import { AppDispatch } from './store/index';
import { TokenState } from './store/auth';
import { TrackerState } from './store/trackers';

const url = import.meta.env.VITE_BACKEND_URL;

function App() {
  const authState = useSelector((state: { auth: TokenState }) => state.auth);
  const trackerState = useSelector((state: { tracker: TrackerState }) => state.tracker);
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Dispatch the fetchUser action to retrieve the user's trackers
        if (authState.accessToken) {
          await dispatch(fetchUser(authState.accessToken));
        }
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
      <Router>
        <Header authState={authState} foundUser={foundUser} />
        <Routes>
          <Route path="/" element={
            loading ? (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <h1>Loading...</h1>
              </div>
            ) : authState.isAuth && !foundUser ? (
              <CreateUserAndTracker />
            ) : authState.isAuth && foundUser ? (
              <Logger />
            ) : null
          } />
          <Route path="/create" element={
            authState.isAuth && foundUser ? (
              <CreateNewTracker />
            ) : null
          } />
        </Routes>
      </Router>
    </>
  );
}

export default App;
