import { useState } from 'react';
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

function Header({ authState }: { authState: Auth }) {
  const [activeButton, setActiveButton] = useState<'signUp' | 'signIn' | null>("signIn");

  return (
    <>
      <div className="nav">
        <p>Other Links</p>
        <Login isAuth={authState.isAuth} activeButton={activeButton} setActiveButton={setActiveButton} />
      </div>
      <div className="header">
        <img className="logo" src={logo} alt="logo" />
        <h1 className="title">Health Tracker</h1>
        <h3 className="slogan">Secure | Holistic | Free</h3>
        {authState.isAuth && <h2>Welcome back {authState.user.firstName}!</h2>}
        {!authState.isAuth && activeButton === 'signUp' && <SignUp />}
        {!authState.isAuth && activeButton === 'signIn' && <SignIn />}
      </div>
    </>
  );
}

export default Header;
