import React, { useState } from 'react';

interface CreditCardFormProps {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  onCardNumberChange: (value: string) => void;
  onExpiryChange: (value: string) => void;
  onCvvChange: (value: string) => void;
  isProcessing?: boolean;
}

export const CreditCardForm: React.FC<CreditCardFormProps> = ({
  cardNumber,
  expiryDate,
  cvv,
  onCardNumberChange,
  onExpiryChange,
  onCvvChange,
  isProcessing = false,
}) => {
  const [showCVV, setShowCVV] = useState(false);

  const getCardType = (number: string): { type: string; color: string } => {
    const cleaned = number.replace(/\s/g, '');
    if (cleaned.startsWith('4')) return { type: 'Visa', color: '#1a1f71' };
    if (cleaned.startsWith('5')) return { type: 'Mastercard', color: '#eb001b' };
    if (cleaned.startsWith('3')) return { type: 'Amex', color: '#006fcf' };
    if (cleaned.startsWith('6')) return { type: 'Discover', color: '#ff6000' };
    return { type: 'Unknown', color: '#666' };
  };

  const cardType = getCardType(cardNumber);

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-1.5">Card Number</label>
        <div className="relative">
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => onCardNumberChange(e.target.value)}
            required
            maxLength={19}
            disabled={isProcessing}
            className="w-full p-3 border border-gray-200 rounded-lg text-sm transition-all duration-300 outline-none focus:border-blue-400 focus:shadow-[0_0_0_3px_rgba(79,195,247,0.1)] md:p-2.5 pr-16"
            placeholder="1234 5678 9012 3456"
          />
          {cardNumber.length > 0 && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <span className="text-xs font-medium px-2 py-1 rounded" style={{ color: cardType.color }}>
                {cardType.type}
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-gray-500">Supported: </span>
          <span className="text-xs text-gray-600">💳 Visa</span>
          <span className="text-xs text-gray-600">💳 Mastercard</span>
          <span className="text-xs text-gray-600">💳 Amex</span>
          <span className="text-xs text-gray-600">💳 Discover</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 md:grid-cols-1 md:gap-3">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1.5">Expiry Date</label>
          <input
            type="text"
            value={expiryDate}
            onChange={(e) => onExpiryChange(e.target.value)}
            required
            maxLength={5}
            disabled={isProcessing}
            className="w-full p-3 border border-gray-200 rounded-lg text-sm transition-all duration-300 outline-none focus:border-blue-400 focus:shadow-[0_0_0_3px_rgba(79,195,247,0.1)] md:p-2.5"
            placeholder="MM/YY"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1.5">CVV</label>
          <div className="relative">
            <input
              type={showCVV ? "text" : "password"}
              value={cvv}
              onChange={(e) => onCvvChange(e.target.value)}
              required
              maxLength={4}
              disabled={isProcessing}
              className="w-full p-3 border border-gray-200 rounded-lg text-sm transition-all duration-300 outline-none focus:border-blue-400 focus:shadow-[0_0_0_3px_rgba(79,195,247,0.1)] md:p-2.5 pr-12"
              placeholder="123"
            />
            <button
              type="button"
              onClick={() => setShowCVV(!showCVV)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-blue-400 hover:text-blue-500"
            >
              {showCVV ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>
      </div>

      {/* Demo Card Info */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
        <p className="text-xs text-blue-600 font-medium mb-1">💡 Test Card Details</p>
        <div className="grid grid-cols-2 gap-2 text-xs text-blue-500">
          <span>Card: 4242 4242 4242 4242</span>
          <span>Expiry: 12/25</span>
          <span>CVV: 123</span>
          <span>Any future date works!</span>
        </div>
      </div>
    </div>
  );
};