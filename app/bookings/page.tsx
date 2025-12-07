"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { DataTable } from "@/components/data-table"
import { StatusBadge } from "@/components/status-badge"
import { BookingDetailModal } from "@/components/bookings/booking-detail-modal"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useBookings, useLoads } from "@/lib/hooks/use-data"
import type { Booking, BookingStatus } from "@/lib/types"
import { Search } from "lucide-react"

export default function BookingsPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "ALL">("ALL")
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const { bookings } = useBookings()
  const { loads } = useLoads()

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.transporterName?.toLowerCase().includes(search.toLowerCase()) ||
      booking.bookingId.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "ALL" || booking.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getLoadRoute = (loadId: string) => {
    const load = loads.find((l) => l.loadId === loadId)
    return load ? `${load.loadingCity} → ${load.unloadingCity}` : loadId
  }

  const columns = [
    {
      key: "bookingId",
      label: "Booking ID",
      render: (booking: Booking) => <span className="font-mono text-sm">{booking.bookingId}</span>,
    },
    {
      key: "loadId",
      label: "Route",
      render: (booking: Booking) => getLoadRoute(booking.loadId),
    },
    {
      key: "transporterName",
      label: "Transporter",
    },
    {
      key: "allocatedTrucks",
      label: "Trucks",
    },
    {
      key: "finalRate",
      label: "Final Rate",
      render: (booking: Booking) => (
        <span className="font-medium text-primary">₹{booking.finalRate.toLocaleString()}</span>
      ),
    },
    {
      key: "bookedAt",
      label: "Booked On",
      render: (booking: Booking) => new Date(booking.bookedAt).toLocaleDateString(),
    },
    {
      key: "status",
      label: "Status",
      render: (booking: Booking) => <StatusBadge status={booking.status} />,
    },
  ]

  const handleRowClick = (booking: Booking) => {
    setSelectedBooking(booking)
    setModalOpen(true)
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="pt-12 md:pt-0">
            <h1 className="text-3xl font-bold">Bookings</h1>
            <p className="text-muted-foreground mt-1">Track confirmed shipment bookings</p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search bookings..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as BookingStatus | "ALL")}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Data Table */}
          <DataTable
            columns={columns}
            data={filteredBookings}
            onRowClick={handleRowClick}
            emptyMessage="No bookings found"
          />

          {/* Booking Detail Modal */}
          <BookingDetailModal booking={selectedBooking} open={modalOpen} onOpenChange={setModalOpen} />
        </div>
      </main>
    </div>
  )
}
