import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import { selectCartCount } from '../store/slices/cartSlice';
import { selectProfileData } from '../store/slices/profileSlice';
import { selectWishlistCount } from '../store/slices/wishlistSlice';

export const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const cartCount = useAppSelector(selectCartCount);
  const profileData = useAppSelector(selectProfileData);
  const wishlistCount = useAppSelector(selectWishlistCount);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleProfileClick = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
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

  return (
    <nav className="bg-[#1a1a2e] text-white py-4 sticky top-0 z-[1000]">
      <div className="max-w-[1200px] mx-auto px-5 flex justify-between items-center flex-wrap">
        <Link to="/" className="text-2xl font-bold text-white no-underline">
          E-Shop
        </Link>
        
        <button 
          className="hidden max-[768px]:block bg-none border-none text-white text-2xl cursor-pointer p-2"
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

          {/* Analytics Link - Desktop */}
          <Link to="/analytics" className="text-white no-underline px-3 py-2 rounded-md transition-colors duration-300 text-sm font-medium hover:bg-white/10">
            📊 Analytics
          </Link>

          {/* Admin Link - Desktop */}
          <Link to="/admin/orders" className="text-white no-underline px-3 py-2 rounded-md transition-colors duration-300 text-sm font-medium hover:bg-white/10">
            📋 Admin
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/cart" className="text-white no-underline px-3 py-2 rounded-md transition-colors duration-300 text-sm font-medium hover:bg-white/10">
                Cart ({cartCount})
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

            {/* Analytics Link - Mobile */}
            <Link to="/analytics" className="text-white no-underline py-2.5 text-base text-center bg-white/10 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>
              📊 Analytics
            </Link>

            {/* Admin Link - Mobile */}
            <Link to="/admin/orders" className="text-white no-underline py-2.5 text-base text-center bg-white/10 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>
              📋 Admin
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/cart" className="text-white no-underline py-2.5 text-base text-center bg-white/10 rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>
                  Cart ({cartCount})
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
                <Link to="/profile/view" className=" no-underline py-2.5 text-base text-center bg-blue-400/20 border border-blue-400/30 text-[#4fc3f7] rounded-lg" onClick={() => setIsMobileMenuOpen(false)}>
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
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;