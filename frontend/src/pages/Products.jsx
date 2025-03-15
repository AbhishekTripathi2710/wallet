import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { productService } from '../services/api';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { FaFilter, FaSort, FaSearch } from 'react-icons/fa';

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
    <div className="bg-gray-100 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">
          {category ? `${category} Products` : 'All Products'}
        </h1>
        
        {/* Search and Filter Bar */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center">
                <FaFilter className="text-gray-500 mr-2" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Categories</option>
                  <option value="A">Category A (10% Cashback)</option>
                  <option value="B">Category B (2% Cashback)</option>
                  <option value="C">Category C (7% Cashback)</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <FaSort className="text-gray-500 mr-2" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        
        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">
            {error}
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            No products found matching your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map(product => (
              <ProductCard 
                key={product._id} 
                product={product} 
                addToCart={addToCart} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products; 