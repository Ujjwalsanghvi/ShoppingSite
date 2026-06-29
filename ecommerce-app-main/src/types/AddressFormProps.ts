import { IAddress } from "./Address";

export interface AddressFormProps {
  isOpen: boolean;
  editingAddress: IAddress | null;
  formData: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  };
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  onChange: (field: string, value: string) => void;
}