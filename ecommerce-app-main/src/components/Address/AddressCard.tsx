import React from 'react';
import { IAddress } from '../../types/Address';

interface AddressCardProps {
  address: IAddress;
  onEdit: (address: IAddress) => void;
  onDelete: (id: number) => void;
  onSetDefault: (id: number) => void;
}

export const AddressCard: React.FC<AddressCardProps> = ({
  address,
  onEdit,
  onDelete,
  onSetDefault
}) => {
  return (
    <div className="border border-gray-200 rounded-lg p-5 relative bg-white">
      {address.isDefault && (
        <span className="absolute top-2.5 right-2.5 bg-green-500 text-white px-2 py-1 rounded text-xs">
          Default
        </span>
      )}
      <div className="mb-4">
        <p><strong>{address.fullName}</strong></p>
        <p>{address.street}</p>
        <p>{address.city}, {address.state} {address.zipCode}</p>
        <p>{address.country}</p>
        <p>📞 {address.phone}</p>
      </div>
      <div className="flex gap-2.5 justify-end">
        {!address.isDefault && (
          <button
            onClick={() => onSetDefault(address.id)}
            className="bg-blue-500 text-white border-none px-3 py-1.5 rounded text-xs cursor-pointer"
          >
            Set as Default
          </button>
        )}
        <button
          onClick={() => onEdit(address)}
          className="bg-orange-500 text-white border-none px-3 py-1.5 rounded text-xs cursor-pointer"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(address.id)}
          className="bg-red-500 text-white border-none px-3 py-1.5 rounded text-xs cursor-pointer"
        >
          Delete
        </button>
      </div>
    </div>
  );
};