import { IAddress } from "./Address";

export interface AddressCardProps {
  address: IAddress;
  onEdit: (address: IAddress) => void;
  onDelete: (id: number) => void;
  onSetDefault: (id: number) => void;
}