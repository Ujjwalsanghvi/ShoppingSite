import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../../store/hooks';

interface Transaction {
  id: string;
  date: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  status: 'completed' | 'pending' | 'failed';
}

export const Wallet: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [amount, setAmount] = useState('');

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = () => {
    const savedBalance = localStorage.getItem(`wallet_balance_${user?.id}`);
    const savedTransactions = localStorage.getItem(`wallet_transactions_${user?.id}`);
    
    if (savedBalance) {
      setBalance(parseFloat(savedBalance));
    } else {
      setBalance(500.00);
      localStorage.setItem(`wallet_balance_${user?.id}`, '500.00');
    }
    
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    } else {
      const demoTransactions: Transaction[] = [
        {
          id: 'TXN-001',
          date: '2024-05-10',
          type: 'credit',
          amount: 500.00,
          description: 'Added money to wallet',
          status: 'completed'
        },
        {
          id: 'TXN-002',
          date: '2024-05-05',
          type: 'debit',
          amount: 89.99,
          description: 'Payment for Order #ORD-002',
          status: 'completed'
        }
      ];
      setTransactions(demoTransactions);
      localStorage.setItem(`wallet_transactions_${user?.id}`, JSON.stringify(demoTransactions));
    }
  };

  const saveWalletData = (newBalance: number, newTransactions: Transaction[]) => {
    setBalance(newBalance);
    setTransactions(newTransactions);
    localStorage.setItem(`wallet_balance_${user?.id}`, newBalance.toString());
    localStorage.setItem(`wallet_transactions_${user?.id}`, JSON.stringify(newTransactions));
  };

  const handleAddMoney = (e: React.FormEvent) => {
    e.preventDefault();
    const addAmount = parseFloat(amount);
    if (addAmount > 0 && addAmount <= 10000) {
      const newBalance = balance + addAmount;
      const newTransaction: Transaction = {
        id: `TXN-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        type: 'credit',
        amount: addAmount,
        description: 'Added money to wallet',
        status: 'completed'
      };
      saveWalletData(newBalance, [newTransaction, ...transactions]);
      setShowAddMoney(false);
      setAmount('');
      alert(`$${addAmount} added successfully!`);
    } else {
      alert('Please enter a valid amount between 1 and 10000');
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-10">
      <h1 className="text-[28px] text-gray-800 mb-8">My Wallet</h1>
      
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 rounded-xl flex justify-between items-center mb-10 text-white">
        <div className="flex flex-col gap-2.5">
          <span className="text-sm opacity-90">Current Balance</span>
          <span className="text-4xl font-bold">${balance.toFixed(2)}</span>
        </div>
        <button onClick={() => setShowAddMoney(true)} className="bg-white/20 text-white border border-white px-5 py-2.5 rounded-md cursor-pointer text-sm transition-all duration-300 hover:bg-white/30">
          + Add Money
        </button>
      </div>

      {showAddMoney && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[1000]">
          <div className="bg-white p-8 rounded-xl w-[90%] max-w-[400px]">
            <h3 className="text-xl text-gray-800 mb-5">Add Money to Wallet</h3>
            <form onSubmit={handleAddMoney}>
              <input
                type="number"
                placeholder="Enter amount (max $10,000)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                max="10000"
                step="0.01"
                required
                className="w-full p-3 border border-gray-300 rounded-md text-base mb-5"
              />
              <div className="flex gap-2.5">
                <button type="submit" className="flex-1 bg-green-500 text-white border-none py-2.5 rounded-md cursor-pointer">
                  Add Money
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddMoney(false);
                    setAmount('');
                  }}
                  className="flex-1 bg-red-500 text-white border-none py-2.5 rounded-md cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mt-5">
        <h2 className="text-xl text-gray-800 mb-5">Transaction History</h2>
        {transactions.length === 0 ? (
          <div className="text-center p-10 bg-gray-50 rounded-lg text-gray-500">
            <p>No transactions yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {transactions.map(transaction => (
              <div key={transaction.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                <div className="flex justify-between items-center mb-2.5">
                  <div>
                    <div className="font-bold mb-1">{transaction.description}</div>
                    <div className="text-xs text-gray-500">{transaction.date}</div>
                  </div>
                  <div className={`text-lg font-bold ${transaction.type === 'credit' ? 'text-green-500' : 'text-red-500'}`}>
                    {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2 py-1 rounded text-white text-[11px] uppercase ${
                    transaction.status === 'completed' ? 'bg-green-500' : 
                    transaction.status === 'pending' ? 'bg-orange-500' : 'bg-red-500'
                  }`}>
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;