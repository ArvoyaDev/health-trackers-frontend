import { useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'

function CreateTracker() {
  const [inputValue, setInputValue] = useState('');
  const [trackerName, setTrackerName] = useState('');
  const [error, setError] = useState('');
  const email = useSelector((state: any) => state.auth.user.email);
  const accessToken = useSelector((state: any) => state.auth.accessToken);

  const validateInput = (value: string) => {
    const pattern = /^(\s*\w+(\s+\w+)?\s*(,\s*\w+(\s+\w+)?\s*)*)?$/;
    if (!pattern.test(value)) {
      setError('Please enter symptoms one or two words per symptom, separated by commas.');
    } else {
      setError('');
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/db/make-user`,
        {
          email,
          illness: trackerName,
          symptoms: inputValue.split(',').map((symptom) => symptom.trim()),
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(res.data);
    }
    catch (error: any) {
      console.error(error.response?.data?.message || error.message);
    }
  }


  return (
    <form className="trackerForm" onSubmit={handleSubmit} >
      <h2 className="trackerHeader"> Create Your First Tracker! </h2>
      <div className="trackerQuestions">
        <h3>What is your main concern?        </h3>
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
          onBlur={(e) => validateInput(e.target.value)}
        />
      </div>
      {error && <p className="error">{error}</p>}
      <button type="submit" className="trackerButton">Make Tracker</button>
    </form>
  )
}
export default CreateTracker;
