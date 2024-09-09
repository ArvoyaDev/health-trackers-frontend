import { useState, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend, ResponsiveContainer } from 'recharts';
import { useSelector } from 'react-redux';
import { TrackerState } from '../../store/trackers';

function RadarGraph() {
  const selectedTracker = useSelector((state: { tracker: TrackerState }) => state.tracker.selectedTracker);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const symptomMap = new Map<string, number>();

  selectedTracker.symptoms.forEach((symptom) => {
    symptomMap.set(symptom.symptom_name, 0);
  });

  selectedTracker.logs.forEach((log) => {
    const symptoms = log.symptoms.split(',').map((s) => s.trim());
    symptoms.forEach((symptom) => {
      if (symptomMap.has(symptom)) {
        symptomMap.set(symptom, symptomMap.get(symptom)! + 1);
      }
    });
  });

  const data = Array.from(symptomMap.entries()).map(([symptomName, count]) => ({
    symptom: symptomName,
    amount: count,
  }));

  const outerRadius = windowWidth < 600 ? '40%' : '80%';

  return (
    <div className="graphs">
      <h1>Radar Graph</h1>
      {selectedTracker.logs.length > 5 ? (
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart
            cx="50%"
            cy="50%"
            className="radar-graph"
            outerRadius={outerRadius} // Dynamically set outerRadius
            data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="symptom" tick={{ fill: "white" }} />
            <PolarRadiusAxis />
            <Radar name="Symptoms" dataKey="amount" stroke="#F9A527" fill="#F9A527" fillOpacity={0.6} />
            <Legend wrapperStyle={{ marginTop: '10px' }} />
          </RadarChart>
        </ResponsiveContainer>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
}

export default RadarGraph;
