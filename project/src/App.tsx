import React from 'react';
import { Login } from './components/Login';
import { Layout } from './components/Layout';
import { useAuth } from './hooks/useAuth';

function App() {
  const { isAuthenticated, currentUser, login, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || !currentUser) {
    return <Login onLogin={login} />;
  }

  return (
    <Layout currentUser={currentUser} onLogout={logout} />
  );
}

export default App;