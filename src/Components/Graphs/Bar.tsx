import { TrackerState } from '../../store/trackers';
import { useSelector } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PayloadItem {
  payload: {
    time: string;
    Severity: number;
    symptoms: string;
    notes: string;
  };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: PayloadItem[];
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {

  const numberToSeverity = (Severity: number) => {
    if (Severity === 1) {
      return 'mild';
    } else if (Severity === 2) {
      return 'moderate';
    } else if (Severity === 3) {
      return 'severe';
    } else {
      return '';
    }
  }


  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <h3 className="LogTime">{payload[0].payload.time}</h3>
        <p className="Severity">SEVERITY: {numberToSeverity(payload[0].payload.Severity)}</p>
        <p className="Symptoms">SYMPTOMS: {payload[0].payload.symptoms}</p>
        {payload[0].payload.notes != '' && <p className="Notes">NOTES: {payload[0].payload.notes}</p>}
      </div>
    );
  }

  return null;
};

function BarGraph() {



  const selectedTracker = useSelector((state: { tracker: TrackerState }) => state.tracker.selectedTracker);

  const formateDate = (date: string | null) => {
    if (!date) return '';
    const isoDate = date.replace(' ', 'T'); // Ensure ISO format compatibility
    const utcDate = new Date(isoDate); // Parse the ISO date
    if (isNaN(utcDate.getTime())) {
      return 'Invalid Date'; // Fallback if the date cannot be parsed
    }

    const offsetInMinutes = new Date().getTimezoneOffset();
    const adjustedDate = new Date(utcDate.getTime() - offsetInMinutes * 60000);

    return adjustedDate.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  const formateDateXAxis = (date: string | null) => {
    if (!date) return '';
    const isoDate = date.replace(' ', 'T');
    const utcDate = new Date(isoDate); // Parse the ISO date
    if (isNaN(utcDate.getTime())) {
      return 'Invalid Date';
    }

    // Adjusting for the user's local timezone using getTimezoneOffset
    const offsetInMinutes = new Date().getTimezoneOffset();
    const adjustedDate = new Date(utcDate.getTime() - offsetInMinutes * 60000);

    return adjustedDate.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }

  //severity to numbers

  const severityToNumber = (severity: string | null) => {
    if (severity === 'mild') {
      return 1;
    } else if (severity === 'moderate') {
      return 2;
    } else if (severity === 'severe') {
      return 3;
    } else {
      return 0;
    }
  }

  const data = selectedTracker.logs.map((log) => {
    return {
      name: formateDateXAxis(log.log_time),
      time: formateDate(log.log_time),
      Severity: severityToNumber(log.severity),
      symptoms: log.symptoms,
      notes: log.notes,
    };
  });



  return (
    <div className="graphs">
      <h1>Bar Graph</h1>
      <ResponsiveContainer className="bar-graph-holder" width="100%" height={300}>
        <BarChart
          className="bar-graph"
          data={data}
          margin={{ right: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name"
            tick={{ fill: 'white' }}
            className="x-axis"
          />
          <YAxis color="white"
            tick={{ fill: 'white' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="Severity" fill="#F9A527" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}




export default BarGraph;
