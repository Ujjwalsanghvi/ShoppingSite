export interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}