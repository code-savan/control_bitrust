"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { Menu } from 'lucide-react';
import Sidebar from '../components/Sidebar';

interface Deposit {
  id: string;
  user_id: string;
  created_at: string;
  method: string;
  type: string;
  amount: number;
  status: string;
  receipt_url: string;
  name: string;
  email: string;
}

const Deposits = () => {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchDeposits = async () => {
      try {
        setLoading(true);
        const { data: depositsData, error: depositsError } = await supabase
          .from('deposits')
          .select('*');

        if (depositsError) throw depositsError;

        const depositsWithUserDetails = await Promise.all(
          depositsData.map(async (deposit) => {
            const { data: userData, error: userError } = await supabase
              .from('profiles')
              .select('name, email')
              .eq('id', deposit.user_id)
              .single();

            if (userError) {
              console.error(`Error fetching user data for user_id ${deposit.user_id}:`, userError);
              return { ...deposit, name: 'N/A', email: 'N/A' };
            }

            return { ...deposit, name: userData.name, email: userData.email };
          })
        );

        setDeposits(depositsWithUserDetails);
      } catch (err: unknown) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchDeposits();
  }, []);

  if (loading) return <div>Loading Deposits...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen">
      <header className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold">Bitrust Admin</h1>
        <button onClick={() => setIsSidebarOpen(true)}>
          <Menu size={24} />
        </button>
      </header>

      <div className='flex'>
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <div className='md:p-8 p-3 border min-h-screen w-full overflow-y-auto'>
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">User Deposits</h1>
          <div className="overflow-x-auto shadow-lg rounded-lg">
            <table className="min-w-full bg-white rounded-lg">
              <thead className="bg-gradient-to-r from-green-500 to-teal-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {deposits.map((deposit) => (
                  <tr key={deposit.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{deposit.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{deposit.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${deposit.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{deposit.method}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{deposit.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        deposit.status === 'completed' ? 'bg-green-100 text-green-800' :
                        deposit.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {deposit.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(deposit.created_at).toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/deposits/${deposit.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deposits;
