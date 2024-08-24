import { useState } from 'react'
import './App.css'
import logo from './assets/logo.png'

const pass = import.meta.env.VITE_PASSWORD
const backendUrl = import.meta.env.VITE_BACKEND_URL

function App() {
  const [entry, setEntry] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [severity, setSeverity] = useState('mild')
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [lastMeal, setLastMeal] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [password, setPassword] = useState('')

  const symptomOptions = [
    'throat burn',
    'chest pain',
    'nausea',
    'bloating',
    'burping',
    'regurgitation',
    'difficulty swallowing',
    'hiccups',
    'sour taste in mouth'
  ]

  const handleClick = async () => {
    try {
      const res = await fetch(`${backendUrl}/logs`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await res.json()
      setEntry(data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const clearForm = () => {
    setSeverity('mild')
    setSymptoms([])
    setLastMeal('')
    setPassword('')
  }

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== pass) {
      alert('Invalid password: website is public, but this is an actual record of my heartburn data!')
      clearForm()
      setIsModalOpen(false)
      return
    }
    const stringSymptoms = symptoms.join(', ')
    try {
      const res = await fetch(`${backendUrl}/logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          severity,
          symptoms: stringSymptoms,
          last_meal: lastMeal,
          password,
        }),
      })

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      setSuccessMessage('Data submitted successfully!')
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const handleSymptomChange = (symptom: string) => {
    if (symptoms.includes(symptom)) {
      setSymptoms(symptoms.filter(s => s !== symptom))
    } else {
      setSymptoms([...symptoms, symptom])
    }
  }

  return (
    <>
      <img className="logo" src={logo} alt="logo" />
      <h1>Heartburn Tracker</h1>
      <button onClick={() => setIsModalOpen(true)}>I have heartburn!</button>
      <button onClick={handleClick}>Show me history!</button>
      {entry ? entry.map((e: any) => (
        <div key={e.id}>
          <p>Date: {e.log_time}</p>
          <p>Hearburn severity: {e.severity}</p>
          <p>Symptoms: {e.symptoms}</p>
          <p>Last meal had: {e.last_meal}</p>
        </div>
      )) : <p>No entries yet!</p>}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Log Heartburn Symptoms</h2>
            <form onSubmit={handlePost}>
              <label>
                Severity:
                <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
                  <option value="mild">Mild</option>
                  <option value="moderate">Moderate</option>
                  <option value="high">High</option>
                </select>
              </label>
              <fieldset>
                <legend>Symptoms:</legend>
                {symptomOptions.map((symptom) => (
                  <label key={symptom}>
                    <input
                      type="checkbox"
                      value={symptom}
                      checked={symptoms.includes(symptom)}
                      onChange={() => handleSymptomChange(symptom)}
                    />
                    {symptom}
                  </label>
                ))}
              </fieldset>
              <label>
                Last Meal:
                <input
                  type="text"
                  value={lastMeal}
                  onChange={(e) => setLastMeal(e.target.value)}
                  placeholder="e.g., pizza"
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                />
              </label>
              <button type="submit">Submit</button>
              <button type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
      {successMessage && <p className="success-message">{successMessage}</p>}
    </>
  )
}

export default App;
