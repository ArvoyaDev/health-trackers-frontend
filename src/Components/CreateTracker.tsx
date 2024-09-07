import { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { TokenState } from '../store/auth'



function CreateTracker() {
  const [inputValue, setInputValue] = useState('');
  const [trackerName, setTrackerName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const email = useSelector((state: { auth: TokenState }) => state.auth.user.email);
  const accessToken = useSelector((state: { auth: TokenState }) => state.auth.accessToken);

  const validateInput = (value: string) => {
    const pattern = /^(\s*\w+(\s+\w+)?\s*(,\s*\w+(\s+\w+)?\s*)*)?$/;
    return pattern.test(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateInput(inputValue)) {
      setError('Please enter symptoms as one or two words per symptom, separated by commas.');
      return; // Prevent form submission if validation fails
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/db/make-user`,
        {
          email,
          tracker: trackerName,
          symptoms: inputValue.split(',').map((symptom) => symptom.trim()),
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (res.status == 201) {
        setSuccess(true); // Set success to true if the request succeeds
      }
    } catch (error: any) {
      setError(error.response?.data?.message || error.message);
    }
  };

  return (
    <form className="trackerForm" onSubmit={handleSubmit}>
      {!success ? (
        <>
          <h2 className="trackerHeader">Create Your First Tracker!</h2>
          <div className="trackerQuestions">
            <h3>What is your main concern?</h3>
            <input
              type="text"
              required
              placeholder="heartburn"
              pattern="^\w+(\s\w+)?$"
              value={trackerName}
              onChange={(e) => setTrackerName(e.target.value)}
              title="Please enter one or two words."
            />
            <h3>What are the symptoms associated with it?</h3>
            <textarea
              required
              placeholder="sour taste, chest pain, throat burn, nausea, etc."
              title="Please enter symptoms one or two words per symptom, separated by commas."
              className="trackerTextarea"
              value={inputValue}
              rows={4}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="trackerButton">Make Tracker</button>
        </>
      ) : (
        <p>Tracker created successfully!</p>
      )}
    </form>
  );
}

export default CreateTracker;
