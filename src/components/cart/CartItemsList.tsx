import React from 'react';
import { CartItem } from './CartItem';
import { CartItem as CartItemType } from '../../types/CartItem';

interface CartItemsListProps {
  items: CartItemType[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemove: (productId: number, productTitle: string) => void; 
}

export const CartItemsList: React.FC<CartItemsListProps> = ({ 
  items, 
  onUpdateQuantity, 
  onRemove 
}) => {
  return (
    <div className="bg-white rounded-[12px] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
      {items.map((item) => (
        <CartItem
          key={item.product.id}
          item={item}
          onUpdateQuantity={onUpdateQuantity}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};