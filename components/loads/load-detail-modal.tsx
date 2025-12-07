"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { StatusBadge } from "@/components/status-badge"
import type { Load } from "@/lib/types"
import { useBids, useLoads } from "@/lib/hooks/use-data"
import { MapPin, ArrowRight, Calendar, Package, Truck, Star } from "lucide-react"

interface LoadDetailModalProps {
  load: Load | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate?: () => void
}

export function LoadDetailModal({ load, open, onOpenChange, onUpdate }: LoadDetailModalProps) {
  const { bids, acceptBid } = useBids()
  const { updateLoadStatus, loads } = useLoads()

  if (!load) return null

  // Get fresh load data from store
  const currentLoad = loads.find((l) => l.loadId === load.loadId) || load

  const loadBids = bids.filter((bid) => bid.loadId === currentLoad.loadId)
  const sortedBids = [...loadBids].sort((a, b) => (b.score || 0) - (a.score || 0))
  const bestPendingBid = sortedBids.find((b) => b.status === "PENDING")

  const handleAcceptBestBid = () => {
    if (bestPendingBid) {
      acceptBid(bestPendingBid.bidId)
      onUpdate?.()
    }
  }

  const handleCancelLoad = () => {
    updateLoadStatus(currentLoad.loadId, "CANCELLED")
    onUpdate?.()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              {currentLoad.loadingCity}
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              {currentLoad.unloadingCity}
            </div>
            <StatusBadge status={currentLoad.status} />
          </DialogTitle>
          <DialogDescription>Load ID: {currentLoad.loadId}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Load Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/30 border border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Package className="h-4 w-4" />
                  Product
                </div>
                <p className="font-medium">{currentLoad.productType}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/30 border border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Calendar className="h-4 w-4" />
                  Loading Date
                </div>
                <p className="font-medium">
                  {new Date(currentLoad.loadingDate).toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/30 border border-border">
                <div className="text-sm text-muted-foreground mb-1">Weight</div>
                <p className="font-medium">
                  {currentLoad.weight} {currentLoad.weightUnit}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/30 border border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Truck className="h-4 w-4" />
                  Trucks Required
                </div>
                <p className="font-medium">
                  {currentLoad.noOfTrucks} {currentLoad.truckType}
                  {currentLoad.remainingTrucks !== undefined && currentLoad.remainingTrucks > 0 && (
                    <span className="text-sm text-muted-foreground ml-2">
                      ({currentLoad.remainingTrucks} remaining)
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Bids Section */}
          {sortedBids.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Star className="h-4 w-4 text-primary" />
                Best Bids (Score Ranked)
              </h3>
              <div className="space-y-3">
                {sortedBids.map((bid, index) => (
                  <div
                    key={bid.bidId}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{bid.transporterName}</p>
                        <p className="text-sm text-muted-foreground">
                          {bid.trucksOffered} trucks • Score: {bid.score?.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">₹{bid.proposedRate.toLocaleString()}</p>
                      <StatusBadge status={bid.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions - only show if load is open for bids and has pending bids */}
          {currentLoad.status === "OPEN_FOR_BIDS" && bestPendingBid && (
            <div className="flex gap-3 pt-4 border-t border-border">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={handleCancelLoad}>
                Cancel Load
              </Button>
              <Button className="flex-1" onClick={handleAcceptBestBid}>
                Accept Best Bid
              </Button>
            </div>
          )}

          {/* Show cancel only if no pending bids but load is still active */}
          {(currentLoad.status === "POSTED" || (currentLoad.status === "OPEN_FOR_BIDS" && !bestPendingBid)) && (
            <div className="flex gap-3 pt-4 border-t border-border">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={handleCancelLoad}>
                Cancel Load
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
