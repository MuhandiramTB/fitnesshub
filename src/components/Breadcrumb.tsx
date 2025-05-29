'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Breadcrumb() {
  const pathname = usePathname();
  
  // Skip breadcrumb for home page
  if (pathname === '/') return null;

  const segments = pathname.split('/').filter(Boolean);
  
  const breadcrumbs = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join('/')}`;
    const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
    
    return {
      href,
      label,
      isLast: index === segments.length - 1
    };
  });

  return (
    <nav className="bg-[#1a1f1c] py-2 px-4">
      <div className="max-w-7xl mx-auto">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <Link href="/" className="text-white hover:text-[#38e07b] transition-colors">
              Home
            </Link>
          </li>
          {breadcrumbs.map((crumb, index) => (
            <li key={crumb.href} className="flex items-center space-x-2">
              <span className="text-gray-400">/</span>
              {crumb.isLast ? (
                <span className="text-[#38e07b]">{crumb.label}</span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-white hover:text-[#38e07b] transition-colors"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
} 