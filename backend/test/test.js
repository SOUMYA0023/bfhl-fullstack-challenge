/**
 * Test Suite for BFHL Hierarchical Graph API
 * Run with: node test/test.js
 */

const http = require('http');

const BASE_URL = 'localhost';
const PORT = 3000;

// Test cases
const testCases = [
  {
    name: 'Basic valid tree',
    input: { data: ["A->B", "A->C", "B->D"] },
    expected: {
      hierarchies: [
        { root: "A", depth: 3 }
      ],
      invalid_entries: [],
      duplicate_edges: [],
      summary: { total_trees: 1, total_cycles: 0, largest_tree_root: "A" }
    }
  },
  {
    name: 'Empty input',
    input: { data: [] },
    expected: {
      hierarchies: [],
      invalid_entries: [],
      duplicate_edges: [],
      summary: { total_trees: 0, total_cycles: 0, largest_tree_root: null }
    }
  },
  {
    name: 'All invalid inputs',
    input: { data: ["1->2", "AB->C", "A-B", "A->", "A->A", ""] },
    expected: {
      hierarchies: [],
      invalid_entries: ["1->2", "AB->C", "A-B", "A->", "A->A", ""],
      duplicate_edges: [],
      summary: { total_trees: 0, total_cycles: 0, largest_tree_root: null }
    }
  },
  {
    name: 'Duplicate edges',
    input: { data: ["A->B", "A->B", "A->B", "B->C"] },
    expected: {
      hierarchies: [
        { root: "A", depth: 3 }
      ],
      invalid_entries: [],
      duplicate_edges: ["A->B"],
      summary: { total_trees: 1, total_cycles: 0, largest_tree_root: "A" }
    }
  },
  {
    name: 'Multi-parent conflict (only first parent valid)',
    input: { data: ["A->C", "B->C"] },
    expected: {
      hierarchies: [
        { root: "A", depth: 2 },
        { root: "B", depth: 1 }
      ],
      invalid_entries: [],
      duplicate_edges: [],
      summary: { total_trees: 2, total_cycles: 0, largest_tree_root: "A" }
    }
  },
  {
    name: 'Simple cycle A->B->A',
    input: { data: ["A->B", "B->A"] },
    expected: {
      hierarchies: [
        { root: "A", has_cycle: true }
      ],
      invalid_entries: [],
      duplicate_edges: [],
      summary: { total_trees: 0, total_cycles: 1, largest_tree_root: null }
    }
  },
  {
    name: 'Cycle A->B->C->A',
    input: { data: ["A->B", "B->C", "C->A"] },
    expected: {
      hierarchies: [
        { root: "A", has_cycle: true }
      ],
      invalid_entries: [],
      duplicate_edges: [],
      summary: { total_trees: 0, total_cycles: 1, largest_tree_root: null }
    }
  },
  {
    name: 'Mixed valid + invalid',
    input: { data: ["A->B", "invalid", "B->C", "123", "C->D"] },
    expected: {
      hierarchies: [
        { root: "A", depth: 4 }
      ],
      invalid_entries: ["invalid", "123"],
      duplicate_edges: [],
      summary: { total_trees: 1, total_cycles: 0, largest_tree_root: "A" }
    }
  },
  {
    name: 'Multiple trees',
    input: { data: ["A->B", "C->D", "E->F"] },
    expected: {
      hierarchies: [
        { root: "A", depth: 2 },
        { root: "C", depth: 2 },
        { root: "E", depth: 2 }
      ],
      invalid_entries: [],
      duplicate_edges: [],
      summary: { total_trees: 3, total_cycles: 0, largest_tree_root: "A" }
    }
  },
  {
    name: 'Whitespace trimming',
    input: { data: [" A->B ", "  B->C  ", "C->D"] },
    expected: {
      hierarchies: [
        { root: "A", depth: 4 }
      ],
      invalid_entries: [],
      duplicate_edges: [],
      summary: { total_trees: 1, total_cycles: 0, largest_tree_root: "A" }
    }
  },
  {
    name: 'Null/undefined handling',
    input: { data: ["A->B", null, undefined, "B->C"] },
    expected: {
      hierarchies: [
        { root: "A", depth: 3 }
      ],
      invalid_entries: [],
      duplicate_edges: [],
      summary: { total_trees: 1, total_cycles: 0, largest_tree_root: "A" }
    }
  },
  {
    name: 'Large tree (50 nodes)',
    input: { 
      data: [
        "A->B", "A->C", "A->D", "A->E", "A->F",
        "B->G", "B->H", "B->I", "B->J", "B->K",
        "C->L", "C->M", "C->N", "C->O", "C->P",
        "D->Q", "D->R", "D->S", "D->T", "D->U",
        "E->V", "E->W", "E->X", "E->Y", "E->Z"
      ]
    },
    expected: {
      hierarchies: [
        { root: "A", depth: 3 }
      ],
      invalid_entries: [],
      duplicate_edges: [],
      summary: { total_trees: 1, total_cycles: 0, largest_tree_root: "A" }
    }
  },
  {
    name: 'Tree with depth 5',
    input: { data: ["A->B", "B->C", "C->D", "D->E"] },
    expected: {
      hierarchies: [
        { root: "A", depth: 5 }
      ],
      invalid_entries: [],
      duplicate_edges: [],
      summary: { total_trees: 1, total_cycles: 0, largest_tree_root: "A" }
    }
  },
  {
    name: 'Tie-breaking equal depth',
    input: { data: ["B->C", "A->D"] },
    expected: {
      hierarchies: [
        { root: "A", depth: 2 },
        { root: "B", depth: 2 }
      ],
      invalid_entries: [],
      duplicate_edges: [],
      summary: { total_trees: 2, total_cycles: 0, largest_tree_root: "A" }
    }
  },
  {
    name: 'Complex mixed scenario',
    input: { 
      data: [
        "A->B", "B->C", 
        "X->Y", "Y->X",
        "P->Q", "P->Q", "P->Q"
      ]
    },
    expected: {
      hierarchies: [
        { root: "A", depth: 3 },
        { root: "P", depth: 2 },
        { root: "X", has_cycle: true }
      ],
      invalid_entries: [],
      duplicate_edges: ["P->Q"],
      summary: { total_trees: 2, total_cycles: 1, largest_tree_root: "A" }
    }
  }
];

// Make HTTP request
function makeRequest(data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: BASE_URL,
      port: PORT,
      path: '/bfhl',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ statusCode: res.statusCode, body: parsed });
        } catch (e) {
          reject(new Error(`Failed to parse response: ${body}`));
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(postData);
    req.end();
  });
}

// Run a single test
async function runTest(testCase) {
  try {
    const response = await makeRequest(testCase.input);
    
    if (response.statusCode !== 200) {
      return {
        name: testCase.name,
        passed: false,
        error: `Expected status 200, got ${response.statusCode}`
      };
    }

    // Verify response structure
    const body = response.body;
    const checks = [];

    // Check hierarchies
    if (testCase.expected.hierarchies) {
      if (body.hierarchies.length !== testCase.expected.hierarchies.length) {
        checks.push(`Expected ${testCase.expected.hierarchies.length} hierarchies, got ${body.hierarchies.length}`);
      } else {
        for (let i = 0; i < testCase.expected.hierarchies.length; i++) {
          const exp = testCase.expected.hierarchies[i];
          const act = body.hierarchies[i];
          
          if (act.root !== exp.root) {
            checks.push(`Hierarchy ${i}: expected root "${exp.root}", got "${act.root}"`);
          }
          if (exp.has_cycle !== undefined && act.has_cycle !== true) {
            checks.push(`Hierarchy ${i}: expected has_cycle`);
          }
          if (exp.depth !== undefined && act.depth !== exp.depth) {
            checks.push(`Hierarchy ${i}: expected depth ${exp.depth}, got ${act.depth}`);
          }
        }
      }
    }

    // Check invalid_entries
    if (body.invalid_entries.length !== testCase.expected.invalid_entries.length) {
      checks.push(`Expected ${testCase.expected.invalid_entries.length} invalid_entries, got ${body.invalid_entries.length}`);
    }

    // Check duplicate_edges
    if (body.duplicate_edges.length !== testCase.expected.duplicate_edges.length) {
      checks.push(`Expected ${testCase.expected.duplicate_edges.length} duplicate_edges, got ${body.duplicate_edges.length}`);
    }

    // Check summary
    if (body.summary.total_trees !== testCase.expected.summary.total_trees) {
      checks.push(`Expected ${testCase.expected.summary.total_trees} total_trees, got ${body.summary.total_trees}`);
    }
    if (body.summary.total_cycles !== testCase.expected.summary.total_cycles) {
      checks.push(`Expected ${testCase.expected.summary.total_cycles} total_cycles, got ${body.summary.total_cycles}`);
    }

    if (checks.length > 0) {
      return {
        name: testCase.name,
        passed: false,
        error: checks.join('; ')
      };
    }

    return {
      name: testCase.name,
      passed: true
    };

  } catch (err) {
    return {
      name: testCase.name,
      passed: false,
      error: err.message
    };
  }
}

// Run all tests
async function runAllTests() {
  console.log('=====================================');
  console.log('BFHL API Test Suite');
  console.log('=====================================\n');

  const results = [];
  
  for (const testCase of testCases) {
    const result = await runTest(testCase);
    results.push(result);
    
    const status = result.passed ? '✓ PASS' : '✗ FAIL';
    console.log(`${status}: ${result.name}`);
    
    if (!result.passed) {
      console.log(`  Error: ${result.error}`);
    }
  }

  console.log('\n=====================================');
  console.log('Summary:');
  console.log('=====================================');
  
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  
  console.log(`Total: ${results.length}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  
  if (failed > 0) {
    console.log('\nFailed tests:');
    results.filter(r => !r.passed).forEach(r => {
      console.log(`  - ${r.name}: ${r.error}`);
    });
    process.exit(1);
  } else {
    console.log('\n✓ All tests passed!');
    process.exit(0);
  }
}

runAllTests();
