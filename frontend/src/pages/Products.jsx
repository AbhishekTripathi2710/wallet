import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { productService } from '../services/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { FaSearch, FaFilter, FaSort, FaSpinner, FaExclamationTriangle, FaShoppingBag } from 'react-icons/fa';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterCategory, setFilterCategory] = useState('');
  const { addToCart } = useCart();
  const { category } = useParams();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let response;
        
        if (category) {
          response = await productService.getProductsByCategory(category);
          setFilterCategory(category);
        } else {
          response = await productService.getAllProducts();
        }
        
        if (response.data && response.data.products) {
          setProducts(response.data.products);
        } else {
          console.error('Unexpected API response format:', response);
          setError('Received invalid data format from API');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  // Filter products based on search term and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory ? product.category === filterCategory : true;
    
    return matchesSearch && matchesCategory;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name?.localeCompare(b.name);
    } else if (sortBy === 'price-low') {
      return a.price - b.price;
    } else if (sortBy === 'price-high') {
      return b.price - a.price;
    } else if (sortBy === 'cashback') {
      return b.cashbackPercentage - a.cashbackPercentage;
    }
    return 0;
  });

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            {category ? `${category} Products` : 'All Products'}
          </h1>
          <p className="text-gray-600 text-center max-w-2xl mx-auto">
            Browse our selection of high-quality products with exclusive cashback offers
          </p>
        </header>
        
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-md mb-8 p-4 lg:p-6 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center">
                <FaFilter className="text-blue-500 mr-2" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="">All Categories</option>
                  <option value="A">Category A (10% Cashback)</option>
                  <option value="B">Category B (2% Cashback)</option>
                  <option value="C">Category C (7% Cashback)</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <FaSort className="text-blue-500 mr-2" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="price-low">Price (Low to High)</option>
                  <option value="price-high">Price (High to Low)</option>
                  <option value="cashback">Cashback (%)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <FaSpinner className="text-blue-600 text-4xl animate-spin mb-4" />
            <p className="text-gray-600">Loading products...</p>
          </div>
        )}
        
        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-lg">
            <div className="flex items-center">
              <FaExclamationTriangle className="text-red-500 mr-3" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}
        
        {/* Empty State */}
        {!loading && !error && sortedProducts.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-8 text-center max-w-2xl mx-auto border border-gray-100">
            <FaShoppingBag className="text-gray-300 text-6xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Products Found</h2>
            <p className="text-gray-600 mb-4">
              We couldn't find any products matching your criteria. Try adjusting your filters or search term.
            </p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setFilterCategory('');
                setSortBy('name');
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Reset Filters
            </button>
          </div>
        )}
        
        {/* Products Grid */}
        {!loading && !error && sortedProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map(product => (
              <div key={product._id} className="h-full">
                <ProductCard product={product} addToCart={addToCart} />
              </div>
            ))}
          </div>
        )}
        
        {/* Results Count */}
        {!loading && !error && sortedProducts.length > 0 && (
          <div className="mt-8 text-center text-gray-600">
            Showing {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'}
            {searchTerm && ` for "${searchTerm}"`}
            {filterCategory && ` in Category ${filterCategory}`}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products; 