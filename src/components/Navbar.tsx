import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import { selectCartItems, selectCartCount, selectCartTotal, removeFromCart, updateQuantity, clearCart } from '../store/slices/cartSlice';
import { selectProfileData } from '../store/slices/profileSlice';
import { selectWishlistCount } from '../store/slices/wishlistSlice';

export const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation(); 
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const cartCount = useAppSelector(selectCartCount);
  const cartItems = useAppSelector(selectCartItems);
  const cartTotal = useAppSelector(selectCartTotal);
  const profileData = useAppSelector(selectProfileData);
  const wishlistCount = useAppSelector(selectWishlistCount);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);
  const cartButtonRef = useRef<HTMLButtonElement>(null);

  
  useEffect(() => {
    setIsCartOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
    setIsCartOpen(false);
  };

  const handleProfileClick = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsCartOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
    setIsProfileOpen(false);
  };

  
  const closeCart = () => {
    setIsCartOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      
    
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        mobileMenuButtonRef.current &&
        !mobileMenuButtonRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
      
      
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const profilePicture = profileData?.profilePicture;
  const userName = profileData?.fullName || user?.name || 'User';

  
  const CartPopup = (
    <div 
      ref={cartRef} 
      className="fixed right-0 top-[75px] bg-white shadow-2xl w-[420px] max-h-[85vh] overflow-y-auto z-[9999] animate-slideInRight border-l border-gray-200"
    >
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
        <h3 className="text-gray-800 font-bold text-base m-0">
          Shopping Cart ({cartCount})
        </h3>
        <button
          onClick={closeCart} 
          className="bg-none border-none text-gray-400 cursor-pointer text-lg hover:text-gray-600 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Cart Items */}
      {cartItems.length === 0 ? (
        <div className="p-8 text-center text-gray-400">
          <div className="text-4xl mb-3">🛒</div>
          <p className="text-sm">Your cart is empty</p>
          <button
            onClick={() => { navigate('/products'); closeCart(); }}
            className="mt-3 text-blue-500 text-sm font-medium border-none bg-none cursor-pointer hover:underline"
          >
            Start Shopping →
          </button>
        </div>
      ) : (
        <>
          {/* Items List */}
          <div className="max-h-[400px] overflow-y-auto">
            {cartItems.map((item) => (
              <div key={item.product.id} className="flex items-start gap-3 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                
                {/* Product Image */}
                <img
                  src={item.product.image}
                  alt={item.product.title}
                  className="w-16 h-16 object-contain bg-gray-50 rounded p-1 flex-shrink-0"
                />

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 leading-tight mb-0.5 truncate">
                    {item.product.title}
                  </p>
                  <p className="text-xs text-gray-500 mb-1">
                    #{item.product.id || 'N/A'}
                  </p>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-1.5">
                    <span className="text-yellow-400 text-sm">★</span>
                    <span className="text-xs text-gray-500">
                      {item.product.rating?.rate || 0.0} ({item.product.rating?.count || 0})
                    </span>
                  </div>

                  {/* QTY and Remove */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-gray-500 font-medium">QTY:</span>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (!isNaN(val) && val > 0) {
                            dispatch(updateQuantity({ productId: item.product.id, quantity: val }));
                          }
                        }}
                        onBlur={(e) => {
                          const val = parseInt(e.target.value);
                          if (isNaN(val) || val < 1) {
                            dispatch(updateQuantity({ productId: item.product.id, quantity: 1 }));
                          }
                        }}
                        className="w-12 h-7 border border-gray-300 rounded text-center text-sm font-semibold text-gray-800 outline-none focus:border-blue-400"
                      />
                    </div>
                    <button
                      onClick={() => dispatch(removeFromCart(item.product.id))}
                      className="text-xs text-red-400 hover:text-red-600 font-medium border-none bg-none cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* Item Total */}
                <div className="flex-shrink-0 text-right">
                  <p className="text-xs text-gray-500 mb-0.5">Item Total</p>
                  <p className="text-sm font-bold text-gray-800">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-4 bg-gray-50 border-t border-gray-200 sticky bottom-0">
            {/* Item Subtotal */}
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-600">Item Subtotal:</span>
              <span className="text-sm font-bold text-gray-800">${cartTotal.toFixed(2)}</span>
            </div>
            <p className="text-[11px] text-gray-400 mb-3">
              * Additional charges such as tax and shipping are not included in this price.
            </p>

            {/* View Cart Button */}
            <button
              onClick={() => { navigate('/cart'); closeCart(); }}
              className="w-full py-2.5 bg-blue-500 text-white border-none rounded-lg text-sm font-semibold cursor-pointer hover:bg-blue-600 transition-colors mb-2"
            >
              VIEW SHOPPING CART
            </button>

            {/* Remove All */}
            <div className="flex justify-end mb-3">
              <button
                onClick={() => {
                  dispatch(clearCart());
                }}
                className="text-red-400 text-xs font-medium border-none bg-none cursor-pointer hover:text-red-600 hover:underline"
              >
                Remove All
              </button>
            </div>

            {/* Checkout section */}
            <div className="border-t border-gray-200 pt-3">
              {isAuthenticated ? (
                <button
                  onClick={() => { navigate('/checkout'); closeCart(); }}
                  className="w-full py-2.5 bg-green-500 text-white border-none rounded-lg text-sm font-bold cursor-pointer hover:bg-green-600 transition-colors"
                >
                  CHECKOUT →
                </button>
              ) : (
                <div className="relative group">
                  <button
                    disabled
                    className="w-full py-2.5 bg-gray-300 text-gray-500 border-none rounded-lg text-sm font-bold cursor-not-allowed"
                  >
                    🔒 CHECKOUT
                  </button>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-[180px] bg-gray-800 text-white text-[11px] text-center rounded-lg py-1.5 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    Login or Signup to checkout
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <nav className="bg-[#1a1a2e] text-white py-4 sticky top-0 z-[1000]">
      <div className="max-w-[1200px] mx-auto px-5 flex justify-between items-center flex-wrap">
        <Link to="/" className="text-2xl font-bold text-white no-underline">
          E-Shop
        </Link>

        <button
          ref={mobileMenuButtonRef}
          className="hidden max-[768px]:block bg-none border-none text-white text-2xl cursor-pointer p-2"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={toggleMobileMenu}
        >
          <span className="text-2xl">{isMobileMenuOpen ? '✕' : '☰'}</span>
        </button>

        {/* Desktop Navigation */}
        <div className="flex gap-5 items-center max-[768px]:hidden">
          <Link to="/products" className="text-white no-underline px-3 py-2 rounded-md transition-colors duration-300 text-sm font-medium hover:bg-white/10">
            Products
          </Link>

          <Link to="/wishlist" className="text-white no-underline px-3 py-2 rounded-md transition-colors duration-300 text-sm font-medium hover:bg-white/10">
            ❤️ Wishlist ({wishlistCount})
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/analytics" className="text-white no-underline px-3 py-2 rounded-md transition-colors duration-300 text-sm font-medium hover:bg-white/10">
                📊 Analytics
              </Link>

              <Link to="/admin/orders" className="text-white no-underline px-3 py-2 rounded-md transition-colors duration-300 text-sm font-medium hover:bg-white/10">
                📋 Admin
              </Link>

              <Link to="/profile/view" className="text-[#4fc3f7] no-underline px-4 py-2 rounded-md transition-all duration-300 text-sm font-medium bg-blue-400/10 border border-blue-400/30 hover:bg-blue-400/20 hover:-translate-y-0.5">
                View Profile
              </Link>

              <div className="relative" ref={dropdownRef}>
                <button onClick={handleProfileClick} className="bg-none border-none cursor-pointer flex items-center gap-2 pl-1 pr-3 py-1 rounded-[30px] transition-colors duration-300 bg-white/10 hover:bg-white/20">
                  <div className="w-9 h-9 rounded-full bg-[#4fc3f7] flex items-center justify-center overflow-hidden">
                    {profilePicture ? (
                      <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[#1a1a2e] text-lg font-bold">
                        {userName?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    )}
                  </div>
                  <span className="text-white text-sm font-medium">{userName.split(' ')[0]}</span>
                  <span className="text-[10px] text-white ml-1">{isProfileOpen ? '▲' : '▼'}</span>
                </button>

                {isProfileOpen && (
                  <div className="absolute top-full right-0 mt-2.5 bg-white rounded-xl shadow-lg min-w-[260px] overflow-hidden z-[1000] animate-slideDown">
                    <div className="flex items-center gap-3 p-4 bg-gray-50">
                      <div className="w-12 h-12 rounded-full bg-[#4fc3f7] flex items-center justify-center text-2xl font-bold text-[#1a1a2e] overflow-hidden">
                        {profilePicture ? (
                          <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <span>{userName?.charAt(0).toUpperCase() || 'U'}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-gray-800">{userName}</div>
                        <div className="text-xs text-gray-500">{user?.email}</div>
                      </div>
                    </div>
                    <div className="h-px bg-gray-200 my-1"></div>
                    <Link to="/profile/address" className="flex items-center gap-3 px-4 py-3 text-gray-800 no-underline transition-colors duration-200 text-sm cursor-pointer hover:bg-gray-100" onClick={() => setIsProfileOpen(false)}>
                      <span className="text-lg w-6">📍</span>
                      My Address
                    </Link>
                    <Link to="/profile/orders" className="flex items-center gap-3 px-4 py-3 text-gray-800 no-underline transition-colors duration-200 text-sm cursor-pointer hover:bg-gray-100" onClick={() => setIsProfileOpen(false)}>
                      <span className="text-lg w-6">📦</span>
                      My Orders
                    </Link>
                    <Link to="/profile/wallet" className="flex items-center gap-3 px-4 py-3 text-gray-800 no-underline transition-colors duration-200 text-sm cursor-pointer hover:bg-gray-100" onClick={() => setIsProfileOpen(false)}>
                      <span className="text-lg w-6">💰</span>
                      My Wallet
                    </Link>
                    <div className="h-px bg-gray-200 my-1"></div>
                    <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-red-500 no-underline transition-colors duration-200 text-sm cursor-pointer bg-none border-none text-left hover:bg-red-50">
                      <span className="text-lg w-6">🚪</span>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white no-underline px-3 py-2 rounded-md transition-colors duration-300 text-sm font-medium hover:bg-white/10">
                Login
              </Link>
              <Link to="/signup" className="text-white no-underline px-3 py-2 rounded-md transition-colors duration-300 text-sm font-medium hover:bg-white/10">
                Signup
              </Link>
            </>
          )}

          {/* Cart always LAST */}
          <div className="relative">
            <button
              ref={cartButtonRef}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={toggleCart}
              className="relative text-white no-underline px-3 py-2 rounded-md transition-colors duration-300 text-sm font-medium hover:bg-white/10 border-none bg-transparent cursor-pointer"
            >
              🛒 Cart
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            {isCartOpen && CartPopup}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-[#1a1a2e] p-5 flex flex-col gap-4 z-[999] border-t border-white/10" ref={mobileMenuRef}>
            <Link to="/products" className="text-white no-underline py-2.5 text-base text-center bg-white/10 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>
              Products
            </Link>

            <Link to="/wishlist" className="text-white no-underline py-2.5 text-base text-center bg-white/10 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>
              ❤️ Wishlist ({wishlistCount})
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/analytics" className="text-white no-underline py-2.5 text-base text-center bg-white/10 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>
                  📊 Analytics
                </Link>

                <Link to="/admin/orders" className="text-white no-underline py-2.5 text-base text-center bg-white/10 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>
                  📋 Admin
                </Link>

                <Link to="/profile/address" className="text-white no-underline py-2.5 text-base text-center bg-white/10 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>
                  My Address
                </Link>
                <Link to="/profile/orders" className="text-white no-underline py-2.5 text-base text-center bg-white/10 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>
                  My Orders
                </Link>
                <Link to="/profile/wallet" className="text-white no-underline py-2.5 text-base text-center bg-white/10 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>
                  My Wallet
                </Link>
                <Link to="/profile/view" className="no-underline py-2.5 text-base text-center bg-blue-400/20 border border-blue-400/30 text-[#4fc3f7] rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>
                  👤 View Profile
                </Link>
                <button onClick={handleLogout} className="bg-red-500/20 text-red-500 border-none py-2.5 rounded-lg text-base cursor-pointer text-center">
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white no-underline py-2.5 text-base text-center bg-white/10 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/signup" className="text-white no-underline py-2.5 text-base text-center bg-white/10 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>
                  Signup
                </Link>
              </>
            )}

            {/* Mobile Cart always LAST */}
            <Link to="/cart" className="text-white no-underline py-2.5 text-base text-center bg-white/10 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>
              🛒 Cart {cartCount > 0 && `(${cartCount})`}
            </Link>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;