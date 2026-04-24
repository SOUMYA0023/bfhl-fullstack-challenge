import React, { useState } from 'react';

const TreeNode = ({ node, depth = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const hasChildren = node.children && node.children.length > 0;
  
  const toggleExpand = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className="tree-node" style={{ marginLeft: depth > 0 ? '20px' : '0' }}>
      <div 
        className={`tree-node-content ${hasChildren ? 'clickable' : ''}`}
        onClick={toggleExpand}
      >
        {hasChildren && (
          <span className="tree-toggle">{isExpanded ? '▼' : '▶'}</span>
        )}
        <span className="tree-label">{node.value}</span>
      </div>
      
      {hasChildren && isExpanded && (
        <div className="tree-children">
          {node.children.map((child, index) => (
            <TreeNode key={`${child.value}-${index}`} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const HierarchyTree = ({ hierarchy }) => {
  const { root, tree, depth, has_cycle } = hierarchy;

  return (
    <div className="hierarchy-card">
      <div className="hierarchy-header">
        <h3>Root: {root}</h3>
        <div className="hierarchy-meta">
          {depth !== undefined && <span className="meta-tag">Depth: {depth}</span>}
          {has_cycle && <span className="meta-tag warning">Has Cycle</span>}
        </div>
      </div>
      
      <div className="tree-container">
        <TreeNode node={tree} />
      </div>
    </div>
  );
};

export default HierarchyTree;
