'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Home' },
    { href: '/peserta', label: 'Peserta' },
    { href: '/provinsi', label: 'Provinsi' },
    { href: '/kabkot', label: 'Kabupaten/Kota' },
  ];

  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <h1 className="text-lg font-bold text-slate-800">Project API</h1>
        <div className="flex gap-1 flex-wrap">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors
                ${pathname === href
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-700 hover:bg-slate-100'
                }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
