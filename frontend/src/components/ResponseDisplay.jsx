import React from 'react';
import HierarchyTree from './HierarchyTree';
import Summary from './Summary';

const ResponseDisplay = ({ response }) => {
  const { hierarchies, invalid_entries, duplicate_edges, summary } = response;

  return (
    <div className="response-display fade-in">
      <Summary summary={summary} />
      
      {hierarchies && hierarchies.length > 0 && (
        <div className="response-section">
          <h2>Hierarchies ({hierarchies.length})</h2>
          <div className="hierarchies-list">
            {hierarchies.map((hierarchy, index) => (
              <HierarchyTree key={index} hierarchy={hierarchy} />
            ))}
          </div>
        </div>
      )}
      
      {invalid_entries && invalid_entries.length > 0 && (
        <div className="response-section">
          <h2>Invalid Entries ({invalid_entries.length})</h2>
          <div className="list-container">
            {invalid_entries.map((entry, index) => (
              <div key={index} className="list-item error">
                {entry}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {duplicate_edges && duplicate_edges.length > 0 && (
        <div className="response-section">
          <h2>Duplicate Edges ({duplicate_edges.length})</h2>
          <div className="list-container">
            {duplicate_edges.map((edge, index) => (
              <div key={index} className="list-item warning">
                {edge}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponseDisplay;
