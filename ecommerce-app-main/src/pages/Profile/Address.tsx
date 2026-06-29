import React from 'react';
import { useAddress } from '../../hooks/useAddress';
import { AddressHeader } from '../../components/Address/AddressHeader';
import { AddressCard } from '../../components/Address/AddressCard';
import { AddressForm } from '../../components/Address/AddressForm';
import { EmptyAddressState } from '../../components/Address/EmptyAddressState';

export const Address: React.FC = () => {
  const {
    addresses,
    showForm,
    editingAddress,
    formData,
    handleSubmit,
    handleEdit,
    handleDelete,
    setDefaultAddress,
    openAddForm,
    closeForm,
    handleFormChange
  } = useAddress();

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-10">
      <AddressHeader onAddClick={openAddForm} />

      <AddressForm
        isOpen={showForm}
        editingAddress={editingAddress}
        formData={formData}
        onSubmit={handleSubmit}
        onClose={closeForm}
        onChange={handleFormChange}
      />

      <div className="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-5">
        {addresses.length === 0 ? (
          <EmptyAddressState onAddClick={openAddForm} />
        ) : (
          addresses.map(address => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSetDefault={setDefaultAddress}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Address;