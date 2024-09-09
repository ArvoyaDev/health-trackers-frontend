import { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { TokenState } from '../store/auth'
import { verifyAuthToken } from '../store/auth'
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/index';
import { fetchUser } from '../store/trackers';



function CreateUserAndTracker() {
  const [inputValue, setInputValue] = useState('');
  const [trackerName, setTrackerName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const email = useSelector((state: { auth: TokenState }) => state.auth.user.email);
  const accessToken = useSelector((state: { auth: TokenState }) => state.auth.accessToken);

  const dispatch = useDispatch<AppDispatch>();

  const validateInput = (value: string) => {
    const pattern = /^(\s*\w+(-\w+)?(\s+\w+(-\w+)?){0,2}\s*)(,\s*\w+(-\w+)?(\s+\w+(-\w+)?){0,2}\s*)*$/;
    return pattern.test(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateInput(inputValue)) {
      setError('Please enter symptoms as one or two words per symptom, separated by commas.');
      return; // Prevent form submission if validation fails
    }

    const symptomsArray = inputValue.split(',').map((symptom) => symptom.trim());
    if (symptomsArray.length < 3) {
      setError('Please enter at least 3 symptoms.');
      return; // Prevent form submission if validation fails
    }
    if (symptomsArray.length > 15) {
      setError('Please enter no more than 15 symptoms.');
      return; // Prevent form submission if validation fails
    }

    try {

      if (!accessToken) {
        throw new Error('Access token not found');
      }
      setLoading(true);

      await dispatch(verifyAuthToken(accessToken));

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/db/make-user`,
        {
          email,
          tracker_name: trackerName,
          symptoms: symptomsArray,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (res.status == 201) {
        setError('');
        setSuccess(true); // Set success to true if the request succeeds
        setInputValue('');
        await dispatch(verifyAuthToken(accessToken));
        await dispatch(fetchUser(accessToken));
        setLoading(false);
      }
    } catch (error) {

      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || error.message);
      }
      setLoading(false);
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
              placeholder="chest pain, sore throat, nausea, right-side pain, stomach bloating, etc."
              title="Please enter symptoms, each consisting of one to three words (including hyphens), separated by commas."
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
      {loading && <p>Loading...</p>}
    </form>
  );
}

export default CreateUserAndTracker;
