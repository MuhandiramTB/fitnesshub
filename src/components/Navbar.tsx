'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import RegisterModal from './Auth/RegisterModal';
import { useRouter } from 'next/navigation';

interface UserData {
  id: string;
  name: string;
  email: string;
}

interface NavLink {
  href: string;
  label: string;
  icon: JSX.Element;
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginMode, setIsLoginMode] = useState(true);

  const navLinks: NavLink[] = [
    { href: '/', label: 'Home', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )},
    { href: '/programs', label: 'Programs', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )},
    { href: '/nutrition', label: 'Nutrition', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    )},
    { href: '/membership', label: 'Membership', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )},
    
  ];

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
          const response = await fetch(`${apiBaseUrl}/api/user/profile`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsUserDropdownOpen(false);
    router.refresh();
  };

  const handleAuthClick = (isLogin: boolean) => {
    setIsLoginMode(isLogin);
    setIsRegisterModalOpen(true);
  };

  const handleLoginSuccessAction = (userData: UserData) => {
    setUser(userData);
    setIsRegisterModalOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#111714] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center gap-4 text-white">
                <div className="size-8">
                  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z"
                      fill="currentColor"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <span className="text-lg font-bold leading-tight tracking-[-0.015em]">Fitness Hub</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex md:items-center md:space-x-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 text-sm transition-all duration-200 relative group ${
                      isActive ? 'text-[#38e07b]' : 'text-white hover:text-[#38e07b]'
                    }`}
                  >
                    {link.icon}
                    {link.label}
                    <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-[#38e07b] transition-all duration-200 group-hover:w-full ${
                      isActive ? 'w-full' : ''
                    }`} />
                  </Link>
                );
              })}
            </nav>

            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:text-[#38e07b] transition-colors p-2"
                aria-label="Toggle menu"
              >
                {!isMenuOpen ? (
                  <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>

            {/* Right side buttons - Desktop */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              {!isLoading && (
                user ? (
                  <div className="relative">
                    <button 
                      onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                      className="flex items-center space-x-2 text-white hover:text-[#38e07b] transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#38e07b] flex items-center justify-center text-black">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm">{user.name}</span>
                    </button>

                    {/* User Dropdown Menu */}
                    {isUserDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-[#1a1f1c] rounded-lg shadow-lg py-1 z-50">
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm text-white hover:bg-[#29382f] transition-colors"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          Profile Settings
                        </Link>
                        <Link
                          href="/my-programs"
                          className="block px-4 py-2 text-sm text-white hover:bg-[#29382f] transition-colors"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          My Programs
                        </Link>
                        <Link
                          href="/my-nutrition"
                          className="block px-4 py-2 text-sm text-white hover:bg-[#29382f] transition-colors"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          My Nutrition Plan
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#29382f] transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={() => handleAuthClick(true)}
                      className="flex items-center gap-2 text-white hover:text-[#38e07b] transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-sm">Login</span>
                    </button>
                    <button 
                      onClick={() => handleAuthClick(false)}
                      className="bg-[#38e07b] text-black px-4 py-1.5 rounded-full text-sm font-medium hover:bg-[#2bc665] transition-colors"
                    >
                      Sign Up
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu backdrop */}
        {isMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 transition-opacity duration-300 md:hidden z-40"
            style={{ pointerEvents: isMenuOpen ? 'auto' : 'none' }}
            onClick={() => setIsMenuOpen(false)}
          />
        )}

        {/* Mobile menu */}
        <div 
          className={`fixed inset-y-0 right-0 w-64 bg-[#111714] transform transition-transform duration-300 ease-in-out md:hidden z-50 ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto py-4">
              <div className="px-4 space-y-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <button
                      key={link.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors w-full text-left ${
                        isActive ? 'text-[#38e07b] bg-[#1a1f1c]' : 'text-white hover:text-[#38e07b] hover:bg-[#1a1f1c]'
                      }`}
                      onClick={() => {
                        setIsMenuOpen(false);
                        router.push(link.href);
                      }}
                    >
                      {link.icon}
                      {link.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile user section */}
            <div className="border-t border-[#38e07b]/20 p-4">
              {!isLoading && (
                user ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 px-4 py-2">
                      <div className="w-10 h-10 rounded-full bg-[#38e07b] flex items-center justify-center text-black">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-white font-medium">{user.name}</span>
                    </div>
                    <button
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-white hover:text-[#38e07b] hover:bg-[#1a1f1c] transition-colors w-full text-left"
                      onClick={() => {
                        setIsMenuOpen(false);
                        router.push('/profile');
                      }}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile Settings
                    </button>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                        router.push('/');
                      }}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-red-400 hover:text-red-500 hover:bg-[#1a1f1c] transition-colors w-full text-left"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button 
                      onClick={() => {
                        handleAuthClick(true);
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-white hover:text-[#38e07b] hover:bg-[#1a1f1c] transition-colors w-full"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Login
                    </button>
                    <button 
                      onClick={() => {
                        handleAuthClick(false);
                        setIsMenuOpen(false);
                      }}
                      className="w-full bg-[#38e07b] text-black px-4 py-3 rounded-lg text-base font-medium hover:bg-[#2bc665] transition-colors"
                    >
                      Sign Up
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Bottom Navigation Bar - Mobile Only */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#111714] border-t border-[#38e07b]/20 md:hidden z-40">
        <div className="grid grid-cols-5 h-16">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center justify-center gap-1 ${
                  isActive ? 'text-[#38e07b]' : 'text-white'
                }`}
              >
                {link.icon}
                <span className="text-xs font-medium">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Register Modal */}
      {isRegisterModalOpen && (
        <RegisterModal
          isOpen={isRegisterModalOpen}
          onCloseAction={() => setIsRegisterModalOpen(false)}
          onLoginSuccessAction={handleLoginSuccessAction}
          initialMode={isLoginMode}
        />
      )}
    </>
  );
} 