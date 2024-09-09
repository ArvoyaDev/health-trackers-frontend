import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../assets/logo.png';
import Login from './Login';
import SignUp from './SignUp';
import SignIn from './SignIn';

interface Auth {
  isAuth: boolean;
  user: {
    firstName: string | null;
  };
}

interface HeaderProps {
  auth: Auth;
  foundUser: boolean;
}

function Header({ auth, foundUser }: HeaderProps) {
  const [activeButton, setActiveButton] = useState<'signUp' | 'signIn' | null>('signIn');
  const [displayWelcome, setDisplayWelcome] = useState<boolean>(false);
  const [fade, setFade] = useState<boolean>(false);

  useEffect(() => {
    if (auth.isAuth) {
      setDisplayWelcome(true);
      setFade(true); // Start fading in
      setTimeout(() => {
        setFade(false); // Start fading out
      }, 2000); // Keep message visible for 2 seconds
      setTimeout(() => {
        setDisplayWelcome(false); // Remove the message after fade out
      }, 3000); // Ensure message is removed after fading out
    }
  }, [auth.isAuth]);

  return (
    <>
      <div className="nav">
        <div className="navigation">
          <NavLink to="/" className={({ isActive }) => `navLinks ${isActive ? 'active' : 'not-active'}`}>Home</NavLink>
          {auth.isAuth && foundUser && (
            <NavLink to="/create" className={({ isActive }) => `navLinks ${isActive ? 'active' : 'not-active'}`}>Create</NavLink>
          )}
          {auth.isAuth && foundUser && (
            <NavLink to="/logs" className={({ isActive }) => `navLinks ${isActive ? 'active' : 'not-active'}`}>Logs</NavLink>
          )}
        </div>
        <Login isAuth={auth.isAuth} activeButton={activeButton} setActiveButton={setActiveButton} />
      </div>
      <div className="header">
        <img className="logo" src={logo} alt="logo" />
        <h1 className="title">Health Trackers</h1>
        <h3 className="slogan">Secure | Holistic | Free</h3>
        {displayWelcome && (
          <h2 className={`welcome-message ${fade ? 'fade-in' : 'fade-out'}`}>
            Welcome back {auth.user.firstName}!
          </h2>
        )}
        {!auth.isAuth && activeButton === 'signUp' && <SignUp />}
        {!auth.isAuth && activeButton === 'signIn' && <SignIn />}
      </div>
    </>
  );
}

export default Header;
