import React from 'react';

const SummaryStats = ({ summary }) => {
  const { total_trees, total_cycles, largest_tree_root } = summary;

  return (
    <div className="summary-bar">
      <div className="summary-item">
        <div className="summary-value">{total_trees}</div>
        <div className="summary-label">Total Trees</div>
      </div>
      
      <div className="summary-divider"></div>
      
      <div className="summary-item">
        <div className="summary-value">{total_cycles}</div>
        <div className="summary-label">Cycles</div>
      </div>
      
      <div className="summary-divider"></div>
      
      <div className="summary-item">
        <div className="summary-value">{largest_tree_root || '—'}</div>
        <div className="summary-label">Largest Root</div>
      </div>
    </div>
  );
};

export default SummaryStats;
