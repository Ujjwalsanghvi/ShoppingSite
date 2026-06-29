import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Product } from '../types/Mainview';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addToCart } from '../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist, selectWishlistItems } from '../store/slices/wishlistSlice';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useToast } from '../hooks/useToast';
import { QuantitySelector } from '../components/QuantitySelector';

export const ProductList: React.FC = () => {
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector(selectWishlistItems);
  const { showSuccess } = useToast();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});

  const isInWishlist = (productId: number) => {
    return wishlistItems.some(item => item.id === productId);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedCategory, products]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );
    };
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await api.getProducts();
      setProducts(data);
      setFilteredProducts(data);
      const initialQuantities: { [key: number]: number } = {};
      data.forEach(product => {
        initialQuantities[product.id] = 1;
      });
      setQuantities(initialQuantities);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await api.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    setFilteredProducts(filtered);
  };

  const handleAddToCart = (product: Product, quantity: number) => {
    dispatch(addToCart({ product, quantity }));
    showSuccess(`🛒 ${quantity}x ${product.title.substring(0, 30)}... added to cart!`);
    // Reset quantity to 1 after adding to cart
    setQuantities(prev => ({
      ...prev,
      [product.id]: 1
    }));
  };

  const handleQuantityChange = (productId: number, quantity: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: quantity
    }));
  };

  const handleFavoriteToggle = (
    product: Product,
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInWishlist(product.id)) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setIsDropdownOpen(false);
  };

  if (loading) {
    return <LoadingSpinner size="large" message="Loading products..." />;
  }

  return (
    <div className="max-w-[1400px] mx-auto p-5 bg-[#f5f5f5] min-h-[calc(100vh-80px)] overflow-x-hidden max-md:p-[15px] max-[480px]:p-3">
      {/* Filters Section */}
      <div className="flex gap-4 mb-8 flex-wrap max-md:flex-col max-md:gap-3">
        <input
          type="text"
          placeholder="🔍 Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="
            flex-1
            min-w-[200px]
            px-[18px]
            py-[14px]
            text-[15px]
            border
            border-[#e0e0e0]
            rounded-[12px]
            outline-none
            transition-all
            duration-300
            bg-white
            focus:border-[#4fc3f7]
            focus:shadow-[0_0_0_3px_rgba(79,195,247,0.1)]

            max-md:w-full
            max-md:px-4
            max-md:py-3
            max-md:text-[14px]

            max-[480px]:px-[14px]
            max-[480px]:py-[10px]
          "
        />

        {/* Custom Dropdown */}
        <div
          className="relative min-w-[180px] max-md:w-full max-md:min-w-0"
          ref={dropdownRef}
        >
          <button
            className="
              w-full
              px-[18px]
              py-[14px]
              text-[15px]
              border
              border-[#e0e0e0]
              rounded-[12px]
              bg-white
              cursor-pointer
              outline-none
              flex
              justify-between
              items-center
              gap-[10px]
              hover:border-[#4fc3f7]

              max-md:px-4
              max-md:py-3
              max-md:text-[14px]

              max-[480px]:px-[14px]
              max-[480px]:py-[10px]
            "
            onClick={() =>
              setIsDropdownOpen(!isDropdownOpen)
            }
          >
            <span>
              {selectedCategory || 'All Categories'}
            </span>

            <span className="text-xs text-[#666]">
              {isDropdownOpen ? '▲' : '▼'}
            </span>
          </button>

          {isDropdownOpen && (
            <div
              className="
                absolute
                top-full
                left-0
                right-0
                mt-2
                bg-white
                border
                border-[#e0e0e0]
                rounded-[12px]
                shadow-[0_4px_12px_rgba(0,0,0,0.15)]
                max-h-[300px]
                overflow-y-auto
                z-[1000]
                animate-[fadeIn_0.2s_ease]

                max-md:max-h-[250px]
              "
            >
              <div
                className={`
                  px-4
                  py-3
                  cursor-pointer
                  transition-colors
                  duration-200
                  text-[14px]
                  text-[#333]
                  hover:bg-[#f5f5f5]

                  max-md:px-[14px]
                  max-md:py-[10px]
                  max-md:text-[13px]

                  ${selectedCategory === ''
                    ? 'bg-[#e8f4f8] text-[#4fc3f7] font-medium'
                    : ''
                  }
                `}
                onClick={() =>
                  handleCategorySelect('')
                }
              >
                All Categories
              </div>

              {categories.map((category) => (
                <div
                  key={category}
                  className={`
                    px-4
                    py-3
                    cursor-pointer
                    transition-colors
                    duration-200
                    text-[14px]
                    text-[#333]
                    hover:bg-[#f5f5f5]

                    max-md:px-[14px]
                    max-md:py-[10px]
                    max-md:text-[13px]

                    ${selectedCategory === category
                      ? 'bg-[#e8f4f8] text-[#4fc3f7] font-medium'
                      : ''
                    }
                  `}
                  onClick={() =>
                    handleCategorySelect(category)
                  }
                >
                  {category.charAt(0).toUpperCase() +
                    category.slice(1)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div
        className="
          grid
          grid-cols-[repeat(auto-fill,minmax(280px,1fr))]
          gap-6

          max-lg:grid-cols-[repeat(auto-fill,minmax(260px,1fr))]
          max-lg:gap-5

          max-md:grid-cols-[repeat(auto-fill,minmax(240px,1fr))]
          max-md:gap-4

          max-[560px]:grid-cols-1
          max-[560px]:gap-4
        "
      >
        {filteredProducts.map((product) => {
          const isProductInWishlist = isInWishlist(product.id);
          const quantity = quantities[product.id] || 1;
          return (
            <div
              key={product.id}
              style={{
                transform: isProductInWishlist
                  ? 'translateY(-4px)'
                  : 'initial',
              }}
              className="
                bg-white
                rounded-2xl
                overflow-hidden
                transition-all
                duration-300
                shadow-[0_2px_8px_rgba(0,0,0,0.06)]
                border
                border-[#f0f0f0]
                flex
                flex-col
                hover:!translate-y-[-4px]
                hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)]
                relative
              "
            >
              {/* Wishlist Button */}
              <button
                onClick={(e) => handleFavoriteToggle(product, e)}
                className="
                  absolute
                  top-[10px]
                  right-[10px]
                  bg-white
                  border-none
                  rounded-full
                  w-8
                  h-8
                  text-[18px]
                  cursor-pointer
                  flex
                  items-center
                  justify-center
                  shadow-[0_2px_4px_rgba(0,0,0,0.1)]
                  z-[1]
                  transition-transform
                  duration-200
                  hover:scale-110
                "
                style={{ color: isProductInWishlist ? '#ff4444' : '#cccccc' }}
              >
                {isProductInWishlist ? '❤️' : '🤍'}
              </button>

              <Link
                to={`/product/${product.id}`}
                className="no-underline text-[#333] flex-1 flex flex-col"
              >
                {/* Product Image */}
                <div
                  className="
                    p-5
                    bg-[#fafafa]
                    flex
                    items-center
                    justify-center
                    border-b
                    border-[#f0f0f0]
                  "
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="
                      w-full
                      h-[200px]
                      object-contain
                      transition-transform
                      duration-300
                      hover:scale-105

                      max-lg:h-[180px]
                      max-md:h-[160px]
                      max-[560px]:h-[200px]
                      max-[480px]:h-[180px]
                    "
                  />
                </div>

                {/* Product Title */}
                <h3
                  className="
                    text-[15px]
                    font-medium
                    m-[16px_16px_8px_16px]
                    leading-[1.4]
                    min-h-[42px]
                    text-[#333]

                    max-md:text-[14px]
                    max-md:m-[12px_12px_6px_12px]
                    max-md:min-h-[38px]

                    max-[480px]:text-[13px]
                  "
                >
                  {product.title.length > 50
                    ? product.title.substring(0, 50) + '...'
                    : product.title}
                </h3>

                {/* Product Price */}
                <div
                  className="
                    text-[22px]
                    font-bold
                    text-[#4fc3f7]
                    m-[0_16px_8px_16px]

                    max-md:text-[20px]
                    max-md:m-[0_12px_6px_12px]

                    max-[480px]:text-[18px]
                  "
                >
                  ${product.price.toFixed(2)}
                </div>

                {/* Rating */}
                <div
                  className="
                    flex
                    items-center
                    gap-[5px]
                    m-[0_16px_16px_16px]
                    text-[14px]

                    max-md:m-[0_12px_12px_12px]
                    max-md:text-[13px]

                    max-[480px]:text-[12px]
                  "
                >
                  <span className="text-[#ffc107] text-[16px]">★</span>
                  <span>{product.rating.rate}</span>
                  <span className="text-[#999] text-[12px]">
                    ({product.rating.count} reviews)
                  </span>
                </div>
              </Link>

              {/* Quantity Selector and Add to Cart */}
              <div className="m-[0_16px_16px_16px] flex gap-2 items-center">
                <QuantitySelector
                  initialQuantity={quantity}
                  minQuantity={1}
                  maxQuantity={99}
                  onQuantityChange={(qty) => handleQuantityChange(product.id, qty)}
                />
                <button
                  onClick={() => handleAddToCart(product, quantity)}
                  className="
                    flex-1
                    bg-[#4fc3f7]
                    text-white
                    border-none
                    p-3
                    rounded-[10px]
                    cursor-pointer
                    text-[14px]
                    font-semibold
                    transition-all
                    duration-300
                    flex
                    items-center
                    justify-center
                    gap-2
                    hover:bg-[#45b5e6]
                    hover:scale-[1.02]

                    max-md:p-[10px]
                    max-md:text-[13px]

                    max-[480px]:p-2
                    max-[480px]:text-[12px]
                  "
                >
                  🛒 Add to Cart
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ProductList;