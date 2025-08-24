import React, { useState } from 'react';
import './App.css';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { useAuth } from './hooks/useAuth';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ExamDetail from './components/ExamDetail.tsx';

const AuthWrapper: React.FC = () => {
  const { currentUser } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  if (currentUser) {
    return <Dashboard />;
  }

  return (
    <div className="main-container">
      <h1>React Login & Register with Firebase</h1>
      {isLogin ? (
        <Login onSwitchToRegister={() => setIsLogin(false)} />
      ) : (
        <Register onSwitchToLogin={() => setIsLogin(true)} />
      )}
    </div>
  );
};


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/my-kids-study/" element={<AuthWrapper />} />
          <Route path="/my-kids-study/exam/:id" element={<ExamDetail />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
