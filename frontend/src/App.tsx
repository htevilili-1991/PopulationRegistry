import React, { createContext, useState, useEffect, useContext } from 'react';
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import './App.css';
import CitizenList from './components/CitizenList';
import AddCitizen from './components/AddCitizen';
import EditCitizen from './components/EditCitizen';
import Login from './components/Login';
// import Register from './components/Register'; // Register component is no longer publicly accessible
import { User } from './types'; // Assuming you have a User type defined

interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      // In a real app, you would validate the token and fetch user details
      // For now, we'll just assume a token means logged in
      // TODO: Fetch actual user data from backend using the token
      setUser({ id: 1, username: 'test', email: 'test@example.com', is_active: true, role: { id: 1, name: 'admin', permissions: [] } }); // Placeholder user
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem('access_token', token);
    // In a real app, decode token or fetch user details
    // TODO: Fetch actual user data from backend using the token
    setUser({ id: 1, username: 'test', email: 'test@example.com', is_active: true, role: { id: 1, name: 'admin', permissions: [] } }); // Placeholder user
    navigate('/citizens');
  };

  const logout = () => {
    localStorage.removeItem('access_token');
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
