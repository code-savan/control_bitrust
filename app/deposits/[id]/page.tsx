"use client";

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface DepositDetail {
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

const DepositDetail = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [deposit, setDeposit] = useState<DepositDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);

  useEffect(() => {
    const fetchDeposit = async () => {
      try {
        setLoading(true);
        const { data: depositData, error: depositError } = await supabase
          .from('deposits')
          .select('*')
          .eq('id', id)
          .single();

        if (depositError) throw depositError;

        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('name, email')
          .eq('id', depositData.user_id)
          .single();

        if (userError) throw userError;

        setDeposit({
          ...depositData,
          name: userData.name,
          email: userData.email,
        });
      } catch (err: unknown) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchDeposit();
  }, [id]);

  const handleConfirmDeposit = async () => {
    if (!deposit) return;
    try {
      setProcessing(true);

      // Start a transaction to update both the deposit status and user balance
      const { data: userData, error: fetchError } = await supabase
        .from('profiles')
        .select('total_balance, available_balance')
        .eq('id', deposit.user_id)
        .single();

      if (fetchError) throw fetchError;

      const newTotalBalance = (userData.total_balance || 0) + deposit.amount;
      const newAvailableBalance = (userData.available_balance || 0) + deposit.amount;

      // Update user balances
      const { error: updateUserError } = await supabase
        .from('profiles')
        .update({
          total_balance: newTotalBalance,
          available_balance: newAvailableBalance,
        })
        .eq('id', deposit.user_id);

      if (updateUserError) throw updateUserError;

      // Update deposit status
      const { error: updateDepositError } = await supabase
        .from('deposits')
        .update({ status: 'completed' })
        .eq('id', deposit.id);

      if (updateDepositError) throw updateDepositError;

      alert('Deposit has been confirmed successfully.');
      router.push('/deposits');
    } catch (err: unknown) {
      alert(`Error confirming deposit: ${(err as Error).message}`);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div>Loading Deposit Details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!deposit) return <div>No Deposit Found.</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Deposit Details</h1>
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex flex-col gap-4 mb-6">
          <p><strong>Name:</strong> {deposit.name}</p>
          <p><strong>Email:</strong> {deposit.email}</p>
          <p><strong>Amount:</strong> ${deposit.amount}</p>
          <p><strong>Method:</strong> {deposit.method}</p>
          <p><strong>Type:</strong> {deposit.type}</p>
          <p><strong>Status:</strong> {deposit.status}</p>
          <p><strong>Submitted At:</strong> {new Date(deposit.created_at).toLocaleString()}</p>
        </div>

        {deposit.receipt_url && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Receipt</h2>
            <div className="border rounded-lg overflow-hidden">
              <Image
                src={deposit.receipt_url}
                alt="Receipt"
                width={1000}
                height={1000}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        )}

        {deposit.status === 'pending' && (
          <Button
            onClick={handleConfirmDeposit}
            disabled={processing}
            className="w-full md:w-auto"
          >
            {processing ? 'Processing...' : 'Confirm Deposit'}
          </Button>
        )}

        <div className="mt-4">
          <Link href="/deposits" className="text-blue-600 hover:text-blue-900">
            &larr; Back to Deposits
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DepositDetail;
