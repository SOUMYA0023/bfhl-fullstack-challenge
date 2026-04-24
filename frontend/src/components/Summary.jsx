import React from 'react';

const Summary = ({ summary }) => {
  const { total_trees, total_cycles, largest_tree_root } = summary;

  return (
    <div className="summary-card">
      <h2>Summary</h2>
      <div className="summary-grid">
        <div className="summary-item">
          <div className="summary-value">{total_trees}</div>
          <div className="summary-label">Total Trees</div>
        </div>
        
        <div className="summary-item">
          <div className="summary-value">{total_cycles}</div>
          <div className="summary-label">Total Cycles</div>
        </div>
        
        <div className="summary-item">
          <div className="summary-value">{largest_tree_root || 'N/A'}</div>
          <div className="summary-label">Largest Tree Root</div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
