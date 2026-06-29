import React from 'react';

interface EmptyAddressStateProps {
  onAddClick: () => void;
}

export const EmptyAddressState: React.FC<EmptyAddressStateProps> = ({ onAddClick }) => {
  return (
    <div className="text-center p-15 bg-gray-50 rounded-lg">
      <p>No addresses saved yet.</p>
      <button
        onClick={onAddClick}
        className="mt-5 bg-green-500 text-white border-none px-5 py-2.5 rounded-md cursor-pointer"
      >
        Add Your First Address
      </button>
    </div>
  );
};