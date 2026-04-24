import React from 'react';

const InputPanel = ({ input, onInputChange, onSubmit, onClear, loading }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <section className="panel input-panel">
      <div className="panel-header">
        <h2 className="panel-title">Input Data</h2>
        <span className="panel-hint">Enter one relationship per line</span>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <textarea
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder={"A->B\nA->C\nB->D\nC->E"}
            disabled={loading}
            rows={8}
            className="data-input"
            spellCheck={false}
          />
        </div>
        
        <div className="input-actions">
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
              'Process Graph'
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
      
      <div className="format-hint">
        <span className="hint-label">Format:</span>
        <code>Parent-&gt;Child</code>
        <span className="hint-separator">•</span>
        <span className="hint-example">e.g., A-&gt;B, B-&gt;C</span>
      </div>
    </section>
  );
};

export default InputPanel;
