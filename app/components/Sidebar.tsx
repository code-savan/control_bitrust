"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-gray-800 text-white fixed">
      <div className="p-4 text-2xl font-bold">Bitrust Admin</div>
      <nav className="mt-10">
        <ul>
          <li className={`p-4 hover:bg-gray-700 ${pathname === '/' ? 'bg-gray-700' : ''}`}>
            <Link href="/">Profiles</Link>
          </li>
          <li className={`p-4 hover:bg-gray-700 ${pathname.startsWith('/verifications') ? 'bg-gray-700' : ''}`}>
            <Link href="/verifications">Verifications</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
