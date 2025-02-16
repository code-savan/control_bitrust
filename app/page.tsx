"use client"
import { useEffect, useState } from 'react';
import { UserData } from '@/lib/supabase/types';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';

const Profiles = () => {
  const [profiles, setProfiles] = useState<UserData[]>([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) {
        console.error('Error fetching profiles:', error);
      } else {
        setProfiles(data || []);
      }
    };

    fetchProfiles();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Bitrust Admin</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {profiles.map((profile) => (
              <tr key={profile.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{profile.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{profile.username}</td>
                <td className="px-6 py-4 whitespace-nowrap">{profile.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{profile.phone_number}</td>
                <td className="px-6 py-4 whitespace-nowrap">{profile.country}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    href={`/edit-profile/${profile.id}`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </Link>
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
