import React from 'react';
import { EmptyCart } from '../components/cart/EmptyCart';
import { CartHeader } from '../components/cart/CartHeader';
import { CartItemsList } from '../components/cart/CartItemsList';
import { OrderSummary } from '../components/cart/OrderSummary';
import { useCart } from '../hooks/useCart';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useToast } from '../hooks/useToast'; // Add this import

export const Cart: React.FC = () => {
  const { 
    cart, 
    total, 
    loading,
    handleUpdateQuantity, 
    handleRemoveFromCart, 
    handleClearCart 
  } = useCart();
  const { showSuccess, showWarning } = useToast(); // Add this line

  // Wrapper functions with toast notifications
  const handleRemoveItem = (productId: number, productTitle: string) => {
    handleRemoveFromCart(productId);
    showWarning(`🗑️ ${productTitle.substring(0, 30)}... removed from cart`);
  };

  const handleClearAll = () => {
    handleClearCart();
    showSuccess('🗑️ Cart cleared successfully!');
  };

  if (loading) {
    return <LoadingSpinner size="medium" message="Loading your cart..." />;
  }

  if (cart.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#f5f5f5]">
      <div className="max-w-[1400px] mx-auto px-5 py-10 max-md:px-[15px] max-md:py-5 max-[480px]:px-3 max-[480px]:py-[15px]">
        <CartHeader />

        <div className="flex gap-[30px] max-md:flex-col max-md:gap-5">
          <div className="flex-[2] w-full">
            <CartItemsList
              items={cart}
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={handleRemoveItem} // Updated to use wrapper function
            />
          </div>

          <div className="flex-1 w-full">
            <OrderSummary total={total} onClearCart={handleClearAll} // Updated to use wrapper function
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;