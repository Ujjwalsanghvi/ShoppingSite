import React from 'react';
import { Link } from 'react-router-dom';

interface OrderSummaryProps {
  total: number;
  onClearCart: () => void;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({ total, onClearCart }) => {
  // Ensure total is properly formatted to 2 decimal places
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
    </div>
  );
};