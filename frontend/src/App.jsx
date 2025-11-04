import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/login';
import SignUp from './components/signup';
import HomePage from './components/homepage';
import AboutPage from './components/about';
import TodoPage from './components/todo';
import SearchPage from './components/search';
import Navbar from './components/navbar';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />
        <Route path="/about" element={
          <ProtectedRoute>
            <AboutPage />
          </ProtectedRoute>
        } />
        <Route path="/todos" element={
          <ProtectedRoute>
            <TodoPage />
          </ProtectedRoute>
        } />
        <Route path="/search" element={
          <ProtectedRoute>
            <SearchPage />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
