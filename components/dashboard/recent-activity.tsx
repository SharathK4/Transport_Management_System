"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Gavel, ClipboardCheck, XCircle } from "lucide-react"
import { useLoads, useBids, useBookings } from "@/lib/hooks/use-data"
import { useMemo } from "react"

type ActivityItem = {
  id: string
  type: "load" | "bid" | "booking" | "cancelled"
  message: string
  time: Date
  icon: typeof Package
}

export function RecentActivity() {
  const { loads } = useLoads()
  const { bids } = useBids()
  const { bookings } = useBookings()

  // Generate dynamic activity from real data
  const activities = useMemo(() => {
    const items: ActivityItem[] = []

    // Add load activities
    loads.forEach((load) => {
      if (load.status === "CANCELLED") {
        items.push({
          id: `load-cancel-${load.loadId}`,
          type: "cancelled",
          message: `Load from ${load.loadingCity} to ${load.unloadingCity} was cancelled`,
          time: new Date(load.datePosted),
          icon: XCircle,
        })
      } else {
        items.push({
          id: `load-${load.loadId}`,
          type: "load",
          message: `New load posted from ${load.loadingCity} to ${load.unloadingCity}`,
          time: new Date(load.datePosted),
          icon: Package,
        })
      }
    })

    // Add bid activities
    bids.forEach((bid) => {
      if (bid.status === "ACCEPTED") {
        items.push({
          id: `bid-accept-${bid.bidId}`,
          type: "bid",
          message: `${bid.transporterName} bid accepted`,
          time: new Date(bid.submittedAt),
          icon: Gavel,
        })
      } else {
        items.push({
          id: `bid-${bid.bidId}`,
          type: "bid",
          message: `${bid.transporterName} submitted a bid`,
          time: new Date(bid.submittedAt),
          icon: Gavel,
        })
      }
    })

    // Add booking activities
    bookings.forEach((booking) => {
      items.push({
        id: `booking-${booking.bookingId}`,
        type: "booking",
        message: `Booking confirmed with ${booking.transporterName}`,
        time: new Date(booking.bookedAt),
        icon: ClipboardCheck,
      })
    })

    // Sort by time descending and take first 5
    return items.sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, 5)
  }, [loads, bids, bookings])

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`
    return `${days} day${days > 1 ? "s" : ""} ago`
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
          <div className="space-y-6">
            {activities.map((activity) => (
              <div key={activity.id} className="flex gap-4 relative">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center z-10">
                  <activity.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">{formatTime(activity.time)}</p>
                </div>
              </div>
            ))}
            {activities.length === 0 && <p className="text-center text-muted-foreground py-4 ml-12">No activity yet</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
