import React from 'react';
import { Link } from 'react-router-dom';
import { CartItem as CartItemType } from '../../types/CartItem';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemove: (productId: number, productTitle: string) => void; // Updated to include title
}

export const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemove }) => {
  // Calculate item total with proper precision
  const itemTotal = Math.round((item.product.price * item.quantity) * 100) / 100;

  return (
    <div
      className="
        grid
        grid-cols-[100px_2fr_150px_100px_80px]
        items-center
        gap-[15px]
        p-5
        border-b border-[#f0f0f0]
        transition-colors duration-300
        hover:bg-[#fafafa]
        last:border-b-0

        max-md:grid-cols-1
        max-md:gap-3
        max-md:text-center
        max-md:p-4

        max-[480px]:p-3
      "
    >
      <img
        src={item.product.image}
        alt={item.product.title}
        className="
          w-20
          h-20
          object-contain

          max-md:mx-auto
          max-md:w-[100px]
          max-md:h-[100px]

          max-[480px]:w-20
          max-[480px]:h-20
        "
      />

      <div className="flex flex-col gap-2 max-md:items-center">
        <Link
          to={`/product/${item.product.id}`}
          className="
            text-[#333]
            no-underline
            text-[15px]
            font-medium
            leading-[1.4]
            hover:text-[#4fc3f7]

            max-md:text-[14px]
            max-[480px]:text-[13px]
          "
        >
          {item.product.title}
        </Link>

        <div className="text-base font-semibold text-[#4fc3f7] max-[480px]:text-[15px]">
          ${item.product.price.toFixed(2)}
        </div>
      </div>

      <div className="flex items-center gap-3 max-md:justify-center">
        <button
          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
          className="
            w-8
            h-8
            bg-[#f0f0f0]
            border-none
            rounded-[6px]
            cursor-pointer
            text-[18px]
            font-bold
            transition-all
            duration-300
            hover:bg-[#e0e0e0]
            hover:scale-[1.05]

            max-md:w-9
            max-md:h-9
            max-md:text-[20px]

            max-[480px]:w-8
            max-[480px]:h-8
            max-[480px]:text-[18px]
          "
        >
          -
        </button>

        <span className="text-base font-medium min-w-[30px] text-center">
          {item.quantity}
        </span>

        <button
          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
          className="
            w-8
            h-8
            bg-[#f0f0f0]
            border-none
            rounded-[6px]
            cursor-pointer
            text-[18px]
            font-bold
            transition-all
            duration-300
            hover:bg-[#e0e0e0]
            hover:scale-[1.05]

            max-md:w-9
            max-md:h-9
            max-md:text-[20px]

            max-[480px]:w-8
            max-[480px]:h-8
            max-[480px]:text-[18px]
          "
        >
          +
        </button>
      </div>

      <div className="text-[18px] font-bold text-[#4fc3f7] max-md:text-center max-[480px]:text-base">
        ${itemTotal.toFixed(2)}
      </div>

      <button
        onClick={() => onRemove(item.product.id, item.product.title)} // Passing product title
        className="
          px-4
          py-2
          bg-[#f44336]
          text-white
          border-none
          rounded-[6px]
          cursor-pointer
          transition-all
          duration-300
          text-[13px]
          font-medium
          hover:bg-[#d32f2f]
          hover:scale-[1.02]

          max-md:w-[100px]
          max-md:mx-auto
          max-md:py-2
        "
      >
        Remove
      </button>
    </div>
  );
};