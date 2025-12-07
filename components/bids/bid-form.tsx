"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { useLoads, useTransporters } from "@/lib/hooks/use-data"

interface BidFormProps {
  onSubmit?: (data: Record<string, unknown>) => void
}

export function BidForm({ onSubmit }: BidFormProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    loadId: "",
    transporterId: "",
    proposedRate: "",
    trucksOffered: "",
  })

  const { loads } = useLoads()
  const { transporters } = useTransporters()

  const availableLoads = loads.filter((load) => load.status === "POSTED" || load.status === "OPEN_FOR_BIDS")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(formData)
    setOpen(false)
    setFormData({
      loadId: "",
      transporterId: "",
      proposedRate: "",
      trucksOffered: "",
    })
  }

  const selectedLoad = loads.find((l) => l.loadId === formData.loadId)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Submit Bid
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <DialogTitle>Submit New Bid</DialogTitle>
          <DialogDescription>
            Place a bid on an available load. Ensure you have sufficient truck capacity.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="loadId">Select Load</Label>
            <Select value={formData.loadId} onValueChange={(value) => setFormData({ ...formData, loadId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a load" />
              </SelectTrigger>
              <SelectContent>
                {availableLoads.map((load) => (
                  <SelectItem key={load.loadId} value={load.loadId}>
                    {load.loadingCity} → {load.unloadingCity} ({load.productType})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedLoad && (
              <p className="text-xs text-muted-foreground">
                Requires {selectedLoad.noOfTrucks} {selectedLoad.truckType} trucks
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="transporterId">Transporter</Label>
            <Select
              value={formData.transporterId}
              onValueChange={(value) => setFormData({ ...formData, transporterId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select transporter" />
              </SelectTrigger>
              <SelectContent>
                {transporters.map((transporter) => (
                  <SelectItem key={transporter.transporterId} value={transporter.transporterId}>
                    {transporter.companyName} (Rating: {transporter.rating})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="proposedRate">Proposed Rate (₹)</Label>
              <Input
                id="proposedRate"
                type="number"
                min="0"
                value={formData.proposedRate}
                onChange={(e) => setFormData({ ...formData, proposedRate: e.target.value })}
                placeholder="45000"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trucksOffered">Trucks Offered</Label>
              <Input
                id="trucksOffered"
                type="number"
                min="1"
                max={selectedLoad?.noOfTrucks || 10}
                value={formData.trucksOffered}
                onChange={(e) => setFormData({ ...formData, trucksOffered: e.target.value })}
                placeholder="1"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Submit Bid</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
