/**
 * Generates summary statistics from hierarchies
 * 
 * {
 *   total_trees: count of non-cyclic trees,
 *   total_cycles: count of cyclic groups,
 *   largest_tree_root: root with max depth
 * }
 * 
 * Tie-breaking: If equal depth → lexicographically smaller root
 */
function generateSummary(hierarchies) {
  let totalTrees = 0;
  let totalCycles = 0;
  
  let maxDepth = 0;
  let largestTreeRoot = null;

  for (const h of hierarchies) {
    if (h.has_cycle) {
      totalCycles++;
    } else {
      totalTrees++;
      
      // Track largest tree by depth
      const depth = h.depth;
      const root = h.root;
      
      if (depth > maxDepth) {
        maxDepth = depth;
        largestTreeRoot = root;
      } else if (depth === maxDepth) {
        // Tie-breaker: lexicographically smaller root
        if (largestTreeRoot === null || root < largestTreeRoot) {
          largestTreeRoot = root;
        }
      }
    }
  }

  return {
    total_trees: totalTrees,
    total_cycles: totalCycles,
    largest_tree_root: largestTreeRoot
  };
}

module.exports = {
  generateSummary
};
