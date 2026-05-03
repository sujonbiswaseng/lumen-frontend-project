import { getSessionAction } from "@/actions/auth.actions"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { getDefaultDashboardRoute, UserRole } from "@/lib/authUtils"
import { getNavItemsByRole } from "@/routes/sidebar.navitems"
import DashboardSidebarContent from "./dashbaord/DashboardSidebarContent"
import { IBaseUser } from "@/types/user.types"
import { NavSection } from "@/types/dashboard.types"

export async function AppSidebar() {
  const userInfo = await getSessionAction()

  const navItems = getNavItemsByRole(userInfo.data?.role as UserRole)
  const dashboardHome = getDefaultDashboardRoute(userInfo.data?.role as UserRole)

  return (
    <Sidebar userinfo={userInfo.data as IBaseUser}>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <DashboardSidebarContent
            userInfo={userInfo.data}
            navItems={navItems as NavSection[]}
            dashboardHome={dashboardHome}
          />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}