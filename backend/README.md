# BFHL Hierarchical Graph API

Production-grade REST API for hierarchical graph processing with cycle detection, multi-parent handling, and tree construction.

## Features

- **Graph Processing**: Builds adjacency lists from edge definitions
- **Validation**: Strict validation for edge format (X->Y)
- **Duplicate Detection**: Identifies and reports duplicate edges
- **Multi-Parent Handling**: Only first parent is valid for each child
- **Cycle Detection**: DFS-based cycle detection with proper root assignment
- **Tree Construction**: Recursive tree building with depth calculation
- **Multiple Trees**: Supports disconnected graphs

## Tech Stack

- Node.js 14+
- Express.js
- CORS enabled
- ES6+ syntax

## Installation

```bash
# Install dependencies
npm install

# Start server
npm start

# Development mode with auto-reload
npm run dev
```

## API Documentation

### POST /bfhl

Processes hierarchical graph data and returns structured hierarchies.

**Request**

```json
{
  "data": ["A->B", "A->C", "B->D"]
}
```

**Response**

```json
{
  "user_id": "john_doe_17091999",
  "email_id": "john@xyz.com",
  "college_roll_number": "CU123456",
  "hierarchies": [
    {
      "root": "A",
      "tree": {
        "A": {
          "B": {
            "D": {}
          },
          "C": {}
        }
      },
      "depth": 3
    }
  ],
  "invalid_entries": [],
  "duplicate_edges": [],
  "summary": {
    "total_trees": 1,
    "total_cycles": 0,
    "largest_tree_root": "A"
  }
}
```

### GET /health

Health check endpoint.

**Response**

```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Validation Rules

Each entry must match:
- Format: `X->Y`
- X and Y must be single uppercase letters (A-Z)

**Invalid cases:**
- Numbers (1->2)
- Multi-character nodes (AB->C)
- Wrong separator (A-B)
- Missing nodes (A->)
- Self-loop (A->A)
- Empty string

## Edge Cases

### Duplicate Handling

```json
// Input
{ "data": ["A->B", "A->B", "A->B"] }

// Result
{
  "duplicate_edges": ["A->B"],
  // Only first occurrence used
}
```

### Multi-Parent Rule

```json
// Input
{ "data": ["A->C", "B->C"] }

// Result: Only A->C is valid, B->C is ignored
```

### Cycle Detection

```json
// Input
{ "data": ["A->B", "B->A"] }

// Result
{
  "hierarchies": [{
    "root": "A",
    "tree": { ... },
    "has_cycle": true
    // No depth field
  }],
  "summary": {
    "total_cycles": 1
  }
}
```

## Testing

```bash
# Run all tests
npm test

# Manual test with curl
curl -X POST http://localhost:3000/bfhl \
  -H "Content-Type: application/json" \
  -d '{"data": ["A->B", "B->C", "C->D"]}'
```

## Test Cases

### Basic Valid Tree
```bash
curl -X POST http://localhost:3000/bfhl \
  -H "Content-Type: application/json" \
  -d '{"data": ["A->B", "A->C", "B->D"]}'
```

### Empty Input
```bash
curl -X POST http://localhost:3000/bfhl \
  -H "Content-Type: application/json" \
  -d '{"data": []}'
```

### All Invalid
```bash
curl -X POST http://localhost:3000/bfhl \
  -H "Content-Type: application/json" \
  -d '{"data": ["1->2", "AB->C", "A-B", "A->", "A->A", ""]}'
```

### Cycle Detection
```bash
curl -X POST http://localhost:3000/bfhl \
  -H "Content-Type: application/json" \
  -d '{"data": ["A->B", "B->C", "C->A"]}'
```

### Multiple Trees
```bash
curl -X POST http://localhost:3000/bfhl \
  -H "Content-Type: application/json" \
  -d '{"data": ["A->B", "C->D", "E->F"]}'
```

### Mixed Valid + Invalid
```bash
curl -X POST http://localhost:3000/bfhl \
  -H "Content-Type: application/json" \
  -d '{"data": ["A->B", "invalid", "B->C", "123"]}'
```

### Multi-Parent (First Wins)
```bash
curl -X POST http://localhost:3000/bfhl \
  -H "Content-Type: application/json" \
  -d '{"data": ["A->C", "B->C"]}'
```

### Large Input (50 nodes)
```bash
curl -X POST http://localhost:3000/bfhl \
  -H "Content-Type: application/json" \
  -d '{
    "data": [
      "A->B", "A->C", "A->D", "A->E", "A->F",
      "B->G", "B->H", "B->I", "B->J", "B->K",
      "C->L", "C->M", "C->N", "C->O", "C->P",
      "D->Q", "D->R", "D->S", "D->T", "D->U",
      "E->V", "E->W", "E->X", "E->Y", "E->Z"
    ]
  }'
```

## Project Structure

```
backend/
├── server.js              # Express server setup
├── package.json           # Dependencies and scripts
├── README.md             # Documentation
├── routes/
│   └── bfhl.js           # Main API route
├── utils/
│   ├── validator.js      # Edge validation
│   ├── graphBuilder.js   # Graph construction
│   ├── cycleDetector.js  # Cycle detection
│   ├── treeBuilder.js    # Tree construction
│   └── summary.js        # Summary generation
└── test/
    └── test.js           # Test suite
```

## Performance

- Handles 50+ nodes under 3 seconds
- Optimized DFS with memoization
- Efficient duplicate detection using Sets

## Deployment

### Local Development
```bash
npm install
npm start
```

### Production
```bash
# Set environment variables
export PORT=3000

# Start server
npm start
```

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## Response Format Rules

1. **has_cycle** is only present when true (never has_cycle=false)
2. **depth** is only present for non-cyclic trees
3. Cyclic groups use lexicographically smallest node as root
4. Trees are sorted lexicographically in output

## Error Handling

- **400**: Invalid request body
- **404**: Not Found
- **500**: Internal Server Error

## CORS

Enabled for all origins:
- All HTTP methods
- Content-Type and Authorization headers
