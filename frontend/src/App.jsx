import { useState, useRef } from 'react';
import InputSection from './components/InputSection';
import ResponseDisplay from './components/ResponseDisplay';
import { submitData, warmUp } from './api';
import './styles.css';

function App() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('Processing...');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  // Track whether this is the very first request so we can show a cold-start hint
  const isFirstRequest = useRef(true);

  const parseInput = (inputText) => {
    return inputText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
  };

  const runRequest = async (parsedData) => {
    setLoading(true);
    setError(null);
    setResponse(null);

    // Show a cold-start warning on the first ever request
    if (isFirstRequest.current) {
      setLoadingMsg('Waking up server, please wait…');
      warmUp(); // fire-and-forget ping to /health
    } else {
      setLoadingMsg('Processing…');
    }

    try {
      const result = await submitData(parsedData);
      isFirstRequest.current = false;
      setResponse(result);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    const parsedData = parseInput(input);

    if (parsedData.length === 0) {
      setError('Please enter at least one relationship');
      return;
    }

    await runRequest(parsedData);
  };

  // Retry reuses the last input without re-parsing from scratch
  const handleRetry = async () => {
    const parsedData = parseInput(input);
    if (parsedData.length === 0) return;
    await runRequest(parsedData);
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
          loadingMsg={loadingMsg}
        />

        {error && (
          <div className="error-message fade-in">
            <strong>Error:</strong> {error}
            <button
              className="btn btn-secondary retry-btn"
              onClick={handleRetry}
              disabled={loading}
            >
              ↺ Retry
            </button>
          </div>
        )}

        {response && <ResponseDisplay response={response} />}
      </main>
    </div>
  );
}

export default App;

