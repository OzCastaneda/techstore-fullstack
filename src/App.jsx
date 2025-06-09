import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import './App.css';

function App() {
  return (
    // AuthProvider envuelve toda la app para proporcionar contexto de autenticación
    <AuthProvider>
      {/* Router maneja la navegación entre páginas */}
      <Router>
        <div className="min-h-screen bg-gray-50">
          {/* Navbar aparece en todas las páginas */}
          <Navbar />
          
          {/* Routes define qué componente mostrar según la URL */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {/* Más rutas se agregarán aquí */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;