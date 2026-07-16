import { IAddress } from '../types/Address';


export const getInitialAddressForm = (address?: IAddress) => ({
  fullName: address?.fullName ?? '',
  street: address?.street ?? '',
  city: address?.city ?? '',
  state: address?.state ?? '',
  zipCode: address?.zipCode ?? '',
  country: address?.country ?? '',
  phone: address?.phone ?? ''
});


export const getAddressFormFromAddress = (address: IAddress) => ({
  fullName: address.fullName,
  street: address.street,
  city: address.city,
  state: address.state,
  zipCode: address.zipCode,
  country: address.country,
  phone: address.phone
});


export const getAddressFormWithName = (name: string) => ({
  fullName: name,
  street: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',
  phone: ''
});   