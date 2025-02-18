"use client"

import { X, Users, FileCheck } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity lg:hidden ${
          isOpen ? 'opacity-100 z-40' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-screen w-64 bg-gray-900 text-white transform transition-transform duration-200 ease-in-out
        lg:translate-x-0 lg:static lg:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h1 className="text-xl font-bold">Bitrust Admin</h1>
          <button onClick={onClose} className="lg:hidden">
            <X size={24} />
          </button>
        </div>

        <nav className="mt-6">
          <div className="px-4 space-y-2">
            <Link
              href="/"
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                pathname === '/' ? 'bg-blue-600' : 'hover:bg-gray-800'
              }`}
            >
              <Users size={20} />
              <span>Profiles</span>
            </Link>
            <Link
              href="/verifications"
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                pathname === '/verifications' ? 'bg-blue-600' : 'hover:bg-gray-800'
              }`}
            >
              <FileCheck size={20} />
              <span>Verifications</span>
            </Link>
          </div>
        </nav>
      </aside>
    </>
  );
}
