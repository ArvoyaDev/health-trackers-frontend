import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { signIn } from '../store/auth';
import { AppDispatch } from '../store/index';

const url = import.meta.env.VITE_BACKEND_URL;

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Reset any existing error

    const result = await dispatch(signIn(email, password, url));

    if (!result.success) {
      setError(result.message || 'An error occurred during sign-in');
    }
  };

  return (
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
      <button type="submit">Sign In</button>
    </form>
  );
}

export default SignIn;
