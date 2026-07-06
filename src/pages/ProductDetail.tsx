import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { api } from '../services/api';
import { Product } from '../types/Mainview';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addToCart } from '../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist, selectIsInWishlist } from '../store/slices/wishlistSlice';
import { useToast } from '../hooks/useToast';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { showSuccess } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const isInWishlist = useAppSelector(state => 
    product ? selectIsInWishlist(product.id)(state) : false
  );

  const fetchProduct = useCallback(async () => {
    try {
      const data = await api.getProduct(Number(id));
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id, fetchProduct]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({ product, quantity }));
      showSuccess(`🛒 ${product.title.substring(0, 30)}... added to cart!`);
      navigate('/cart');
    }
  };

  const handleFavoriteToggle = () => {
    if (product) {
      if (isInWishlist) {
        dispatch(removeFromWishlist(product.id));
      } else {
        dispatch(addToWishlist(product));
      }
    }
  };

  if (loading) {
    return <LoadingSpinner size="large" message="Loading product details..." />;
  }

  if (!product) {
    return <div className="text-center text-2xl text-red-500 mt-12">Product not found</div>;
  }

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-10">

      {/* SEO */}
      <Helmet>
        <title>E-Shop | {product.title}</title>
        <meta name="description" content={`Buy ${product.title} for $${product.price.toFixed(2)}. Category: ${product.category}. Rated ${product.rating.rate}/5 by ${product.rating.count} customers.`} />
        <meta name="keywords" content={`${product.title}, ${product.category}, buy online, e-shop`} />
        <link rel="canonical" href={`https://shopping-site-ne7g.vercel.app/product/${product.id}`} />
        <meta property="og:title" content={`E-Shop | ${product.title}`} />
        <meta property="og:description" content={`Buy ${product.title} for $${product.price.toFixed(2)}`} />
        <meta property="og:image" content={product.image} />
      </Helmet>

      <div className="grid grid-cols-2 gap-10">
        <div className="text-center">
          <img 
            src={product.image} 
            alt={product.title} 
            className="max-w-full h-[400px] object-contain" 
          />
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h1 className="text-[28px] text-gray-800">{product.title}</h1>
            <button
              onClick={handleFavoriteToggle}
              className="bg-none border-none text-[28px] cursor-pointer p-2 transition-transform duration-200 hover:scale-110"
              style={{ color: isInWishlist ? '#ff4444' : '#cccccc' }}
            >
              {isInWishlist ? '❤️' : '🤍'}
            </button>
          </div>
          <p className="text-base text-gray-500 capitalize">Category: {product.category}</p>
          <div className="text-base text-amber-400">
            Rating: {product.rating.rate} ★ ({product.rating.count} reviews)
          </div>
          <p className="text-base leading-relaxed text-gray-500">{product.description}</p>
          <div className="text-3xl font-bold text-blue-400">${product.price.toFixed(2)}</div>
          
          <div className="flex items-center gap-2.5">
            <label className="text-base font-bold">Quantity:</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="w-[60px] p-2 text-base border border-gray-300 rounded-md focus:outline-none focus:border-blue-400"
            />
          </div>
          
          <button 
            onClick={handleAddToCart} 
            className="bg-blue-400 text-white border-none py-3.5 text-lg rounded-md cursor-pointer mt-5 transition-colors duration-300 hover:bg-blue-500"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;