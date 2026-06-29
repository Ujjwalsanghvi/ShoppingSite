import { IAddress } from "./Address";
import { Transaction } from "./Transaction";

export interface AccountStatisticsProps {
  addresses: IAddress[];
  transactions: Transaction[];
  walletBalance: number;
  isStatsOpen: boolean;
  selectedStat: string | null;
  onToggleStats: () => void;
  onStatClick: (statName: string) => void;
}