'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  {
    label: 'Media',
    href: '/media',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
      </svg>
    ),
  },
  {
    label: 'Analysis',
    href: '/analysis',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-3 3" />
      </svg>
    ),
  },
  {
    label: 'Calendar',
    href: '/calendar',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
        <line x1="16" x2="16" y1="2" y2="6" />
        <line x1="8" x2="8" y1="2" y2="6" />
        <line x1="3" x2="21" y1="10" y2="10" />
      </svg>
    ),
  },
  {
    label: 'In Progress',
    href: '/in-progress',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="7" height="7" x="3" y="3" rx="1" />
        <rect width="7" height="7" x="14" y="3" rx="1" />
        <rect width="7" height="7" x="14" y="14" rx="1" />
        <rect width="7" height="7" x="3" y="14" rx="1" />
      </svg>
    ),
  },
  {
    label: 'Files',
    href: '/files',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[260px] bg-[#1a2744] text-white flex flex-col z-50">
      <div className="px-4 py-6 border-b border-white/10 flex flex-col items-center">
        <svg width="80" height="100" viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="70" stroke="#6b8cba" strokeWidth="5" fill="none"/>
          <path d="M100 35L65 105L100 90Z" fill="white"/>
          <path d="M100 90L135 105L100 35Z" fill="#8aadd4"/>
          <path d="M100 90L65 105L100 165Z" fill="#6b8cba"/>
          <path d="M100 165L135 105L100 90Z" fill="white" fillOpacity="0.6"/>
          <text x="100" y="205" textAnchor="middle" fontFamily="sans-serif" fontWeight="700" fontSize="30" letterSpacing="8" fill="white">RIZ</text>
          <text x="100" y="228" textAnchor="middle" fontFamily="sans-serif" fontWeight="400" fontSize="13" letterSpacing="3" fill="#8aadd4">INTERNATIONAL</text>
        </svg>
        <p className="text-xs text-white/50 mt-2">Content Dashboard</p>
      </div>

      <nav className="flex-1 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-white/10 border-l-[3px] border-white pl-[21px]'
                  : 'text-white/70 hover:text-white hover:bg-white/5 border-l-[3px] border-transparent pl-[21px]'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-6 py-4 border-t border-white/10">
        <p className="text-xs text-white/40">@rizinternational</p>
        <p className="text-xs text-white/40">104K followers</p>
      </div>
    </aside>
  );
}
