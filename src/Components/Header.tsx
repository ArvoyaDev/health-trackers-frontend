import { useState } from 'react';
import { NavLink } from 'react-router-dom'
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
  const [activeButton, setActiveButton] = useState<'signUp' | 'signIn' | null>("signIn");

  return (
    <>
      <div className="nav">
        <div className="navigation">
          <NavLink to="/" className={({ isActive }) => `navLinks ${isActive ? "active" : "not-active"}`}>Home</NavLink>
          {auth.isAuth && foundUser && (
            <NavLink to="/create" className={({ isActive }) => `navLinks ${isActive ? "active" : "not-active"}`}>Create</NavLink>
          )}
          {auth.isAuth && foundUser && (
            <NavLink to="/logs" className={({ isActive }) => `navLinks ${isActive ? "active" : "not-active"}`}>Logs</NavLink>
          )}
        </div>
        <Login isAuth={auth.isAuth} activeButton={activeButton} setActiveButton={setActiveButton} />
      </div >
      <div className="header">
        <img className="logo" src={logo} alt="logo" />
        <h1 className="title">Health Trackers</h1>
        <h3 className="slogan">Secure | Holistic | Free</h3>
        {auth.isAuth && <h2>Welcome back {auth.user.firstName}!</h2>}
        {!auth.isAuth && activeButton === 'signUp' && <SignUp />}
        {!auth.isAuth && activeButton === 'signIn' && <SignIn />}
      </div>
    </>
  );
}

export default Header;
