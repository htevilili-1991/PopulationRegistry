import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import './App.css';
import CitizenList from './components/CitizenList';
import AddCitizen from './components/AddCitizen';
import EditCitizen from './components/EditCitizen';
import Login from './components/Login';
// import Register from './components/Register'; // Register component is no longer publicly accessible
import { User } from './types'; // Assuming you have a User type defined
import { fetchCurrentUser } from './api'; // Import the new API call

interface AuthContextType {
  user: User | null;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const loadUser = useCallback(async () => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      try {
        const currentUser = await fetchCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Failed to fetch current user:", error);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
      }
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = (accessToken: string, refreshToken: string) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    loadUser(); // Fetch user details after login
    navigate('/citizens');
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const PrivateRoute = ({ children }: { children: React.ReactElement }): React.ReactElement | null => {
  const auth = useContext(AuthContext);
  if (!auth?.user) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth?.user && window.location.pathname !== '/login') {
      navigate('/login');
    }
  }, [auth?.user, navigate]);

  return (
    <div className="App d-flex">
      {/* Sidebar */}
      {auth?.user && ( // Only show sidebar if logged in
        <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark" style={{ width: '280px', height: '100vh' }}>
          <Link to="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
            <span className="fs-4">Population Registry</span>
          </Link>
          <hr />
          <ul className="nav nav-pills flex-column mb-auto">
            <li className="nav-item">
              <Link to="/citizens" className="nav-link text-white" aria-current="page">
                View Citizens
              </Link>
            </li>
            <li>
              <Link to="/add-citizen" className="nav-link text-white">
                Add Citizen
              </Link>
            </li>
            <li>
              <button onClick={auth.logout} className="nav-link text-white btn btn-link">
                Logout ({auth.user.username})
              </button>
            </li>
          </ul>
          <hr />
        </div>
      )}

      {/* Main Content */}
      <div className="container-fluid p-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          {/* <Route path="/register" element={<Register />} /> Removed public registration */}
          <Route path="/" element={<PrivateRoute><CitizenList /></PrivateRoute>} />
          <Route path="/citizens" element={<PrivateRoute><CitizenList /></PrivateRoute>} />
          <Route path="/add-citizen" element={<PrivateRoute><AddCitizen /></PrivateRoute>} />
          <Route path="/edit-citizen/:id" element={<PrivateRoute><EditCitizen /></PrivateRoute>} />
        </Routes>
      </div>
    </div>
  );
}

const AppWrapper: React.FC = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default AppWrapper;
