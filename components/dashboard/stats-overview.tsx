"use client"

import { StatCard } from "@/components/stat-card"
import { Package, Truck, Gavel, ClipboardCheck } from "lucide-react"
import { useLoads, useTransporters, useBids, useBookings } from "@/lib/hooks/use-data"

export function StatsOverview() {
  const { loads } = useLoads()
  const { transporters } = useTransporters()
  const { bids } = useBids()
  const { bookings } = useBookings()

  const activeLoads = loads.filter((l) => l.status !== "CANCELLED" && l.status !== "BOOKED").length
  const pendingBids = bids.filter((b) => b.status === "PENDING").length
  const confirmedBookings = bookings.filter((b) => b.status === "CONFIRMED").length

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Active Loads"
        value={activeLoads}
        subtitle="Awaiting bids"
        icon={Package}
        trend={{ value: 12, positive: true }}
      />
      <StatCard
        title="Transporters"
        value={transporters.length}
        subtitle="Registered"
        icon={Truck}
        trend={{ value: 8, positive: true }}
      />
      <StatCard title="Pending Bids" value={pendingBids} subtitle="Requires action" icon={Gavel} />
      <StatCard
        title="Active Bookings"
        value={confirmedBookings}
        subtitle="In progress"
        icon={ClipboardCheck}
        trend={{ value: 15, positive: true }}
      />
    </div>
  )
}
