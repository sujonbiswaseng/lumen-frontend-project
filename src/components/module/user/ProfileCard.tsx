'use client'
import { logoutAction } from '@/actions/auth.actions';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IBaseUser } from '@/types/user.types';
import { LogOut, Settings, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

/**
 * Improved and responsive ProfileCard dropdown for user menu.
 * Clean, accessible, and mobile-friendly.
 */
export default function ProfileCard({ profile }: { profile: IBaseUser }) {
  const defaultProfile =
    'https://res.cloudinary.com/drmeagmkl/image/upload/v1766941482/chatgpt_m8tmep.png';

  const router = useRouter();
  console.log(profile,'profile')

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
    router.push("/login")
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Open user menu"
          className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-primary bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
        >
          <img
            src={profile.image || defaultProfile}
            alt={profile.name || 'Profile'}
            width={36}
            height={36}
            className="object-cover w-full h-full"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end"
        className="w-60 p-0 shadow-lg ring-1 ring-black ring-opacity-5 rounded-lg bg-white dark:bg-gray-900"
      >
        <div className="flex flex-col items-center px-4 py-3 border-b">
          <img
            src={profile.image || defaultProfile}
            alt={profile.name || 'Profile'}
            width={48}
            height={48}
            className="rounded-full object-cover w-12 h-12 border"
          />
          <span className="mt-2 font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[130px]">
            {profile.name}
          </span>
          <span className="text-xs text-gray-400 truncate max-w-[130px]">
            {profile.email}
          </span>
        </div>
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link
              href={profile.role === 'USER' ? '/user/dashboard/profile' :profile.role==="ADMIN"? '/admin/dashboard/profile':"/manager/dashboard/profile"}
              className="flex items-center w-full gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition"
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href={profile.role=="ADMIN"?"/admin/dashboard/setting":profile.role==="USER"?"/user/dashboard/settings":"/manager/dashboard/setting"}
              className="flex items-center w-full gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-600 dark:text-red-400 px-3 py-2 hover:bg-red-50 dark:hover:bg-red-900 rounded transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Log out</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}