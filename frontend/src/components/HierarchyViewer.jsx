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
    <div className="tree-item" style={{ paddingLeft: depth > 0 ? '16px' : '0' }}>
      <div 
        className={`tree-node ${hasChildren ? 'is-expandable' : ''}`}
        onClick={toggleExpand}
      >
        {hasChildren && (
          <span className="tree-toggle">{isExpanded ? '▾' : '▸'}</span>
        )}
        <span className="tree-value">{node.value}</span>
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

const HierarchyViewer = ({ hierarchy, index }) => {
  const { root, tree, depth, has_cycle } = hierarchy;

  return (
    <div className="hierarchy-block">
      <div className="hierarchy-header">
        <span className="hierarchy-index">{index}</span>
        <span className="hierarchy-root">
          Root: <code>{root}</code>
        </span>
        <div className="hierarchy-meta">
          {depth !== undefined && (
            <span className="meta-item">Depth: {depth}</span>
          )}
          {has_cycle && (
            <span className="meta-item has-cycle">Contains cycle</span>
          )}
        </div>
      </div>
      
      <div className="tree-display">
        <TreeNode node={tree} />
      </div>
    </div>
  );
};

export default HierarchyViewer;
