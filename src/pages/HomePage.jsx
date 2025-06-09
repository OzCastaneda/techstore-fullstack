import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="bg-blue-600 text-white rounded-lg p-8 mb-8">
        <h1 className="text-4xl font-bold mb-4">Bienvenido a TechStore Online</h1>
        <p className="text-xl mb-6">Tu tienda de tecnología favorita con los mejores productos y precios</p>
        <Link to="/products" className="bg-white text-blue-600 px-6 py-2 rounded-md font-medium hover:bg-blue-50 transition-colors">
          Ver productos
        </Link>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Categorías destacadas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['tecnologia', 'accesorios', 'hogar'].map((category) => (
            <div key={category} className="bg-gray-100 p-6 rounded-lg hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold capitalize mb-2">{category}</h3>
              <Link to={`/products?category=${category}`} className="text-blue-600 hover:underline">
                Ver productos
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;