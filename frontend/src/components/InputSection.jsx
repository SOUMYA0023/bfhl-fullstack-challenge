import React from 'react';

const InputSection = ({ input, onInputChange, onSubmit, onClear, loading }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="input-section">
      <h2>Input Data</h2>
      <p className="input-hint">
        Enter hierarchical relationships (one per line):
        <br />
        <code>Parent&#45;&gt;Child</code>
      </p>
      
      <form onSubmit={handleSubmit}>
        <textarea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="A->B&#10;A->C&#10;B->D&#10;C->E"
          disabled={loading}
          rows="10"
        />
        
        <div className="button-group">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading || !input.trim()}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Processing...
              </>
            ) : (
              'Submit'
            )}
          </button>
          
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={onClear}
            disabled={loading}
          >
            Clear
          </button>
        </div>
      </form>
      
      <div className="example-box">
        <h3>Example Input:</h3>
        <pre>
{`A->B
A->C
B->D
C->E
F->G`}
        </pre>
      </div>
    </div>
  );
};

export default InputSection;
