import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { TrackerState } from '../store/trackers';
import { updateSelectedTracker, addLog } from '../store/trackers';
import './Styles/Logger.css';
import axios from 'axios';
import { verifyAuthToken } from '../store/auth';
import { AppDispatch } from '../store/index';

function Logger() {
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(true);
  const accessToken = useSelector((state: { auth: { accessToken: string } }) => state.auth.accessToken);

  // Form state
  const [severity, setSeverity] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);


  const trackerState = useSelector((state: { tracker: TrackerState }) => state.tracker);
  const selectedTracker = trackerState.selectedTracker;

  const handleClick = () => {
    setSelectedSymptoms([]);
    setSeverity('');
    setNotes('');
    setOpen(!open);
    setError(null);
  }

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTracker = trackerState.trackers.find((tracker) => tracker.tracker_name === e.target.value);
    if (newTracker !== undefined) {
      dispatch(updateSelectedTracker(newTracker));
    }
  }

  const handleSymptomChange = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!severity || selectedSymptoms.length === 0) {
      setError('Please select severity and at least one symptom.');
      return;
    }

    if (severity === 'severe' && !notes) {
      setError('Please provide notes for severe symptoms.');
      return;
    }

    if (severity === 'severe' && notes.length > 500) {
      setError('Notes must be less than 500 characters.');
      return;
    }

    const logData = {
      tracker_name: selectedTracker.tracker_name,
      severity,
      selected_symptoms: selectedSymptoms.join(', '),
      notes,
    };

    try {
      await dispatch(verifyAuthToken(accessToken));
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/db/create-symptom-log`,
        logData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
        }
      );
      dispatch(addLog(res.data));
      setSelectedSymptoms([]);
      setSeverity('');
      setNotes('');
      setError(null);
      setOpen(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setOpen(true);
      }, 3000);
    } catch (error) {
      console.log(error);
      setError(`An error occurred. Error: ${error} Please try again.`);
    }

  };

  return (
    <div className="logger">
      {!open && (
        <div className="select-container">
          <h3>Selected Tracker</h3>
          {trackerState.trackers.length > 1 && (
            <select
              title="Select a tracker"
              value={selectedTracker.tracker_name}
              onChange={handleSelect}
            >
              {trackerState.trackers.map((tracker) => (
                <option key={tracker.tracker_name} value={tracker.tracker_name}>
                  {tracker.tracker_name}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {open && (
        <form className="logEventForm" onSubmit={handleSubmit}>
          <h1 style={{ margin: "auto" }}>{capitalizeFirstLetter(selectedTracker.tracker_name)} Tracker</h1>

          <h2>Severity:</h2>
          <select required value={severity} onChange={(e) => setSeverity(e.target.value)}>
            <option value="">Select severity</option>
            <option value="mild">Mild</option>
            <option value="moderate">Moderate</option>
            <option value="severe">Severe</option>
          </select>

          <h2>Symptoms:</h2>
          <div className="logSymptomsContainer">
            {selectedTracker.symptoms.map((symptom, index) => (
              <div className="logSymptoms" key={index}>
                <input
                  type="checkbox"
                  value={symptom.symptom_name}
                  checked={selectedSymptoms.includes(symptom.symptom_name)}
                  onChange={() => handleSymptomChange(symptom.symptom_name)}
                  style={{ marginRight: "5px" }}
                />
                <label> {symptom.symptom_name}</label>
              </div>
            ))}
          </div>

          <h2>Notes:</h2>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
          {error && <p style={{ color: "red" }} className="error">{error}</p>}
          <div className="buttons">
            {trackerState.trackers.length > 1 && <button className="cancelButton" type="button" onClick={handleClick}>Change Tracker</button>}
            <button className="submitButton" type="submit">Submit</button>
          </div>
        </form>
      )}
      {!open && <button onClick={handleClick}>Log {selectedTracker.tracker_name}</button>}
      {success && <p style={{ color: "#F9A527" }}>Log submitted successfully!</p>}
    </div>
  );
}

export default Logger;
