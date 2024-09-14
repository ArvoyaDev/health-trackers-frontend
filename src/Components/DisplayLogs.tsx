import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import BarGraph from './Graphs/Bar';
import RadarGraph from './Graphs/Radar';
import SummaryDisplay from './OpenAI/LogSummary';
import { updateSelectedTracker, TrackerState } from '../store/trackers';
import { TokenState, verifyAuthToken } from '../store/auth';
import { AppDispatch } from '../store/index';
import { updateSummary } from '../store/trackers';
import './Graphs/Graphs.css';

function DisplayLogs() {
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('graphs');
  const [medicalType, setMedicalType] = useState<string>('Naturopathy');
  const [error, setError] = useState<string | null>(null);
  const trackerState = useSelector((state: { tracker: TrackerState }) => state.tracker);
  const selectedTracker = trackerState.selectedTracker;
  const authState = useSelector((state: { auth: TokenState }) => state.auth);
  const naturopathicSummary = selectedTracker.summary.naturopathy
  const ayurvedicSummary = selectedTracker.summary.ayurveda

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTracker = trackerState.trackers.find((tracker) => tracker.tracker_name === e.target.value);
    if (newTracker !== undefined) {
      dispatch(updateSelectedTracker(newTracker));
    }
  };

  if (selectedTracker.logs.length === 0) {
    return (
      <div className="displayLogs">
        <h1>Display {capitalizeFirstLetter(selectedTracker.tracker_name)} Logs</h1>
        {trackerState.trackers.length > 1 && (
          <div className="selectContainer">
            <select onChange={handleSelect} value={selectedTracker.tracker_name}>
              {trackerState.trackers.map((tracker) => (
                <option key={tracker.tracker_name} value={tracker.tracker_name}>
                  {tracker.tracker_name}
                </option>
              ))}
            </select>
          </div>
        )}
        <h2>No logs to display</h2>
      </div>
    );
  }

  const getSummary = async () => {
    setError(null);
    const data = {
      medical_type: medicalType,
      logs: selectedTracker.logs,
    };

    try {

      if (authState.accessToken) {
        await dispatch(verifyAuthToken(authState.accessToken));
      }

      setLoading(true);

      if (medicalType === 'Naturopathy') {
        dispatch(updateSummary({ naturopathy: "", ayurveda: selectedTracker.summary.ayurveda }));
      } else if (medicalType === 'Ayurveda') {
        dispatch(updateSummary({ ayurveda: "", naturopathy: selectedTracker.summary.naturopathy }));
      }

      const response = await axios.post(

        `${import.meta.env.VITE_BACKEND_URL}/db/openai`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authState.accessToken}`,
          },
        }
      );

      if (medicalType === 'Naturopathy') {
        dispatch(updateSummary({ naturopathy: response.data, ayurveda: selectedTracker.summary.ayurveda }));
      } else if (medicalType === 'Ayurveda') {
        dispatch(updateSummary({ ayurveda: response.data, naturopathy: selectedTracker.summary.naturopathy }));
      }
      setError(null);
    } catch {
      setError('Please Try Again.');
    } finally {
      setLoading(false);
    }
  };

  const switchDisplay = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div style={{ paddingBottom: "20px" }}>
      <h1 style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        Display {capitalizeFirstLetter(selectedTracker.tracker_name)} Logs
      </h1>
      <div className="displayToggle">
        <span
          className={`singleToggle ${activeTab === 'graphs' ? 'active' : ''}`}
          onClick={() => switchDisplay('graphs')}
        >
          Display Graphs
        </span>
        <span
          className={`singleToggle ${activeTab === 'summary' ? 'active' : ''}`}
          onClick={() => switchDisplay('summary')}
        >
          Retrieve AI Summary
        </span>
      </div>
      {trackerState.trackers.length > 1 && (
        <div className="selectContainer">
          <select onChange={handleSelect} value={selectedTracker.tracker_name}>
            {trackerState.trackers.map((tracker) => (
              <option key={tracker.tracker_name} value={tracker.tracker_name}>
                {tracker.tracker_name}
              </option>
            ))}
          </select>
        </div>
      )}
      {activeTab === 'graphs' && (
        <div className="displayLogs">
          <div className="displayGraphs">
            <BarGraph />
            <RadarGraph />
          </div>
        </div>
      )}
      {activeTab === 'summary' && (
        selectedTracker.logs.length > 2 ? (
          <div className="openai">
            <div className="aiHeader">
              <h2>OpenAI GPT-4</h2>
              <div>
                <span
                  className={`aiTab ${medicalType === 'Naturopathy' ? 'active' : ''}`}
                  onClick={() => setMedicalType('Naturopathy')}
                >
                  Naturopathy
                </span>
                <span
                  className={`aiTab ${medicalType === 'Ayurveda' ? 'active' : ''}`}
                  onClick={() => setMedicalType('Ayurveda')}
                >
                  Ayurveda
                </span>
              </div>
            </div>
            <p>
              Click the button below to generate a summary of the logs. This summary will not include identifying information, but will send the logs to the OpenAI API for processing.
            </p>
            <p>
              None of the data will be stored or saved in our system, but OpenAI may store the data according to their privacy policy.
            </p>
            <p>Upon clicking the button you are agreeing to the OpenAI terms of service and privacy policy.</p>
            <button onClick={getSummary} disabled={loading}>Generate Summary</button>
            {error && <p style={{ color: "red" }} className="error">Please Try Again.</p>}
            {loading && <p>Loading...</p>}
            {ayurvedicSummary && medicalType === "Ayurveda" && (
              <div className="summary">
                <h2>{medicalType} Summary</h2>
                <SummaryDisplay summary={ayurvedicSummary} />
              </div>
            )}
            {naturopathicSummary && medicalType === "Naturopathy" && (
              <div className="summary">
                <h2>{medicalType} Summary</h2>
                <SummaryDisplay summary={naturopathicSummary} />
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
            <h2>Need at least 3 logs to retrieve an AI summary.</h2>
          </div>
        )
      )}
    </div>
  );
}

export default DisplayLogs;
