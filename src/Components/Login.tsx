import { useDispatch } from 'react-redux'
import { AppDispatch } from '../store/index'
import { signOut } from '../store/auth'

interface LoginProps {
  isAuth: boolean;
  activeButton: 'signUp' | 'signIn' | null;
  setActiveButton: React.Dispatch<React.SetStateAction<'signUp' | 'signIn' | null>>;
}

function Login({ isAuth, activeButton, setActiveButton }: LoginProps) {
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = async () => {
    await dispatch(signOut());
    window.location.href = '/';
  }


  return (
    <div className="navButtons">
      {isAuth ? (
        <button
          onClick={handleLogout}
        >Logout</button>
      ) : (
        <div className="signUpIn">
          <button
            className={activeButton === 'signUp' ? 'active' : ''}
            onClick={() => setActiveButton('signUp')}
          >
            Sign Up
          </button>
          <p style={{ fontSize: '1.5rem' }}>|</p>
          <button
            className={activeButton === 'signIn' ? 'active' : ''}
            onClick={() => setActiveButton('signIn')}
          >
            Sign In
          </button>
        </div>
      )}
    </div>
  );
}

export default Login;
