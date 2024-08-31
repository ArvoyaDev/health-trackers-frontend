import { useState } from 'react';
import axios from 'axios';
import Tos from './Tos';

const url = import.meta.env.VITE_BACKEND_URL;

function SignUp() {
  const [displayCodeForm, setDisplayCodeForm] = useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [resendMessage, setResendMessage] = useState<boolean>(false);
  const [confirmationCode, setConfirmationCode] = useState<string[]>(Array(6).fill(''));
  const [displaySuccess, setDisplaySuccess] = useState<boolean>(false);
  const [tos, setTos] = useState<boolean>(false);
  const [showTos, setShowTos] = useState<boolean>(false);
  const [errorOnVerify, setErrorOnVerify] = useState<boolean>(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${url}/aws-cognito/signup`, {
        first_name: firstName,
        last_name: lastName,
        username: email,
        password,
      });
      if (res.status === 201) {
        setDisplayCodeForm(!displayCodeForm);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleResend = async () => {
    try {
      const res = await axios.post(`${url}/aws-cognito/request-verification-code`, {
        username: email,
      });
      if (res.status === 200) {
        setResendMessage(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const code = confirmationCode.join('');
      console.log(email);
      console.log(code);
      const res = await axios.post(`${url}/aws-cognito/confirm-signup`, {
        email,
        confirmationCode: code,
      });
      if (res.status === 200) {
        setDisplaySuccess(true);
        setErrorOnVerify(false);
      }
    } catch (error) {
      setErrorOnVerify(true);
      console.log(error);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (/^[0-9]?$/.test(value)) {
      const newCode = [...confirmationCode];
      newCode[index] = value;
      setConfirmationCode(newCode);

      if (value !== '' && index < confirmationCode.length - 1) {
        const nextInput = document.querySelectorAll('.verifyNum')[index + 1] as HTMLInputElement;
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  };

  return (
    <>
      {!displayCodeForm ? (
        <form onSubmit={handleSignUp} className="signUpForm">
          <input
            type="text"
            placeholder="First Name"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Last Name"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
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
            pattern="(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}"
            title="Password must be at least 8 characters long, contain at least one uppercase letter, and one special character."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <input
              type="checkbox"
              required
              checked={tos}
              onChange={() => setTos(!tos)}
            />
            <p> Agree to <span className="tos" onClick={() => setShowTos(!showTos)}>Terms of Service</span></p>
          </div>
          <button type="submit">Sign Up</button>
        </form>
      ) : (
        !displaySuccess ? (
          <div>
            <p>Please fill using the code sent to your email:</p>
            <form onSubmit={handleVerify} className="verificationForm">
              <div className="verifyNums">
                {confirmationCode.map((code, index) => (
                  <input
                    key={index}
                    type="text"
                    className="verifyNum"
                    value={code}
                    required
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    maxLength={1}
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                ))}
              </div>
              {resendMessage && <p>Message Resent</p>}
              {errorOnVerify && <p style={{ color: "red" }}>Could Not Verify, Please try again</p>}
              <button onClick={handleResend}>Resend Verification Code</button>
              <button type="submit">Verify</button>
            </form>
          </div>
        ) : (
          <p>You can now sign in!</p>
        )
      )}
      {showTos && <Tos closeModal={() => setShowTos(false)} />}
    </>
  );
}

export default SignUp;
