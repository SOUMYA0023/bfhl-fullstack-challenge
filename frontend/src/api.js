const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Pings /health to wake up the Render free-tier instance before the real
 * request. Intentionally fire-and-forget — we don't await or throw here so
 * a missing /health endpoint never breaks the main flow.
 */
export const warmUp = () => {
  fetch(`${API_URL}/health`).catch(() => {});
};

/**
 * Submits graph relationship data to the backend.
 * No AbortController / hard timeout — Render cold-starts can take 30-50 s
 * and we must let the browser wait naturally.
 */
export const submitData = async (data) => {
  let response;

  try {
    response = await fetch(`${API_URL}/bfhl`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    });
  } catch (error) {
    // fetch() itself threw — network unreachable or DNS failure
    if (error.name === 'TypeError') {
      throw new Error('Network error. Please check your connection.');
    }
    throw error;
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    if (response.status === 400) {
      throw new Error(errorData?.error || 'Invalid request body');
    } else if (response.status === 500) {
      throw new Error('Server error. Please try again later.');
    } else {
      throw new Error(`Unexpected error (HTTP ${response.status})`);
    }
  }

  return response.json();
};
