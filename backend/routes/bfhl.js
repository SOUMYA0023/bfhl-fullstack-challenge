const express = require('express');
const router = express.Router();
const { validateEdge } = require('../utils/validator');
const { buildGraph, detectRoots, groupNodesByRoot } = require('../utils/graphBuilder');
const { detectCycle } = require('../utils/cycleDetector');
const { buildTree, calculateDepth } = require('../utils/treeBuilder');
const { generateSummary } = require('../utils/summary');

// POST /bfhl - Process hierarchical graph data
router.post('/', async (req, res) => {
  try {
    const { data } = req.body;

    // Validate request body
    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ 
        error: 'Invalid request body. Expected { "data": [...] }' 
      });
    }

    // Step 1: Preprocess and validate edges
    const validEdges = [];
    const invalidEntries = [];
    const seenEdges = new Set();
    const duplicateEdges = [];
    const edgeFirstOccurrence = new Map();

    for (let i = 0; i < data.length; i++) {
      const rawEntry = data[i];
      
      // Skip null/undefined values
      if (rawEntry === null || rawEntry === undefined) {
        continue;
      }

      // Trim whitespace
      const entry = String(rawEntry).trim();

      // Empty string check after trim
      if (entry === '') {
        invalidEntries.push(rawEntry !== undefined ? String(rawEntry) : 'undefined');
        continue;
      }

      // Validate edge format
      const validation = validateEdge(entry);
      
      if (!validation.valid) {
        invalidEntries.push(entry);
        continue;
      }

      const normalizedEdge = `${validation.parent}->${validation.child}`;

      // Check for duplicates
      if (seenEdges.has(normalizedEdge)) {
        // Only add to duplicate_edges once
        if (!duplicateEdges.includes(normalizedEdge)) {
          duplicateEdges.push(normalizedEdge);
        }
        continue;
      }

      seenEdges.add(normalizedEdge);
      edgeFirstOccurrence.set(normalizedEdge, i);
      validEdges.push(validation);
    }

    // Step 2: Build graph with multi-parent handling
    const { 
      children, 
      parent, 
      nodes, 
      ignoredEdges 
    } = buildGraph(validEdges);

    // Step 3: Detect roots
    const roots = detectRoots(nodes, parent);

    // Step 4: Group nodes by root (handles multiple trees and cycles)
    const nodeGroups = groupNodesByRoot(nodes, children, parent, roots);

    // Step 5: Build hierarchies
    const hierarchies = [];
    
    for (const group of nodeGroups) {
      const { root, groupNodes } = group;
      
      // Check for cycle using DFS
      const cycleInfo = detectCycle(root, children, groupNodes);
      
      if (cycleInfo.hasCycle) {
        // Cycle detected - return with has_cycle flag
        const tree = buildTree(root, children, new Set(groupNodes), true);
        hierarchies.push({
          root: root,
          tree: tree,
          has_cycle: true
        });
      } else {
        // No cycle - build tree and calculate depth
        const tree = buildTree(root, children, new Set(groupNodes), false);
        const depth = calculateDepth(root, children, new Set(groupNodes));
        hierarchies.push({
          root: root,
          tree: tree,
          depth: depth
        });
      }
    }

    // Step 6: Generate summary
    const summary = generateSummary(hierarchies);

    // Step 7: Build response
    const response = {
      user_id: 'john_doe_17091999',
      email_id: 'john@xyz.com',
      college_roll_number: 'CU123456',
      hierarchies: hierarchies,
      invalid_entries: invalidEntries,
      duplicate_edges: duplicateEdges,
      summary: summary
    };

    res.json(response);

  } catch (error) {
    console.error('Error processing BFHL request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
