import React from 'react';
import { Link } from 'react-router-dom';

export const EmptyCart: React.FC = () => {
  return (
    <div className="text-center p-[50px] min-h-[calc(100vh-80px)] bg-[#f5f5f5] max-md:p-[30px]">
      <h2 className="text-[#333] mb-5">Your cart is empty</h2>
      <Link
        to="/products"
        className="inline-block mt-5 px-6 py-3 bg-[#4fc3f7] text-white no-underline rounded-[8px] transition-all duration-300 hover:bg-[#45b5e6] hover:-translate-y-[2px]"
      >
        Continue Shopping
      </Link>
    </div>
  );
};