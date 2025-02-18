"use client";

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface VerificationDetail {
  id: string;
  user_id: string;
  document_urls: string[];
  created_at: string;
  name: string;
  email: string;
  kyc_status: string;
}

const VerificationDetail = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [verification, setVerification] = useState<VerificationDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState<boolean>(false);

  useEffect(() => {
    const fetchVerification = async () => {
      try {
        setLoading(true);
        const { data: verificationData, error: verificationError } = await supabase
          .from('verifications')
          .select('*')
          .eq('id', id)
          .single();

        if (verificationError) throw verificationError;

        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('name, email, kyc_status')
          .eq('id', verificationData.user_id)
          .single();

        if (userError) throw userError;

        setVerification({
          ...verificationData,
          name: userData.name,
          email: userData.email,
          kyc_status: userData.kyc_status,
        });
      } catch (err: unknown) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchVerification();
  }, [id]);

  const handleVerify = async () => {
    if (!verification) return;
    try {
      setVerifying(true);
      const { error } = await supabase
        .from('profiles')
        .update({ kyc_status: 'Verified' })
        .eq('id', verification.user_id);

      if (error) throw error;

      alert('User has been verified successfully.');
      router.push('/verifications');
    } catch (err: unknown) {
      alert(`Error verifying user: ${(err as Error).message}`);
    } finally {
      setVerifying(false);
    }
  };

  if (loading) return <div>Loading Verification Details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!verification) return <div>No Verification Found.</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Verification Details</h1>
      <div className="mb-6">
        <p><strong>Name:</strong> {verification.name}</p>
        <p><strong>Email:</strong> {verification.email}</p>
        <p><strong>KYC Verified:</strong> {verification.kyc_status === 'Verified' ? 'Yes' : 'No'}</p>
        <p><strong>Submitted At:</strong> {new Date(verification.created_at).toLocaleString()}</p>
      </div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Verification Documents</h2>
        <div className="flex  gap-4">
          {verification.document_urls.map((url, index) => (
            <Image key={index} src={url} alt={`Document ${index + 1}`} width={1000} height={1000} className="w-[500px] h-fit object-contain border" />
          ))}
        </div>
      </div>
      {verification.kyc_status !== 'Verified' && (
        <Button onClick={handleVerify} disabled={verifying}>
          {verifying ? 'Verifying...' : 'Verify User'}
        </Button>
      )}
      <div className="mt-4">
        <Link href="/verifications" className="text-blue-600 hover:text-blue-900">
          &larr; Back to Verifications
        </Link>
      </div>
    </div>
  );
};

export default VerificationDetail;
