"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { StatusBadge } from "@/components/status-badge"
import type { Booking } from "@/lib/types"
import { mockLoads } from "@/lib/mock-data"
import { MapPin, ArrowRight, Calendar, Truck, DollarSign } from "lucide-react"

interface BookingDetailModalProps {
  booking: Booking | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BookingDetailModal({ booking, open, onOpenChange }: BookingDetailModalProps) {
  if (!booking) return null

  const load = mockLoads.find((l) => l.loadId === booking.loadId)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            Booking Details
            <StatusBadge status={booking.status} />
          </DialogTitle>
          <DialogDescription>Booking ID: {booking.bookingId}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {load && (
            <div className="p-4 rounded-lg bg-muted/30 border border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <MapPin className="h-4 w-4" />
                Route
              </div>
              <p className="font-medium flex items-center gap-2">
                {load.loadingCity}
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                {load.unloadingCity}
              </p>
              <p className="text-sm text-muted-foreground mt-1">{load.productType}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted/30 border border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Truck className="h-4 w-4" />
                Transporter
              </div>
              <p className="font-medium">{booking.transporterName}</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Calendar className="h-4 w-4" />
                Booked On
              </div>
              <p className="font-medium">{new Date(booking.bookedAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted/30 border border-border">
              <div className="text-sm text-muted-foreground mb-1">Allocated Trucks</div>
              <p className="text-2xl font-bold">{booking.allocatedTrucks}</p>
            </div>
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
              <div className="flex items-center gap-2 text-sm text-primary mb-1">
                <DollarSign className="h-4 w-4" />
                Final Rate
              </div>
              <p className="text-2xl font-bold text-primary">₹{booking.finalRate.toLocaleString()}</p>
            </div>
          </div>

          {booking.status === "CONFIRMED" && (
            <div className="flex gap-3 pt-4 border-t border-border">
              <Button variant="outline" className="flex-1 bg-transparent">
                Cancel Booking
              </Button>
              <Button className="flex-1">Mark Complete</Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
