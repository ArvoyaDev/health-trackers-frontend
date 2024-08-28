// src/components/Login.tsx
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/index.ts';
import { signIn } from '../store/user';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const url = import.meta.env.VITE_BACKEND_URL;

  const handleLogin = () => {
    dispatch(signIn(username, password, url));
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={handleUsernameChange}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={handlePasswordChange}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
