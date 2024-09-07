import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { TrackerState } from '../store/trackers';
import { updateSelectedTracker } from '../store/trackers';
import './Styles/Logger.css';
import axios from 'axios'; // Make sure to import axios

function Logger() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const accessToken = useSelector((state: { auth: { accessToken: string } }) => state.auth.accessToken);

  // Form state
  const [severity, setSeverity] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState('');


  const trackerState = useSelector((state: { tracker: TrackerState }) => state.tracker);
  const selectedTracker = trackerState.selectedTracker;

  const handleClick = () => {
    setOpen(!open);
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
      // Remove symptom if already selected
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      // Add symptom if not selected
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare data to send to the backend
    const logData = {
      tracker_name: selectedTracker.tracker_name,
      severity,
      selected_symptoms: selectedSymptoms.join(', '),
      notes,
    };

    // Send the data to the backend (replace `YOUR_BACKEND_URL` with the correct URL)
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/db/create-symptom-log`,
        logData, // Data to be sent in the request body
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
        }
      );
      console.log('Log submitted successfully:', res.data);
      setOpen(false); // Close the form after submission
    } catch (error) {
      console.error('Error submitting log:', error);
    }

  };

  return (
    <div className="logger">
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
                />
                <label>{symptom.symptom_name}</label>
              </div>
            ))}
          </div>

          <h2>Notes:</h2>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />

          <div className="buttons">
            <button className="cancelButton" type="button" onClick={handleClick}>Cancel</button>
            <button className="submitButton" type="submit">Submit</button>
          </div>
        </form>
      )}

      {!open && <button onClick={handleClick}>Log {selectedTracker.tracker_name}</button>}
    </div>
  );
}

export default Logger;
