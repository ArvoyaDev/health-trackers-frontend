import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Components/Header';
import CreateUserAndTracker from './Components/CreateTracker';
import CreateNewTracker from './Components/CreateNewTracker';
import Logger from './Components/Logger';
import DisplayLogs from './Components/DisplayLogs';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { refreshAccessToken, loading } from './store/auth';
import { AppDispatch } from './store/index';
import { TokenState } from './store/auth';
import { fetchUser, TrackerState } from './store/trackers';
import { useState } from 'react';

const url = import.meta.env.VITE_BACKEND_URL;


function App() {
  const authState = useSelector((state: { auth: TokenState }) => state.auth);
  const trackerState = useSelector((state: { tracker: TrackerState }) => state.tracker);
  const dispatch = useDispatch<AppDispatch>();

  const [userFetched, setUserFetched] = useState(false);
  const isLoaded = authState.loading;

  useEffect(() => {
    const loadUser = async () => {
      if (authState.accessToken && !userFetched) {
        await dispatch(fetchUser(authState.accessToken));
        setUserFetched(true);
      }
    };

    if (authState.accessToken == null && !authState.isAuth) {
      dispatch(refreshAccessToken(url));
    }

    if (trackerState.trackers.length === 0 && authState.accessToken && !userFetched) {
      dispatch(loading());
      loadUser().finally(() => {
        dispatch(loading());
      });
    }
  }, [dispatch, authState.accessToken, authState.isAuth, trackerState.trackers.length, userFetched]);

  const foundUser = trackerState.trackers.length > 0;

  return (
    <>
      <Router>
        <Header auth={authState} foundUser={foundUser} />
        <Routes>
          <Route path="/" element={
            isLoaded ? (
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
          <Route path="/logs" element={
            authState.isAuth && foundUser ? (
              <DisplayLogs />
            ) : null
          } />
        </Routes>
      </Router>
    </>
  );
}

export default App;
