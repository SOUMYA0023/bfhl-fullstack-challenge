import { useState } from 'react';
import InputSection from './components/InputSection';
import ResponseDisplay from './components/ResponseDisplay';
import { submitData } from './api';
import './styles.css';

function App() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const parseInput = (inputText) => {
    return inputText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
  };

  const handleSubmit = async () => {
    const parsedData = parseInput(input);
    
    if (parsedData.length === 0) {
      setError('Please enter at least one relationship');
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const result = await submitData(parsedData);
      setResponse(result);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setInput('');
    setResponse(null);
    setError(null);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>BFHL Hierarchical Graph Processor</h1>
        <p>Visualize and analyze hierarchical relationships</p>
      </header>

      <main className="app-main">
        <InputSection
          input={input}
          onInputChange={setInput}
          onSubmit={handleSubmit}
          onClear={handleClear}
          loading={loading}
        />

        {error && (
          <div className="error-message fade-in">
            <strong>Error:</strong> {error}
          </div>
        )}

        {response && <ResponseDisplay response={response} />}
      </main>
    </div>
  );
}

export default App;
