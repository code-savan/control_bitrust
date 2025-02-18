"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { Menu } from 'lucide-react';
import Sidebar from '../components/Sidebar';

interface Verification {
    id: string;
    user_id: string;
    document_urls: string[];
    created_at: string;
    name: string;
  email: string;
  kyc_status: string;
}

const Verifications = () => {
    const [verifications, setVerifications] = useState<Verification[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  useEffect(() => {
    const fetchVerifications = async () => {
      try {
        setLoading(true);
        const { data: verificationsData, error: verificationsError } = await supabase
          .from('verifications')
          .select('*');

        if (verificationsError) throw verificationsError;

        const verificationsWithUserDetails = await Promise.all(
          verificationsData.map(async (verification) => {
            const { data: userData, error: userError } = await supabase
              .from('profiles')
              .select('name, email, kyc_status')
              .eq('id', verification.user_id)
              .single();

            if (userError) {
              console.error(`Error fetching user data for user_id ${verification.user_id}:`, userError);
              return { ...verification, name: 'N/A', email: 'N/A', kyc_status: 'N/A' };
            }

            return { ...verification, name: userData.name, email: userData.email, kyc_status: userData.kyc_status };
          })
        );

        setVerifications(verificationsWithUserDetails);
      } catch (err: unknown) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchVerifications();
  }, []);




  if (loading) return <div>Loading Verifications...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen">
         {/* Header for mobile */}
      <header className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold">Bitrust Admin</h1>
        <button onClick={() => setIsSidebarOpen(true)}>
          <Menu size={24} />
        </button>
      </header>

    <div className='flex'>
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className='md:p-8 p-3 border min-h-screen w-full overflow-y-auto'>

      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">User Verifications</h1>
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full bg-white rounded-lg">
          <thead className="bg-gradient-to-r from-green-500 to-teal-600 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">KYC Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Submitted At</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {verifications.map((verification) => (
              <tr key={verification.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{verification.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{verification.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{verification.kyc_status}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(verification.created_at).toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    href={`/verifications/${verification.id}`}
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

export default Verifications;
