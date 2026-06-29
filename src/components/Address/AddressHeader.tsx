import React from 'react';

interface AddressHeaderProps {
  onAddClick: () => void;
}

export const AddressHeader: React.FC<AddressHeaderProps> = ({ onAddClick }) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-[28px] text-gray-800">My Addresses</h1>
      <button
        onClick={onAddClick}
        className="bg-green-500 text-white border-none px-5 py-2.5 rounded-md cursor-pointer text-sm"
      >
        + Add New Address
      </button>
    </div>
  );
};