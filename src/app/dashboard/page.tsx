import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { ProjectsOverview } from "@/components/projects-overview"
import { RecentActivity } from "@/components/recent-activity"
import { AutomationStats } from "@/components/automation-stats"
import { ConnectedRepos } from "@/components/connected-repos"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function Page() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-6 p-4 md:p-6">
            
            {/* Stats Overview */}
            <AutomationStats />
            
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Connected Repositories - Takes 2 columns */}
              <div className="lg:col-span-2">
            <ProjectsOverview />
              </div>
              
              {/* Recent Activity - Takes 1 column */}
              <div className="lg:col-span-1">
                <RecentActivity />
              </div>
            </div>

            {/* Projects Overview */}
            <ConnectedRepos />
            
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
