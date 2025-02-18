"use client"
import { useEffect, useState } from 'react';
import { UserData } from '@/lib/supabase/types';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const Profiles = () => {
  const [profiles, setProfiles] = useState<UserData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*');

        if (error) throw error;
        setProfiles(data || []);
      } catch (err: unknown) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user and all associated verifications?")) return;

    try {
      // Delete verifications associated with the user
      const { error: verificationError } = await supabase
        .from('verifications')
        .delete()
        .eq('user_id', id);

      if (verificationError) throw verificationError;

      // Delete the user
      const { error: userError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (userError) throw userError;

      setProfiles(profiles.filter(profile => profile.id !== id));
      alert('User and associated verifications deleted successfully.');
    } catch (err: unknown) {
      alert(`Error deleting user: ${(err as Error).message}`);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8">Error: {error}</div>;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Bitrust Admin</h1>
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full bg-white rounded-lg">
          <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Phone Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Country</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {profiles.map((profile) => (
              <tr key={profile.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{profile.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{profile.username}</td>
                <td className="px-6 py-4 whitespace-nowrap">{profile.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{profile.phone_number}</td>
                <td className="px-6 py-4 whitespace-nowrap">{profile.country}</td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  <Link
                    href={`/edit-profile/${profile.id}`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </Link>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(profile.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Profiles;
