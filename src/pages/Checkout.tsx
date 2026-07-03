import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  selectCartItems, 
  selectCartTotal, 
  clearCart 
} from '../store/slices/cartSlice';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useToast } from '../hooks/useToast';

export const Checkout: React.FC = () => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const { showSuccess, showError, showWarning } = useToast();
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');

  useEffect(() => {
    const savedAddresses = localStorage.getItem(`addresses_${user?.id}`);
    if (savedAddresses) {
      const addresses = JSON.parse(savedAddresses);
      const defaultAddress = addresses.find((addr: any) => addr.isDefault);
      if (defaultAddress) {
        setFormData(prev => ({
          ...prev,
          address: defaultAddress.street,
          city: defaultAddress.city,
          zipCode: defaultAddress.zipCode
        }));
      }
    }
  }, [user?.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const isValidCardNumber = (cardNumber: string): boolean => {
    const cleaned = cardNumber.replace(/\s/g, '');
    const validMockCards = [
      '4242424242424242',
      '5555555555554444',
      '378282246310005',
      '6011111111111117',
      '4111111111111111',
      '4000000000000002',
    ];
    return validMockCards.includes(cleaned) && cleaned.length >= 15 && cleaned.length <= 16;
  };

  const isValidExpiry = (expiry: string): boolean => {
    const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!expiryRegex.test(expiry)) return false;
    const [month, year] = expiry.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    const expYear = parseInt(year);
    const expMonth = parseInt(month);
    if (expYear < currentYear) return false;
    if (expYear === currentYear && expMonth < currentMonth) return false;
    return true;
  };

  const isValidCVV = (cvv: string): boolean => {
    return /^\d{3,4}$/.test(cvv);
  };

  const isFormValid = () => {
    const { fullName, address, city, zipCode, cardNumber, expiryDate, cvv } = formData;
    if (!fullName.trim() || !address.trim() || !city.trim() || !zipCode.trim() || 
        !cardNumber.trim() || !expiryDate.trim() || !cvv.trim()) {
      return false;
    }
    if (!isValidCardNumber(cardNumber)) return false;
    if (!isValidExpiry(expiryDate)) return false;
    if (!isValidCVV(cvv)) return false;
    return true;
  };

  const handleCardNumberChange = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    const formatted = groups ? groups.join(' ') : cleaned;
    setFormData({ ...formData, cardNumber: formatted });
  };

  const handleExpiryChange = (value: string) => {
    const cleaned = value.replace(/\//g, '');
    if (cleaned.length >= 2) {
      setFormData({ ...formData, expiryDate: cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4) });
    } else {
      setFormData({ ...formData, expiryDate: cleaned });
    }
  };

  const processPayment = (): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const isSuccessful = Math.random() > 0.05;
        resolve(isSuccessful);
      }, 2000);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🔒 Check if user is logged in before payment
    if (!isAuthenticated) {
      showWarning('⚠️ Please login or signup to place your order!');
      navigate('/login');
      return;
    }

    if (!isFormValid()) {
      showWarning('⚠️ Please fill all fields correctly');
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('processing');

    try {
      const paymentSuccessful = await processPayment();

      if (paymentSuccessful) {
        setPaymentStatus('success');
        
        const newOrder = {
          id: `ORD-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          total: total,
          status: 'pending',
          items: cart.map(item => ({
            id: item.product.id,
            title: item.product.title,
            price: item.product.price,
            quantity: item.quantity,
            image: item.product.image
          })),
          shippingAddress: {
            fullName: formData.fullName,
            street: formData.address,
            city: formData.city,
            zipCode: formData.zipCode
          },
          paymentMethod: 'Credit Card',
          paymentDetails: {
            cardLast4: formData.cardNumber.slice(-4),
            cardType: getCardType(formData.cardNumber),
          }
        };
        
        const existingOrders = localStorage.getItem(`orders_${user?.id}`);
        const orders = existingOrders ? JSON.parse(existingOrders) : [];
        orders.unshift(newOrder);
        localStorage.setItem(`orders_${user?.id}`, JSON.stringify(orders));
        
        const currentBalance = parseFloat(localStorage.getItem(`wallet_balance_${user?.id}`) || '0');
        const newBalance = currentBalance - total;
        localStorage.setItem(`wallet_balance_${user?.id}`, newBalance.toString());
        
        const existingTransactions = localStorage.getItem(`wallet_transactions_${user?.id}`);
        const transactions = existingTransactions ? JSON.parse(existingTransactions) : [];
        transactions.unshift({
          id: `TXN-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          type: 'debit',
          amount: total,
          description: `Payment for Order #${newOrder.id}`,
          status: 'completed',
          paymentMethod: 'Credit Card'
        });
        localStorage.setItem(`wallet_transactions_${user?.id}`, JSON.stringify(transactions));
        
        showSuccess('🎉 Order placed successfully!');
        setTimeout(() => {
          dispatch(clearCart());
          navigate('/products');
        }, 1500);
      } else {
        setPaymentStatus('failed');
        showError('❌ Payment failed. Please try again.');
        setIsProcessing(false);
      }
    } catch (error) {
      setPaymentStatus('failed');
      showError('❌ An error occurred. Please try again.');
      setIsProcessing(false);
    }
  };

  const getCardType = (cardNumber: string): string => {
    const cleaned = cardNumber.replace(/\s/g, '');
    if (cleaned.startsWith('4')) return 'Visa';
    if (cleaned.startsWith('5')) return 'Mastercard';
    if (cleaned.startsWith('3')) return 'American Express';
    if (cleaned.startsWith('6')) return 'Discover';
    return 'Unknown';
  };

  const formValid = isFormValid();

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-[1400px] mx-auto px-5 py-10 min-h-[calc(100vh-80px)] bg-gray-100 md:px-4 md:py-5">
      <div className="mb-8">
        <h1 className="text-3xl text-gray-800 font-bold md:text-2xl md:mb-5">Checkout</h1>
      </div>

      {/* Login Banner - shown only when not logged in */}
      {!isAuthenticated && (
        <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4 mb-6 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔒</span>
            <div>
              <p className="text-sm font-semibold text-yellow-800">You are not logged in</p>
              <p className="text-xs text-yellow-600">You can fill the form but you need to login to place your order</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="px-4 py-2 bg-blue-400 text-white text-sm font-medium rounded-lg border-none cursor-pointer hover:bg-blue-500"
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg border-none cursor-pointer hover:bg-green-600"
            >
              Sign Up
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-8 flex-wrap md:flex-col md:gap-5">
        {/* Left Column - Shipping & Payment */}
        <div className="flex-[2] min-w-[280px] md:w-full md:min-w-auto">
          {/* Shipping Information */}
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm md:p-5 md:mb-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-5 pb-2 border-b-2 border-blue-400 md:text-base md:mb-4">Shipping Information</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-200 rounded-lg text-sm transition-all duration-300 outline-none focus:border-blue-400 focus:shadow-[0_0_0_3px_rgba(79,195,247,0.1)] md:p-2.5"
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-200 rounded-lg text-sm transition-all duration-300 outline-none focus:border-blue-400 focus:shadow-[0_0_0_3px_rgba(79,195,247,0.1)] md:p-2.5"
                placeholder="Enter your address"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 md:grid-cols-1 md:gap-3">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1.5">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm transition-all duration-300 outline-none focus:border-blue-400 focus:shadow-[0_0_0_3px_rgba(79,195,247,0.1)] md:p-2.5"
                  placeholder="City"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Zip Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm transition-all duration-300 outline-none focus:border-blue-400 focus:shadow-[0_0_0_3px_rgba(79,195,247,0.1)] md:p-2.5"
                  placeholder="Zip Code"
                />
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm md:p-5 md:mb-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-5 pb-2 border-b-2 border-blue-400 md:text-base md:mb-4">Payment Information</h2>
            
            <div className="space-y-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={(e) => handleCardNumberChange(e.target.value)}
                  required
                  maxLength={19}
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm transition-all duration-300 outline-none focus:border-blue-400 focus:shadow-[0_0_0_3px_rgba(79,195,247,0.1)] md:p-2.5"
                  placeholder="4242 4242 4242 4242"
                />
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-gray-500">Test Cards: </span>
                  <span className="text-xs text-gray-600">💳 4242 4242 4242 4242</span>
                  <span className="text-xs text-gray-600">💳 5555 5555 5555 4444</span>
                </div>
                {formData.cardNumber && !isValidCardNumber(formData.cardNumber) && (
                  <p className="text-xs text-red-500 mt-1">⚠️ Please enter a valid test card number</p>
                )}
                {formData.cardNumber && isValidCardNumber(formData.cardNumber) && (
                  <p className="text-xs text-green-500 mt-1">✅ Valid card number</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4 md:grid-cols-1 md:gap-3">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Expiry Date</label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={(e) => handleExpiryChange(e.target.value)}
                    required
                    maxLength={5}
                    className="w-full p-3 border border-gray-200 rounded-lg text-sm transition-all duration-300 outline-none focus:border-blue-400 focus:shadow-[0_0_0_3px_rgba(79,195,247,0.1)] md:p-2.5"
                    placeholder="MM/YY (e.g., 12/25)"
                  />
                  {formData.expiryDate && !isValidExpiry(formData.expiryDate) && (
                    <p className="text-xs text-red-500 mt-1">⚠️ Please enter a valid future date (MM/YY)</p>
                  )}
                  {formData.expiryDate && isValidExpiry(formData.expiryDate) && (
                    <p className="text-xs text-green-500 mt-1">✅ Valid expiry date</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">CVV</label>
                  <input
                    type="password"
                    name="cvv"
                    value={formData.cvv}
                    onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                    required
                    maxLength={4}
                    className="w-full p-3 border border-gray-200 rounded-lg text-sm transition-all duration-300 outline-none focus:border-blue-400 focus:shadow-[0_0_0_3px_rgba(79,195,247,0.1)] md:p-2.5"
                    placeholder="123"
                  />
                  {formData.cvv && !isValidCVV(formData.cvv) && (
                    <p className="text-xs text-red-500 mt-1">⚠️ Please enter a valid CVV (3 or 4 digits)</p>
                  )}
                  {formData.cvv && isValidCVV(formData.cvv) && (
                    <p className="text-xs text-green-500 mt-1">✅ Valid CVV</p>
                  )}
                </div>
              </div>

              {paymentStatus === 'processing' && (
                <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg">
                  <LoadingSpinner size="small" message="Processing payment..." />
                </div>
              )}

              {paymentStatus === 'success' && (
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <span className="text-xl">✅</span>
                  <span className="text-sm text-green-600">Payment successful! Redirecting...</span>
                </div>
              )}

              {paymentStatus === 'failed' && (
                <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                  <span className="text-xl">❌</span>
                  <span className="text-sm text-red-600">Payment failed. Please try again.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="flex-1 min-w-[300px] md:w-full md:min-w-auto">
          <div className="bg-white rounded-xl p-6 shadow-sm sticky top-[100px] md:static md:p-5">
            <h2 className="text-lg font-semibold text-gray-800 mb-5 pb-2 border-b-2 border-blue-400 md:text-base md:mb-4">Order Summary</h2>
            
            <div className="max-h-[400px] overflow-y-auto mb-4">
              {cart.map(item => (
                <div key={item.product.id} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex gap-3 items-center flex-1">
                    <img src={item.product.image} alt={item.product.title} className="w-12 h-12 object-contain bg-gray-50 rounded-md p-1" />
                    <div className="flex-1">
                      <div className="text-[13px] font-medium text-gray-800 mb-1 leading-tight">{item.product.title.substring(0, 40)}</div>
                      <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-blue-400 ml-3">${(item.product.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>
            
            <div className="h-px bg-gray-200 my-4"></div>
            
            <div className="flex justify-between items-center mb-5 pt-2">
              <span className="text-lg font-semibold text-gray-800">Total:</span>
              <span className="text-2xl font-bold text-blue-400">${total.toFixed(2)}</span>
            </div>
            
            {/* Place Order Button */}
            {isAuthenticated ? (
              <button
                type="submit"
                disabled={!formValid || isProcessing}
                className={`w-full py-3.5 rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 ${
                  !formValid || isProcessing
                    ? 'bg-gray-300 cursor-not-allowed opacity-60'
                    : 'bg-green-500 text-white hover:bg-green-600 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(76,175,80,0.3)]'
                } md:py-3 md:text-sm`}
              >
                {isProcessing ? 'Processing...' : `Place Order ($${total.toFixed(2)})`}
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="w-full py-3.5 rounded-lg text-base font-semibold bg-blue-400 text-white border-none cursor-pointer hover:bg-blue-500 transition-all duration-300 md:py-3 md:text-sm"
                >
                  🔒 Login to Place Order
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/signup')}
                  className="w-full py-3.5 rounded-lg text-base font-semibold bg-green-500 text-white border-none cursor-pointer hover:bg-green-600 transition-all duration-300 md:py-3 md:text-sm"
                >
                  Create Account & Order
                </button>
              </div>
            )}

            <p className="text-xs text-gray-400 text-center mt-3">
              🔒 Secure payment powered by mock credit card
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;