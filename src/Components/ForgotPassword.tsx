import { useState } from 'react';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // await forgotPassword(email);
      setSuccess('Check your email for a password reset link');
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h1>Forgot Password</h1>

      {error && <p style={{ color: "red" }} className="error">{error}</p>}
      {success && <p style={{ color: "green" }} className="success">{success}</p>}
      <form onSubmit={handleForgotPassword}>
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
}

export default ForgotPassword;
