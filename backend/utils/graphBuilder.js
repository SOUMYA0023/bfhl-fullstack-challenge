/**
 * Builds graph data structures from validated edges
 * Handles multi-parent rule: only first parent is valid
 */
function buildGraph(validEdges) {
  const children = new Map(); // parent -> Set of children
  const parent = new Map();     // child -> parent (only one parent allowed)
  const nodes = new Set();
  const ignoredEdges = [];

  // Initialize all nodes
  for (const edge of validEdges) {
    nodes.add(edge.parent);
    nodes.add(edge.child);
  }

  // Process edges in order
  for (const edge of validEdges) {
    const { parent: p, child: c } = edge;

    // Check if child already has a parent (multi-parent rule)
    if (parent.has(c)) {
      // Child already has a parent, ignore this edge silently
      ignoredEdges.push(`${p}->${c}`);
      continue;
    }

    // Add to children map
    if (!children.has(p)) {
      children.set(p, new Set());
    }
    children.get(p).add(c);

    // Set parent for child
    parent.set(c, p);
  }

  return {
    children,
    parent,
    nodes,
    ignoredEdges
  };
}

/**
 * Detects root nodes (nodes that never appear as children)
 * Multiple roots possible
 */
function detectRoots(nodes, parentMap) {
  const roots = [];
  
  for (const node of nodes) {
    if (!parentMap.has(node)) {
      roots.push(node);
    }
  }
  
  return roots.sort(); // Return sorted roots
}

/**
 * Groups nodes by their root using BFS traversal
 * Handles disconnected components and cycles
 */
function groupNodesByRoot(nodes, childrenMap, parentMap, roots) {
  const nodeGroups = [];
  const visited = new Set();
  const allNodes = Array.from(nodes).sort();

  // First, process nodes with explicit roots
  for (const root of roots) {
    const groupNodes = new Set();
    const queue = [root];
    
    while (queue.length > 0) {
      const node = queue.shift();
      
      if (visited.has(node)) continue;
      visited.add(node);
      groupNodes.add(node);
      
      // Add children
      if (childrenMap.has(node)) {
        for (const child of childrenMap.get(node)) {
          if (!visited.has(child)) {
            queue.push(child);
          }
        }
      }
    }
    
    nodeGroups.push({
      root: root,
      groupNodes: Array.from(groupNodes).sort()
    });
  }

  // Handle remaining unvisited nodes (cycle groups with no root)
  const unvisitedNodes = allNodes.filter(n => !visited.has(n));
  
  if (unvisitedNodes.length > 0) {
    // Group unvisited nodes by connected components
    const cycleGroups = findConnectedComponents(unvisitedNodes, childrenMap, parentMap);
    
    for (const component of cycleGroups) {
      // Root = lexicographically smallest node in cycle
      const root = component.reduce((min, node) => node < min ? node : min, component[0]);
      nodeGroups.push({
        root: root,
        groupNodes: component
      });
    }
  }

  return nodeGroups;
}

/**
 * Finds connected components in a set of nodes
 */
function findConnectedComponents(nodes, childrenMap, parentMap) {
  const components = [];
  const nodeSet = new Set(nodes);
  const visited = new Set();

  for (const startNode of nodes) {
    if (visited.has(startNode)) continue;

    const component = [];
    const queue = [startNode];

    while (queue.length > 0) {
      const node = queue.shift();
      
      if (visited.has(node)) continue;
      visited.add(node);
      component.push(node);

      // Check children
      if (childrenMap.has(node)) {
        for (const child of childrenMap.get(node)) {
          if (nodeSet.has(child) && !visited.has(child)) {
            queue.push(child);
          }
        }
      }

      // Check parent
      if (parentMap.has(node)) {
        const p = parentMap.get(node);
        if (nodeSet.has(p) && !visited.has(p)) {
          queue.push(p);
        }
      }
    }

    components.push(component.sort());
  }

  return components;
}

module.exports = {
  buildGraph,
  detectRoots,
  groupNodesByRoot
};
