import React, { useState } from 'react';

interface QuantitySelectorProps {
  initialQuantity?: number;
  minQuantity?: number;
  maxQuantity?: number;
  onQuantityChange?: (quantity: number) => void;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  initialQuantity = 1,
  minQuantity = 1,
  maxQuantity = 99,
  onQuantityChange,
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);

  const handleDecrease = () => {
    if (quantity > minQuantity) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onQuantityChange?.(newQuantity);
    }
  };

  const handleIncrease = () => {
    if (quantity < maxQuantity) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      onQuantityChange?.(newQuantity);
    }
  };

  return (
    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
      <button
        onClick={handleDecrease}
        className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors duration-200 text-lg font-bold"
      >
        −
      </button>
      <span className="w-10 h-8 flex items-center justify-center text-center font-medium text-gray-700">
        {quantity}
      </span>
      <button
        onClick={handleIncrease}
        className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors duration-200 text-lg font-bold"
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;