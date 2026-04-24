# BFHL Frontend - Hierarchical Graph Processor

A clean, responsive React frontend for interacting with the BFHL Hierarchical Graph API.

## Features

- **Input Parsing**: Accepts hierarchical relationships in `Parent->Child` format
- **API Integration**: Communicates with backend API for graph processing
- **Visual Tree Display**: Collapsible hierarchical tree visualization
- **Summary Statistics**: Displays total trees, cycles, and largest tree root
- **Error Handling**: Clear error messages for invalid input and network issues
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **React 18** with Vite
- **Plain CSS** (no heavy UI libraries)
- **Fetch API** for HTTP requests
- **Functional Components** with React Hooks

## Getting Started

### Prerequisites

- Node.js >= 14.0.0
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/SOUMYA0023/bfhl-fullstack-challenge.git
cd bfhl-fullstack-challenge/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:3000
```

Replace `http://localhost:3000` with your backend API URL.

### Running the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The production build will be in the `dist` folder.

## Usage

1. **Enter Data**: Input hierarchical relationships in the textarea, one per line:
   ```
   A->B
   A->C
   B->D
   C->E
   ```

2. **Submit**: Click the "Submit" button to send data to the backend API

3. **View Results**: The response will display:
   - Summary statistics (total trees, cycles, largest tree root)
   - Hierarchical tree structures (collapsible)
   - Invalid entries (if any)
   - Duplicate edges (if any)

## Project Structure

```
frontend/
├── .env                     # Environment variables
├── package.json             # Dependencies and scripts
├── vite.config.js           # Vite configuration
├── src/
│   ├── main.jsx             # Application entry point
│   ├── App.jsx              # Main app component
│   ├── api.js               # API integration layer
│   ├── styles.css           # Global styles
│   └── components/
│       ├── InputSection.jsx     # Input form component
│       ├── ResponseDisplay.jsx  # Response display component
│       ├── HierarchyTree.jsx    # Tree visualization component
│       └── Summary.jsx          # Summary statistics component
```

## API Integration

The frontend communicates with the backend via:

- **Endpoint**: `POST {API_URL}/bfhl`
- **Request Body**: `{ "data": ["A->B", "A->C", ...] }`
- **Response**: JSON object with hierarchies, invalid entries, duplicates, and summary

## Error Handling

The app handles various error scenarios:

- Empty input validation
- Network failures
- Server errors (4xx, 5xx)
- Request timeout (10 seconds)
- Invalid API responses

## Design Features

- Clean, centered layout with gradient background
- Smooth fade-in animations for response display
- Loading spinner during API calls
- Disabled button states while loading
- Mobile-responsive design
- Subtle hover effects on interactive elements
- Color-coded error and warning messages

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:3000` |

## License

MIT
