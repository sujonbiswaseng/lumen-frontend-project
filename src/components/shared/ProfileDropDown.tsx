'use client'
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
import {
  LogOut,
  Settings,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Button } from '../ui/button';
import { IBaseUser } from '@/types/user.types';
import { logoutAction } from '@/actions/auth.actions';
export default function ProfileCard({ profile }: { profile: IBaseUser }) {
  const defaultProfile = 'https://res.cloudinary.com/drmeagmkl/image/upload/v1766941482/chatgpt_m8tmep.png'


  const router = useRouter()
  const handleLogout = async () => {
    const toastId=toast.loading("user logouting........")
    const res=await logoutAction()
    if(!res.data || !res.success){
      toast.dismiss(toastId)
      toast.error("user logout failed")
      return;
    }
    toast.dismiss(toastId)
    toast.success(res.message || "user logout successfully")
    router.refresh()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative w-8 h-8 rounded-full overflow-hidden border-primary shadow-md">
          <Image
            src={profile.image || defaultProfile}
            alt={profile.name}
            width={100}
            height={100}
            className="object-cover w-full h-full"
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        {/* Account Section */}
        <DropdownMenuLabel>
          My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link className='w-full' href={`${profile.role == 'USER' ? "/profile/user" : profile.role == "ADMIN" ? "/admin/dashboard/profile" : profile.role == 'MANAGER' ? "/manager/dashboard/profile" : "/"}`}>👤 profile</Link>
          </DropdownMenuItem>
          {profile.role === 'USER' ? "" : <DropdownMenuItem><Link className='w-full' href={'/dashboard'}> 📊 Dashboard</Link></DropdownMenuItem>}
          <DropdownMenuItem>
            <Settings />
            <Link href={profile.role==="USER"?"/settings":profile.role=="MANAGER"?"/manager/dashboard/setting":profile.role==="ADMIN"?"/admin/dashboard/setting":"/"}><span>Settings</span></Link>
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        {/* Logout */}
        <DropdownMenuSeparator />
        <Button onClick={handleLogout}>
          <LogOut />
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}