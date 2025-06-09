import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, User, LogOut, Home, Package } from 'lucide-react';

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Función para manejar el logout
  const handleLogout = () => {
    logout(); // Llama a la función logout del contexto
    navigate('/'); // Redirecciona al inicio
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo y nombre de la tienda */}
          <Link to="/" className="flex items-center space-x-2">
            <Package className="h-8 w-8" />
            <span className="text-xl font-bold">TechStore</span>
          </Link>

          {/* Enlaces de navegación */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="flex items-center space-x-1 hover:text-blue-200 transition-colors"
            >
              <Home className="h-4 w-4" />
              <span>Inicio</span>
            </Link>
            
            <Link 
              to="/products" 
              className="hover:text-blue-200 transition-colors"
            >
              Productos
            </Link>

            {/* Mostrar diferentes opciones según si está autenticado */}
            {isAuthenticated ? (
              <>
                {/* Enlaces para usuarios autenticados */}
                <Link 
                  to="/cart" 
                  className="flex items-center space-x-1 hover:text-blue-200 transition-colors"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Carrito</span>
                </Link>
                
                <div className="flex items-center space-x-4">
                  {/* Mostrar nombre del usuario */}
                  <span className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>Hola, {user?.name}</span>
                  </span>
                  
                  {/* Botón de logout */}
                  <button 
                    onClick={handleLogout}
                    className="flex items-center space-x-1 hover:text-blue-200 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Salir</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Enlaces para usuarios no autenticados */}
                <Link 
                  to="/login" 
                  className="hover:text-blue-200 transition-colors"
                >
                  Iniciar sesión
                </Link>
                
                <Link 
                  to="/register" 
                  className="bg-blue-700 px-4 py-2 rounded-md hover:bg-blue-800 transition-colors"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>

          {/* Menú móvil (simplificado) */}
          <div className="md:hidden">
            <button className="text-white">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;