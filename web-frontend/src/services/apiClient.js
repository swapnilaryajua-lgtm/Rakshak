export const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (typeof window !== 'undefined' && window.location.port === '5173' ? 'http://localhost:8000' : '');

export async function authFetch(endpoint, options = {}) {
  const token = localStorage.getItem('access_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  // Only add Authorization header if we have a token
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Remove Content-Type if we're sending FormData (e.g., OAuth2 login form)
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Unauthorized: token might be expired. Clear it.
    localStorage.removeItem('access_token');
    // We could dispatch an event here for the AuthContext to log the user out
    window.dispatchEvent(new Event('auth:unauthorized'));
  }

  // If response has no body (e.g. 204 No Content), don't try to parse JSON
  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.detail || response.statusText || 'An error occurred');
  }

  return data;
}
