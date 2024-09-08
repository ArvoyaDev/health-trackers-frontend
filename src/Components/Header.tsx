import { useState } from 'react';
import { NavLink } from 'react-router-dom'
import logo from '../assets/logo.png';
import Login from './Login';
import SignUp from './SignUp';
import SignIn from './SignIn';

interface Auth {
  isAuth: boolean;
  user: {
    firstName: string;
  };
}

interface HeaderProps {
  authState: Auth;
  foundUser: boolean;
}

function Header({ authState, foundUser }: HeaderProps) {
  const [activeButton, setActiveButton] = useState<'signUp' | 'signIn' | null>("signIn");

  return (
    <>
      <div className="nav">
        <div className="navigation">
          <NavLink to="/" className={({ isActive }) => `navLinks ${isActive ? "active" : "not-active"}`}>Home</NavLink>
          {authState.isAuth && foundUser && (
            <NavLink to="/create" className={({ isActive }) => `navLinks ${isActive ? "active" : "not-active"}`}>Create</NavLink>
          )}
          {authState.isAuth && foundUser && (
            <NavLink to="/logs" className={({ isActive }) => `navLinks ${isActive ? "active" : "not-active"}`}>Logs</NavLink>
          )}
        </div>
        <Login isAuth={authState.isAuth} activeButton={activeButton} setActiveButton={setActiveButton} />
      </div >
      <div className="header">
        <img className="logo" src={logo} alt="logo" />
        <h1 className="title">Health Trackers</h1>
        <h3 className="slogan">Secure | Holistic | Free</h3>
        {authState.isAuth && <h2>Welcome back {authState.user.firstName}!</h2>}
        {!authState.isAuth && activeButton === 'signUp' && <SignUp />}
        {!authState.isAuth && activeButton === 'signIn' && <SignIn />}
      </div>
    </>
  );
}

export default Header;
