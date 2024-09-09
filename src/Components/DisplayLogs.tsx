import BarGraph from './Graphs/Bar';
import RadarGraph from './Graphs/Radar';
import { useSelector } from 'react-redux';
import { updateSelectedTracker, TrackerState } from '../store/trackers';
import { useDispatch } from 'react-redux';
import './Graphs/Graphs.css';

function DisplayLogs() {
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  const dispatch = useDispatch();
  const trackerState = useSelector((state: { tracker: TrackerState }) => state.tracker);
  const selectedTracker = trackerState.selectedTracker;


  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTracker = trackerState.trackers.find((tracker) => tracker.tracker_name === e.target.value);
    if (newTracker !== undefined) {
      dispatch(updateSelectedTracker(newTracker));
    }
  }

  if (selectedTracker.logs.length === 0) {
    return (
      <div className="displayLogs">
        <h1>Display {capitalizeFirstLetter(selectedTracker.tracker_name)} Logs</h1>
        <h2>No logs to display</h2>
      </div>
    );
  }

  //if media width is less than 600px, display only bar graph
  return (
    <div className="displayLogs">
      <h1>Display {capitalizeFirstLetter(selectedTracker.tracker_name)} Logs</h1>
      {trackerState.trackers.length > 1 && (
        <>
          <select onChange={handleSelect} value={selectedTracker.tracker_name}>
            {trackerState.trackers.map((tracker) => (
              <option key={tracker.tracker_name} value={tracker.tracker_name}>
                {tracker.tracker_name}
              </option>
            ))}
          </select>
        </>
      )}
      <div className="displayGraphs">
        <BarGraph />
        <RadarGraph />
      </div>
    </div>
  );
}

export default DisplayLogs;
