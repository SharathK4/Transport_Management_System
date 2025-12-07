import { Sidebar } from "@/components/sidebar"
import { StatsOverview } from "@/components/dashboard/stats-overview"
import { RecentLoads } from "@/components/dashboard/recent-loads"
import { TopTransporters } from "@/components/dashboard/top-transporters"
import { RecentActivity } from "@/components/dashboard/recent-activity"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="pt-12 md:pt-0">
            <h1 className="text-3xl font-bold text-balance">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome to CargoPro Transport Management System</p>
          </div>

          {/* Stats Cards */}
          <StatsOverview />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <RecentLoads />
            </div>
            <div className="space-y-6">
              <TopTransporters />
            </div>
          </div>

          {/* Activity Feed */}
          <RecentActivity />
        </div>
      </main>
    </div>
  )
}
