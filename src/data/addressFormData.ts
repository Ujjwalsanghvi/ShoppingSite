import { IAddress } from '../types/Address';

// Get initial empty form data
export const getInitialAddressForm = (address?: IAddress) => ({
  fullName: address?.fullName ?? '',
  street: address?.street ?? '',
  city: address?.city ?? '',
  state: address?.state ?? '',
  zipCode: address?.zipCode ?? '',
  country: address?.country ?? '',
  phone: address?.phone ?? ''
});

// Get form data from address (for editing)
export const getAddressFormFromAddress = (address: IAddress) => ({
  fullName: address.fullName,
  street: address.street,
  city: address.city,
  state: address.state,
  zipCode: address.zipCode,
  country: address.country,
  phone: address.phone
});

// Get form data with name only (for adding new address)
export const getAddressFormWithName = (name: string) => ({
  fullName: name,
  street: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',
  phone: ''
});   