import React from 'react';
import { IAddress } from '../../types/Address';
import { AddressFormProps } from '../../types/AddressFormProps';


export const AddressForm: React.FC<AddressFormProps> = ({
  isOpen,
  editingAddress,
  formData,
  onSubmit,
  onClose,
  onChange
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[1000]">
      <div className="bg-white p-8 rounded-xl w-[90%] max-w-[500px]">
        <h2 className="text-xl text-gray-800 mb-5">
          {editingAddress ? 'Edit Address' : 'Add New Address'}
        </h2>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={(e) => onChange('fullName', e.target.value)}
            required
            className="p-3 border border-gray-300 rounded-md text-sm"
          />
          <input
            type="text"
            placeholder="Street Address"
            value={formData.street}
            onChange={(e) => onChange('street', e.target.value)}
            required
            className="p-3 border border-gray-300 rounded-md text-sm"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="City"
              value={formData.city}
              onChange={(e) => onChange('city', e.target.value)}
              required
              className="p-3 border border-gray-300 rounded-md text-sm"
            />
            <input
              type="text"
              placeholder="State"
              value={formData.state}
              onChange={(e) => onChange('state', e.target.value)}
              required
              className="p-3 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="ZIP Code"
              value={formData.zipCode}
              onChange={(e) => onChange('zipCode', e.target.value)}
              required
              className="p-3 border border-gray-300 rounded-md text-sm"
            />
            <input
              type="text"
              placeholder="Country"
              value={formData.country}
              onChange={(e) => onChange('country', e.target.value)}
              required
              className="p-3 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <input
            type="tel"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            required
            className="p-3 border border-gray-300 rounded-md text-sm"
          />
          <div className="flex gap-2.5 mt-2.5">
            <button type="submit" className="flex-1 bg-green-500 text-white border-none py-3 rounded-md cursor-pointer">
              {editingAddress ? 'Update' : 'Save'} Address
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-red-500 text-white border-none py-3 rounded-md cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};