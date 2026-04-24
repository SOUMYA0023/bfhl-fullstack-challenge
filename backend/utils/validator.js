/**
 * Validates an edge entry according to strict rules
 * Format: X->Y where X and Y are single uppercase letters (A-Z)
 * 
 * Invalid cases:
 * - Any string not matching exact pattern
 * - Numbers (1->2)
 * - Multi-character nodes (AB->C)
 * - Wrong separator (A-B)
 * - Missing nodes (A->)
 * - Self-loop (A->A)
 */
function validateEdge(entry) {
  // Must match exactly: single uppercase letter, '->', single uppercase letter
  const edgeRegex = /^([A-Z])->([A-Z])$/;
  
  const match = entry.match(edgeRegex);
  
  if (!match) {
    return { valid: false };
  }
  
  const parent = match[1];
  const child = match[2];
  
  // Check for self-loop
  if (parent === child) {
    return { valid: false };
  }
  
  return {
    valid: true,
    parent: parent,
    child: child,
    original: entry
  };
}

module.exports = {
  validateEdge
};
