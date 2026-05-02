import { getSessionAction } from '@/actions/auth.actions'
import { AppSidebar } from '@/components/app-sidebar'
import ErrorBoundary from '@/components/ErrorBoundary'
import ErrorFallback from '@/components/ErrorFallback'
import { NavbarNotifications } from '@/components/module/notification/Notification'
import ProfileCard from '@/components/module/user/ProfileCard'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { IBaseUser } from '@/types/user.types'
import React from 'react'

const RootDashboardLayout = async ({
  admin,
  user,
  manager,
  children,
}: {
  admin: React.ReactNode
  user: React.ReactNode
  manager: React.ReactNode
  children: React.ReactNode
}) => {
  const userinfo = await getSessionAction();

  // AUTH GUARD
  if (!userinfo || !userinfo.data || !userinfo.success) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-muted px-4">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card px-8 py-6 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold text-primary">Authentication error</h2>
          <p className="text-sm text-muted-foreground">You must be signed in to view the dashboard.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-svh w-full bg-background">
      <div className="max-w-[1440px] mx-auto min-h-svh flex flex-col">
        <SidebarProvider
          className="flex flex-1"
          style={
            {
              '--sidebar-width': '16rem',
              '--sidebar-width-mobile': '18rem',
              '--dashboard-shell-max': '1440px',
            } as React.CSSProperties
          }
        >
          {/* Sidebar: responsive and sticky */}
          <AppSidebar />

          {/* Main Area */}
          <SidebarInset className="flex flex-1 flex-col min-w-0 bg-background border-l border-border">
            {/* HEADER */}
            <header className="sticky top-0 z-40 w-full border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/85">
              <div className="flex h-16 items-center px-4 sm:px-6 lg:px-10 gap-3">
                <SidebarTrigger className="-ml-1 shrink-0" />
                {/* Search - Responsive and Modern */}
                <div className="flex-1 flex justify-center">
                  <div className="relative w-full max-w-md">
                    <input
                      type="search"
                      aria-label="Dashboard search"
                      placeholder="Search dashboard…"
                      className="
                        h-11 w-full rounded-xl border border-input bg-muted/70 pl-10 pr-4 text-base text-foreground
                        outline-none transition placeholder:text-muted-foreground
                        focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30
                        dark:bg-muted/30
                      "
                    />
                    <svg
                      className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
                      />
                    </svg>
                  </div>
                </div>
                {/* Actions */}
                <div className="flex items-center ">
                  <NavbarNotifications />
                  <ProfileCard profile={userinfo.data as IBaseUser} />
                </div>
              </div>
            </header>

            {/* Content */}
            <main className="flex-1 flex flex-col min-h-0 overflow-auto">
              <section className="flex flex-1 w-full flex-col items-stretch px-4 py-5 sm:px-6 lg:px-10">
                <ErrorBoundary
                  fallback={
                    <ErrorFallback
                      title="Dashboard load failed"
                      message="Something went wrong while loading the dashboard."
                    />
                  }
                >
                  {userinfo.data?.role === 'ADMIN'
                    ? admin
                    : userinfo.data.role === 'MANAGER'
                    ? manager
                    : user}
                </ErrorBoundary>
              </section>
            </main>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </div>
  );
}

export default RootDashboardLayout
