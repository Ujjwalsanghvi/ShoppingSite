import { ProfileData } from "./ProfileData";

export interface EditProfileModalProps {
  isOpen: boolean;
  editData: ProfileData;
  onClose: () => void;
  onSave: () => void;
  onInputChange: (field: keyof ProfileData, value: string) => void;
}