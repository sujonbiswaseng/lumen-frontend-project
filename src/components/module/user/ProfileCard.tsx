'use client';

import { logoutAction } from '@/actions/auth.actions';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IBaseUser } from '@/types/user.types';
import { LogOut, Settings, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
export default function ProfileCard({ profile }: { profile: IBaseUser }) {
  const defaultProfile =
    'https://res.cloudinary.com/drmeagmkl/image/upload/v1766941482/chatgpt_m8tmep.png';
  const [darkMode, setDarkMode] = useState(true);
  const router = useRouter();

  // Responsive hash update, but kept minimal for SaaS shell.
  useEffect(() => {
    const handleHashChange = () =>
      typeof window !== 'undefined' && window.location
        ? window.location.hash
        : '';
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const handleLogout = async () => {
    const toastId = toast.loading('Logging out...');
    const res = await logoutAction();
    if (!res.data || !res.success) {
      toast.dismiss(toastId);
      toast.error('Logout failed');
      return;
    }
    toast.dismiss(toastId);
    toast.success(res.data?.message || 'Logged out successfully');
    router.push('/login');
    router.refresh();
  };

  // Responsive container, spacing, SaaS alignment, color-tokens only!
  return (
    <div
      className="w-full max-w-[1440px] mx-auto flex justify-end items-center px-2  py-2"
      style={{ background: 'var(--background)' }}
    >
      {/* Theme Toggle (ghost btn pattern) */}
      <button
        onClick={() => setDarkMode((d) => !d)}
        aria-label="Toggle dark mode"
        className="flex items-center justify-center rounded-full h-10 w-10 text-xl md:h-10 md:w-10 mr-2
          transition-colors duration-150
          bg-transparent border-none shadow-none focus-visible:outline-none
          text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
        type="button"
      >
        {darkMode ? <span>🌙</span> : <span>☀️</span>}
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="Open user menu"
            className="relative h-10 w-10 md:h-11 md:w-11 rounded-full overflow-hidden border
              shadow-xs bg-[var(--card)] hover:ring-[2px] hover:ring-[var(--ring)]
              border-[var(--border)] focus-visible:outline-none
              transition-all duration-150 ring-offset-1"
          >
            <img
              src={profile.image || defaultProfile}
              alt={profile.name || 'Profile'}
              width={44}
              height={44}
              className="object-cover w-full h-full rounded-full"
              style={{ background: 'var(--input)' }}
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="min-w-[240px] max-w-[90vw] sm:min-w-[325px] rounded-xl border border-[var(--border)]
            bg-[var(--card)] shadow-lg p-0 mt-2"
        >
          {/* User Header */}
          <div className="flex flex-col items-center text-center px-5 pt-5 pb-3 border-b border-[var(--border)] gap-2 bg-[var(--card)]">
            <img
              src={profile.image || defaultProfile}
              alt={profile.name || 'Profile'}
              width={56}
              height={56}
              className="rounded-full w-14 h-14 object-cover border-2 border-[var(--input)]"
              style={{ background: 'var(--input)' }}
            />
            <span className="font-semibold text-[1rem] md:text-[1.06rem] text-[var(--card-foreground)] truncate max-w-[140px]">
              {profile.name}
            </span>
            <span className="text-xs text-[var(--muted-foreground)] truncate max-w-[160px]">
              {profile.email}
            </span>
          </div>

          {/* Menu */}
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link
                href={
                  profile.role === 'USER'
                    ? '/user/dashboard/profile'
                    : profile.role === 'ADMIN'
                    ? '/admin/dashboard/profile'
                    : '/manager/dashboard/profile'
                }
                className="flex items-center gap-2 w-full px-4 py-3 rounded-none transition-colors focus-visible:outline-none
                  text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]
                "
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={
                  profile.role === 'ADMIN'
                    ? '/admin/dashboard/setting'
                    : profile.role === 'USER'
                    ? '/user/dashboard/settings'
                    : '/manager/dashboard/setting'
                }
                className="flex items-center gap-2 w-full px-4 py-3 rounded-none transition-colors focus-visible:outline-none
                  text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]
                "
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator className="my-1 bg-[var(--border)]" />
          <DropdownMenuItem
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-3 rounded-none transition-colors cursor-pointer
              text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)] font-medium
            "
          >
            <LogOut className="w-4 h-4" />
            <span>Log out</span>
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}