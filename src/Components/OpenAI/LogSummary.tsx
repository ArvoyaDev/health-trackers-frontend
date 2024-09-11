interface SummaryDisplayProps {
  summary: string;
}


const SummaryDisplay: React.FC<SummaryDisplayProps> = ({ summary }) => {

  const summaryToJSX = (summary: string) => {
    const sections = summary.split('\n');

    const patterns: string[] = [];
    const recommendations: string[] = [];
    const techniques: string[] = [];
    let advisoryNote = '';

    let currentSection = '';

    sections.forEach((line) => {
      const trimmedLine = line.trim();

      if (!trimmedLine) return;

      if (trimmedLine.startsWith('- Patterns observed:')) {
        currentSection = 'patterns';
      } else if (trimmedLine.startsWith('- Recommendations:')) {
        currentSection = 'recommendations';
      } else if (trimmedLine.startsWith('- Holistic Techniques:')) {
        currentSection = 'techniques';
      } else if (trimmedLine.startsWith("It's always advisable")) {
        advisoryNote = trimmedLine;
      } else {
        if (currentSection === 'patterns') {
          patterns.push(trimmedLine);
        } else if (currentSection === 'recommendations') {
          recommendations.push(trimmedLine);
        } else if (currentSection === 'techniques') {
          techniques.push(trimmedLine);
        }
      }
    });

    return (
      <div>

        {patterns.length > 0 && (
          <div>
            <h4>Patterns Observed:</h4>
            <ul>
              {patterns.map((pattern, idx) => (
                <li key={idx}>{pattern}</li>
              ))}
            </ul>
          </div>
        )}

        {recommendations.length > 0 && (
          <div>
            <h4>Recommendations:</h4>
            <ul>
              {recommendations.map((recommendation, idx) => (
                <li key={idx}>{recommendation}</li>
              ))}
            </ul>
          </div>
        )}

        {techniques.length > 0 && (
          <div>
            <h4>Holistic Techniques:</h4>
            <ul>
              {techniques.map((technique, idx) => (
                <li key={idx}>{technique}</li>
              ))}
            </ul>
          </div>
        )}

        {advisoryNote && (
          <p>{advisoryNote}</p>
        )}
      </div>
    );
  };
  return (
    <div>
      {summaryToJSX(summary)}
    </div>
  );
}

export default SummaryDisplay;
