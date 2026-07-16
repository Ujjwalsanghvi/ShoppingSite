import React from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addToCart } from '../store/slices/cartSlice';
import { 
  selectWishlistItems, 
  removeFromWishlist, 
  clearWishlist 
} from '../store/slices/wishlistSlice';
import { useToast } from '../hooks/useToast'; 

export const Wishlist: React.FC = () => {
  const dispatch = useAppDispatch();
  const wishlist = useAppSelector(selectWishlistItems);
  const { showSuccess, showWarning } = useToast(); 

  const handleMoveToCart = (product: any) => {
    dispatch(addToCart({ product, quantity: 1 }));
    dispatch(removeFromWishlist(product.id));
    
    showSuccess(`🛒 ${product.title.substring(0, 30)}... moved to cart!`);
  };

  const handleRemoveFromWishlist = (productId: number, productTitle: string) => {
    dispatch(removeFromWishlist(productId));
    showWarning(`🗑️ ${productTitle.substring(0, 30)}... removed from wishlist`);
  };

  const handleClearWishlist = () => {
    dispatch(clearWishlist());
    showSuccess('🗑️ Wishlist cleared successfully!');
  };

  if (wishlist.length === 0) {
    return (
      <div className="text-center py-20 px-5 bg-gray-100 min-h-[calc(100vh-80px)]">
        <h2 className="text-gray-800 text-2xl mb-2">Your wishlist is empty</h2>
        <p className="text-gray-500 mb-5">Save your favorite items here!</p>
        <Link 
          to="/products" 
          className="inline-block mt-5 px-6 py-3 bg-blue-400 text-white no-underline rounded-md hover:bg-blue-500 transition-all duration-300"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-10 min-h-[calc(100vh-80px)] bg-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[28px] text-gray-800">My Wishlist</h1>
        <button 
          onClick={handleClearWishlist} 
          className="px-5 py-2.5 bg-red-500 text-white border-none rounded-md cursor-pointer text-sm hover:bg-red-600 transition-all duration-300"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
        {wishlist.map(product => (
          <div key={product.id} className="bg-white rounded-xl p-4 relative shadow-md transition-transform duration-300 hover:-translate-y-1">
            <button
              onClick={() => handleRemoveFromWishlist(product.id, product.title)}
              className="absolute top-2.5 right-2.5 bg-white border-none rounded-full w-7 h-7 text-base cursor-pointer flex items-center justify-center shadow-sm text-red-500 hover:bg-gray-50 transition-all duration-300"
            >
              ✕
            </button>
            <Link to={`/product/${product.id}`} className="no-underline text-gray-800">
              <img 
                src={product.image} 
                alt={product.title} 
                className="w-full h-[200px] object-contain mb-2.5" 
              />
              <h3 className="text-base mb-2.5 min-h-[48px] font-medium">
                {product.title.substring(0, 50)}...
              </h3>
              <div className="text-xl font-bold text-blue-400 mb-2.5">
                ${product.price.toFixed(2)}
              </div>
              <div className="text-sm text-gray-500 mb-2.5">
                Rating: {product.rating.rate} ★ ({product.rating.count} reviews)
              </div>
            </Link>
            <button
              onClick={() => handleMoveToCart(product)}
              className="w-full bg-green-500 text-white border-none py-2.5 rounded-md cursor-pointer text-sm font-medium hover:bg-green-600 transition-all duration-300"
            >
              Move to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;