import { ProfileData } from "./ProfileData";

export interface PersonalInfoSectionProps {
  profileData: ProfileData;
  isOpen: boolean;
  onToggle: () => void;
}