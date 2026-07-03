import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';

interface OrderSummaryProps {
  total: number;
  onClearCart: () => void;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({ total, onClearCart }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const formattedTotal = total.toFixed(2);

  return (
    <div
      className="
        bg-white
        rounded-[12px]
        p-6
        shadow-[0_2px_8px_rgba(0,0,0,0.06)]
        sticky
        top-[100px]

        max-md:static
        max-md:p-5

        max-[480px]:p-4
      "
    >
      <h3
        className="
          text-[18px]
          font-semibold
          text-[#333]
          mb-5
          pb-[10px]
          border-b-2
          border-[#4fc3f7]

          max-md:text-base
        "
      >
        Order Summary
      </h3>

      <div className="flex justify-between mb-[15px] text-[15px] text-[#666] max-md:text-[14px]">
        <span>Subtotal:</span>
        <span>${formattedTotal}</span>
      </div>

      <div className="flex justify-between mb-[15px] text-[15px] text-[#666] max-md:text-[14px]">
        <span>Shipping:</span>
        <span>Free</span>
      </div>

      <div className="flex justify-between mt-[15px] pt-[15px] border-t border-[#e0e0e0] text-[18px] font-bold text-[#333] max-md:text-base">
        <span>Total:</span>
        <span className="text-[#4fc3f7] text-[20px] max-md:text-[18px]">
          ${formattedTotal}
        </span>
      </div>

      <button
        onClick={onClearCart}
        className="
          w-full
          py-3
          bg-[#ff9800]
          text-white
          border-none
          rounded-[8px]
          cursor-pointer
          text-[15px]
          font-semibold
          mt-5
          transition-all
          duration-300
          hover:bg-[#f57c00]
          hover:-translate-y-[2px]

          max-md:py-[10px]
          max-md:text-[14px]
        "
      >
        Clear Cart
      </button>

      {/* ✅ Proceed to Checkout - disabled when not logged in */}
      {isAuthenticated ? (
        <Link
          to="/checkout"
          className="
            block
            text-center
            mt-3
            py-3
            bg-[#4caf50]
            text-white
            no-underline
            rounded-[8px]
            text-[15px]
            font-semibold
            transition-all
            duration-300
            hover:bg-[#45a049]
            hover:-translate-y-[2px]

            max-md:py-[10px]
            max-md:text-[14px]
          "
        >
          Proceed to Checkout
        </Link>
      ) : (
        <div className="mt-3">
          {/* Disabled Checkout Button */}
          <div className="relative group">
            <button
              disabled
              className="
                w-full
                py-3
                bg-gray-300
                text-gray-500
                border-none
                rounded-[8px]
                cursor-not-allowed
                text-[15px]
                font-semibold

                max-md:py-[10px]
                max-md:text-[14px]
              "
            >
              🔒 Proceed to Checkout
            </button>
            {/* Tooltip on hover */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-[180px] bg-gray-800 text-white text-[11px] text-center rounded-lg py-1.5 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              Login or Signup to checkout
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
            </div>
          </div>

          {/* Login / Signup buttons */}
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => navigate('/login')}
              className="
                flex-1
                py-2.5
                bg-blue-400
                text-white
                border-none
                rounded-[8px]
                text-[14px]
                font-medium
                cursor-pointer
                hover:bg-blue-500
                transition-colors
              "
            >
              Login
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="
                flex-1
                py-2.5
                bg-green-500
                text-white
                border-none
                rounded-[8px]
                text-[14px]
                font-medium
                cursor-pointer
                hover:bg-green-600
                transition-colors
              "
            >
              Sign Up
            </button>
          </div>
        </div>
      )}
    </div>
  );
};