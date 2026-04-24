/**
 * Detects cycles in a graph using DFS with recursion stack
 * Returns cycle information for the component
 */
function detectCycle(startNode, childrenMap, groupNodes) {
  const groupNodeSet = new Set(groupNodes);
  const visited = new Set();
  const recursionStack = new Set();

  function dfs(node) {
    if (recursionStack.has(node)) {
      return true; // Cycle detected
    }

    if (visited.has(node)) {
      return false;
    }

    visited.add(node);
    recursionStack.add(node);

    // Check children
    if (childrenMap.has(node)) {
      for (const child of childrenMap.get(node)) {
        if (groupNodeSet.has(child)) {
          if (dfs(child)) {
            return true;
          }
        }
      }
    }

    recursionStack.delete(node);
    return false;
  }

  // Start DFS from the given node
  const hasCycle = dfs(startNode);

  return {
    hasCycle: hasCycle
  };
}

module.exports = {
  detectCycle
};
