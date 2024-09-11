import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { signIn } from '../store/auth';
import { AppDispatch } from '../store/index';
import { fetchUser } from '../store/trackers';
import { useSelector } from 'react-redux';
import { TokenState, loading } from '../store/auth';
import ForgotPassword from './ForgotPassword';


const url = import.meta.env.VITE_BACKEND_URL;

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [forgotPassword, setForgotPassword] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const authState = useSelector((state: { auth: TokenState }) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Reset any existing error

    const result = await dispatch(signIn(email, password, url));

    if (!result.success) {
      setError('Invalid email or password. Please try again.');
    }

    if (authState.accessToken) {
      dispatch(loading());
      await dispatch(fetchUser(authState.accessToken)).finally(() => {
        dispatch(loading());
      });
    }
  };

  return (
    <>
      <form className="signInForm" onSubmit={handleSubmit}>
        {error && <p style={{ color: "red" }} className="error">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="button"
          onClick={() => setForgotPassword(true)}
        >Forgot Password</button>
        <button type="submit">Sign In</button>
      </form>
      {forgotPassword && (<ForgotPassword />)}
    </>
  );
}

export default SignIn;
