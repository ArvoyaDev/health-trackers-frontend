import { useState } from 'react';
import axios from 'axios';

const url = import.meta.env.VITE_BACKEND_URL;

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(`${url}/aws-cognito/forgot-password`, { email });
      if (res.status === 200) {
        setForgotPasswordSuccess(true);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(`${url}/aws-cognito/confirm-forgot-password`, {
        email,
        confirmationCode: verificationCode,
        password: newPassword,
      });
      if (res.status === 200) {
        setResetPasswordSuccess(true);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Forgot Password</h1>
      {error && <p style={{ color: 'red' }} className="error">{error}</p>}
      {forgotPasswordSuccess && !resetPasswordSuccess && (
        <p style={{ color: 'green' }} className="success">
          Check your email for a password reset link
        </p>
      )}
      {resetPasswordSuccess && (
        <p style={{ color: 'green' }} className="success">
          Password reset successful
        </p>
      )}

      {!forgotPasswordSuccess ? (
        <form onSubmit={handleForgotPassword}>
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Reset Password'}
          </button>
        </form>
      ) : (
        !resetPasswordSuccess && (
          <form onSubmit={handleResetPassword}>
            <input
              type="text"
              placeholder="Verification Code"
              required
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              required
              pattern="(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}"
              title="Password must be at least 8 characters long, contain at least one uppercase letter, and one special character."
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        )
      )}
    </div>
  );
}

export default ForgotPassword;
