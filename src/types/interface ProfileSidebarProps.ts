import { ProfileData } from "./ProfileData";

export interface ProfileSidebarProps {
  profileData: ProfileData;
  onEditClick: () => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}