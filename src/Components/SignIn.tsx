import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { signIn } from '../store/auth';
import { AppDispatch } from '../store/index';

const url = import.meta.env.VITE_BACKEND_URL;

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(signIn(email, password, url));
  };

  return (
    <form className="" onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSubmit} >Sign In</button>
    </form>
  );
}

export default SignIn;
