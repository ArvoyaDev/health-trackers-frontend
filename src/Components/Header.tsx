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
  const [activeButton, setActiveButton] = useState<'signUp' | 'signIn' | null>(null);

  return (
    <>
      <div className="nav">
        <Login isAuth={authState.isAuth} activeButton={activeButton} setActiveButton={setActiveButton} />
      </div>
      <div className="header">
        <img className="logo" src={logo} alt="logo" />
        <h1>Health Tracker</h1>
        {authState.isAuth ? <h2>Welcome back {authState.user.firstName}!</h2> : <h2>Welcome!</h2>}
        {!authState.isAuth && activeButton === 'signUp' && <SignUp />}
        {!authState.isAuth && activeButton === 'signIn' && <SignIn />}
      </div>
    </>
  );
}

export default Header;
