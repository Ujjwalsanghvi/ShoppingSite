import { Transaction } from "../types/Transaction";

 export const demoTransactions: Transaction[] = [
        {
          id: 'TXN-001',
          date: '2024-05-10',
          type: 'credit',
          amount: 500.0,
          description: 'Added money to wallet',
          status: 'completed',
        },
        {
          id: 'TXN-002',
          date: '2024-05-05',
          type: 'debit',
          amount: 89.99,
          description: 'Payment for Order #ORD-002',
          status: 'completed',
        },
      ];