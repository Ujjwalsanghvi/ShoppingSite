import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';

export const SignOutButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="mt-8 mb-5">
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-gray-100 border border-gray-200 rounded-xl text-red-500 cursor-pointer text-base font-medium transition-all duration-300 hover:bg-red-50 hover:-translate-y-0.5"
      >
        🚪 Sign Out
      </button>
    </div>
  );
};