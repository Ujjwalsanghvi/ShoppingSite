import { useState, useEffect } from 'react';
import { useAppSelector } from '../store/hooks';
import { IAddress } from '../types/Address';
import { getDemoAddresses } from '../data/demoAddresses';
import { 
  getInitialAddressForm, 
  getAddressFormFromAddress, 
  getAddressFormWithName 
} from '../data/addressFormData';

export const useAddress = () => {
  // Get user from Redux instead of AuthContext
  const { user } = useAppSelector((state) => state.auth);
  
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<IAddress | null>(null);
  const [formData, setFormData] = useState(getInitialAddressForm());

  useEffect(() => {
    loadAddresses();
  }, [user?.id]);

  const loadAddresses = () => {
    const savedAddresses = localStorage.getItem(`addresses_${user?.id}`);
    if (savedAddresses) {
      setAddresses(JSON.parse(savedAddresses));
    } else {
      const demoAddresses = getDemoAddresses(user);
      setAddresses(demoAddresses);
      localStorage.setItem(`addresses_${user?.id}`, JSON.stringify(demoAddresses));
    }
  };

  const saveAddresses = (newAddresses: IAddress[]) => {
    setAddresses(newAddresses);
    localStorage.setItem(`addresses_${user?.id}`, JSON.stringify(newAddresses));
  };

  const resetForm = () => {
    setFormData(getInitialAddressForm());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAddress) {
      const updatedAddresses = addresses.map(addr =>
        addr.id === editingAddress.id
          ? { ...formData, id: addr.id, isDefault: addr.isDefault }
          : addr
      );
      saveAddresses(updatedAddresses);
    } else {
      const newAddress: IAddress = {
        id: Date.now(),
        ...formData,
        isDefault: addresses.length === 0
      };
      saveAddresses([...addresses, newAddress]);
    }
    setShowForm(false);
    setEditingAddress(null);
    resetForm();
  };

  const handleEdit = (address: IAddress) => {
    setEditingAddress(address);
    setFormData(getAddressFormFromAddress(address));
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      const updatedAddresses = addresses.filter(addr => addr.id !== id);
      saveAddresses(updatedAddresses);
    }
  };

  const setDefaultAddress = (id: number) => {
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    }));
    saveAddresses(updatedAddresses);
  };

  const openAddForm = () => {
    setEditingAddress(null);
    setFormData(getAddressFormWithName(user?.name || ''));
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingAddress(null);
    resetForm();
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return {
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
  };
};