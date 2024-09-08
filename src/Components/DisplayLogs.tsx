import { useSelector } from 'react-redux';
import { TrackerState } from '../store/trackers';

function DisplayLogs() {
  const trackers = useSelector((state: { tracker: TrackerState }) => state.tracker.trackers);

  // Detect the user's time zone
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <>
      <h1>Display Logs</h1>
      {trackers.map((tracker) => (
        <div key={tracker.tracker_name}>
          <h2>{tracker.tracker_name}</h2>
          {tracker.logs.length > 0 ? (
            tracker.logs.map((log, index) => {
              // Convert log time to a Date object and format it
              const utcDate = new Date(`${log.log_time} UTC`);
              const formattedDate = utcDate.toLocaleString('en-US', {
                timeZone: userTimeZone, // Use the user's time zone
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              });

              return (
                <div key={index}>
                  <p>{formattedDate}</p>
                  <p>{log.severity}</p>
                  <p>{log.symptoms}</p>
                  <p>{log.notes}</p>
                </div>
              );
            })
          ) : (
            <p>No logs to display</p>
          )}
        </div>
      ))}
    </>
  );
}

export default DisplayLogs;
