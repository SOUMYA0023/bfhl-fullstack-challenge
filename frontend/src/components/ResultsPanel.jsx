import React from 'react';
import SummaryStats from './SummaryStats';
import HierarchyViewer from './HierarchyViewer';

const ResultsPanel = ({ response }) => {
  const { hierarchies, invalid_entries, duplicate_edges, summary } = response;

  return (
    <section className="panel results-panel fade-in">
      <div className="panel-header">
        <h2 className="panel-title">Results</h2>
        <span className="result-count">
          {hierarchies?.length || 0} hierarch{hierarchies?.length === 1 ? 'y' : 'ies'} found
        </span>
      </div>

      <SummaryStats summary={summary} />

      {hierarchies && hierarchies.length > 0 && (
        <div className="results-section">
          <h3 className="section-title">Hierarchies</h3>
          <div className="hierarchies-container">
            {hierarchies.map((hierarchy, index) => (
              <HierarchyViewer key={index} hierarchy={hierarchy} index={index + 1} />
            ))}
          </div>
        </div>
      )}

      {invalid_entries && invalid_entries.length > 0 && (
        <div className="results-section">
          <h3 className="section-title">
            Invalid Entries
            <span className="count-badge">{invalid_entries.length}</span>
          </h3>
          <div className="entries-list">
            {invalid_entries.map((entry, index) => (
              <span key={index} className="entry-chip error-chip">
                {entry}
              </span>
            ))}
          </div>
        </div>
      )}

      {duplicate_edges && duplicate_edges.length > 0 && (
        <div className="results-section">
          <h3 className="section-title">
            Duplicate Edges
            <span className="count-badge">{duplicate_edges.length}</span>
          </h3>
          <div className="entries-list">
            {duplicate_edges.map((edge, index) => (
              <span key={index} className="entry-chip warning-chip">
                {edge}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default ResultsPanel;
