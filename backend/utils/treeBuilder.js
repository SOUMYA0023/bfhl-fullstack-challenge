/**
 * Builds a nested tree object recursively
 * Format: { "A": { "B": { "D": {} } } }
 * 
 * For cycles, includes all reachable nodes
 */
function buildTree(root, childrenMap, groupNodes, isCycle) {
  const tree = {};
  const visited = new Set();

  function buildNode(node) {
    // For non-cycles, prevent revisiting nodes
    if (!isCycle && visited.has(node)) {
      return {};
    }
    
    // For cycles, allow one revisit to show the structure
    if (isCycle && visited.has(node)) {
      return {};
    }

    visited.add(node);

    const subtree = {};

    if (childrenMap.has(node)) {
      const sortedChildren = Array.from(childrenMap.get(node))
        .filter(child => groupNodes.has(child))
        .sort();

      for (const child of sortedChildren) {
        subtree[child] = buildNode(child);
      }
    }

    return subtree;
  }

  tree[root] = buildNode(root);
  return tree;
}

/**
 * Calculates depth (longest path from root to leaf)
 * Uses DFS to find the maximum depth
 * Depth = number of nodes in longest path
 */
function calculateDepth(root, childrenMap, groupNodes) {
  const memo = new Map();

  function getDepth(node, visitedInPath) {
    // Check memo
    if (memo.has(node)) {
      return memo.get(node);
    }

    // Prevent infinite recursion
    if (visitedInPath.has(node)) {
      return 1;
    }

    visitedInPath.add(node);

    let maxChildDepth = 0;

    if (childrenMap.has(node)) {
      const validChildren = Array.from(childrenMap.get(node))
        .filter(child => groupNodes.has(child));

      for (const child of validChildren) {
        const childDepth = getDepth(child, new Set(visitedInPath));
        maxChildDepth = Math.max(maxChildDepth, childDepth);
      }
    }

    const depth = 1 + maxChildDepth;
    memo.set(node, depth);
    return depth;
  }

  return getDepth(root, new Set());
}

module.exports = {
  buildTree,
  calculateDepth
};
