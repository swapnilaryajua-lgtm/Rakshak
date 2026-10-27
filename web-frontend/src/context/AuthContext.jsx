import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authFetch, API_BASE_URL } from '../services/apiClient.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate session on mount
  useEffect(() => {
    const fetchMe = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const userData = await authFetch('/api/v1/users/me');
        setUser(userData);
      } catch (err) {
        console.error('Failed to restore session:', err);
        localStorage.removeItem('access_token');
      } finally {
        setLoading(false);
      }
    };
    
    // Listen for unauthorized events to automatically logout
    const handleUnauthorized = () => setUser(null);
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    
    fetchMe();
    
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const login = useCallback(async (email, password) => {
    // OAuth2 requires form data (application/x-www-form-urlencoded)
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const data = await authFetch('/api/v1/auth/login', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    localStorage.setItem('access_token', data.access_token);
    
    // Fetch profile
    const userData = await authFetch('/api/v1/users/me');
    setUser(userData);
    return userData;
  }, []);

  const register = useCallback(async (name, email, password, aadhaar_verified = false) => {
    await authFetch('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, aadhaar_verified }),
    });
    // Immediately log them in after registration
    return await login(email, password);
  }, [login]);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    setUser(null);
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin' && user?.email?.toLowerCase() === 'hidoiarya@gmail.com',
    isPremium: user?.subscription_tier === 'pro' || user?.subscription_tier === 'defense',
    loading,
    login,
    register,
    logout,
  };

  if (loading) {
    // Don't render the app until we've checked the session
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading session...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
