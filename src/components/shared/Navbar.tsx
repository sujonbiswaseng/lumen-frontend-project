'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { IBaseUser } from '@/types/user.types';
import { navItems } from '@/routes/navitems';
import { getIconComponent } from '@/lib/iconMapper';
import { logoutAction } from "@/actions/auth.actions";
import { toast } from "react-toastify";
import { NavbarNotifications } from '../module/notification/Notification';
import Image from 'next/image';
import ProfileCard from './ProfileDropDown';

interface NavbarProps { user: IBaseUser | null }

export default function Navbar({ user }: NavbarProps) {
  const [hash, setHash] = useState(() =>
    typeof window !== "undefined" ? window.location.hash : ""
  );
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const toastId = toast.loading("Logging out...");
    try {
      const res = await logoutAction();
      router.refresh()
      if (res?.success) {
        toast.update(toastId, {
          render: res.message || "Logged out!",
          type: "success",
          isLoading: false,
          autoClose: 1500,
        });
        router.push("/login");
        router.refresh(); // better than reload
      } else {
        toast.update(toastId, {
          render: res?.message || "Logout failed",
          type: "error",
          isLoading: false,
          autoClose: 1500,
        });
      }
    } catch (err: any) {
      toast.update(toastId, {
        render: err?.message || "Logout error",
        type: "error",
        isLoading: false,
        autoClose: 1500,
      });
    }
  };

  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    const handleHashChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", handleHashChange);

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <nav className="fixed max-w-[1480px] mx-auto top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-border">
      <div className="w-full mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group" aria-label="Lumen Home">
          <div className="flex items-center h-10 w-10 relative">
            <div className="relative bg-white rounded-xl shadow-md border border-gray-200 dark:border-gray-700 flex items-center justify-center w-10 h-10 overflow-hidden p-1">
              <Image
                src="/logo.png"
                alt="Lumen logo"
                fill
                sizes="40px"
                className="object-cover rounded-full"
                priority
              />
        
            </div>
      
      
      
      
          </div>
          <span className="hidden sm:inline font-bold text-lg text-primary group-hover:text-primary/80 transition-colors duration-200">
            Lumen
          </span>
        </Link>
  

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-2">
          {navItems.map(item => {
            if (item.authRequired && !user) return null;
            if (item.roles && (!user || !item.roles.includes(user.role))) return null;

            const Icon = item.icon ? getIconComponent(item.icon) : null;

            return (
              <Link
                key={item.to}
                href={item.to}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.to)
                    ? "bg-primary/15 text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-3">
             {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="text-lg text-muted-foreground hover:text-primary transition"
        >
          {darkMode ? "🌙" : "☀️"}
        </button>
          {user ? (

            <div className='flex items-center  gap-4 space-x-2'>
                 <div className='mt-2'>
                 <NavbarNotifications  />
                 </div>
            <ProfileCard profile={user}/>
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="rounded-lg">
                  Log in
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="rounded-lg">
                  Sign up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-muted transition"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-6 py-4 flex flex-col gap-2 animate-in fade-in slide-in-from-top-2">
          
          {navItems.map(item => {
            if (item.authRequired && !user) return null;
            if (item.roles && (!user || !item.roles.includes(user.role))) return null;

            const Icon = item.icon ? getIconComponent(item.icon) : null;

            return (
              <Link
                key={item.to}
                href={item.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive(item.to)
                    ? "bg-primary/15 text-primary font-semibold"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {item.label}
              </Link>
            );
          })}

          {/* Auth */}
          <div className="mt-3 pt-3 border-t border-border flex flex-col gap-2">
            {user ? (
              <Button onClick={handleLogout} variant="outline" className="w-full">
                Log out
              </Button>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" className="w-full">Log in</Button>
                </Link>
                <Link href="/register">
                  <Button className="w-full">Sign up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}