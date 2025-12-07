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
import { Plus, X } from "lucide-react"

const truckTypes = ["Container", "Open Body", "Flatbed", "Refrigerated", "Closed Body", "Tanker"]

interface TruckEntry {
  truckType: string
  count: string
}

interface TransporterFormProps {
  onSubmit?: (data: Record<string, unknown>) => void
}

export function TransporterForm({ onSubmit }: TransporterFormProps) {
  const [open, setOpen] = useState(false)
  const [companyName, setCompanyName] = useState("")
  const [trucks, setTrucks] = useState<TruckEntry[]>([{ truckType: "", count: "" }])

  const handleAddTruck = () => {
    setTrucks([...trucks, { truckType: "", count: "" }])
  }

  const handleRemoveTruck = (index: number) => {
    setTrucks(trucks.filter((_, i) => i !== index))
  }

  const handleTruckChange = (index: number, field: keyof TruckEntry, value: string) => {
    const updated = [...trucks]
    updated[index][field] = value
    setTrucks(updated)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.({
      companyName,
      availableTrucks: trucks.filter((t) => t.truckType && t.count),
    })
    setOpen(false)
    setCompanyName("")
    setTrucks([{ truckType: "", count: "" }])
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Register Transporter
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <DialogTitle>Register New Transporter</DialogTitle>
          <DialogDescription>Add a new transport company with their available truck fleet.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g., FastTrack Logistics"
              required
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Available Trucks</Label>
              <Button type="button" variant="outline" size="sm" onClick={handleAddTruck}>
                <Plus className="h-3 w-3 mr-1" />
                Add Type
              </Button>
            </div>
            {trucks.map((truck, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Select value={truck.truckType} onValueChange={(value) => handleTruckChange(index, "truckType", value)}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Truck type" />
                  </SelectTrigger>
                  <SelectContent>
                    {truckTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  min="1"
                  value={truck.count}
                  onChange={(e) => handleTruckChange(index, "count", e.target.value)}
                  placeholder="Count"
                  className="w-24"
                />
                {trucks.length > 1 && (
                  <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveTruck(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Register</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
