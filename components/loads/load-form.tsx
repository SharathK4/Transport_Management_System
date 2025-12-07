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

const truckTypes = ["Container", "Open Body", "Flatbed", "Refrigerated", "Closed Body", "Tanker"]
const weightUnits = ["KG", "TON"]

interface LoadFormProps {
  onSubmit?: (data: Record<string, unknown>) => void
}

export function LoadForm({ onSubmit }: LoadFormProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    loadingCity: "",
    unloadingCity: "",
    loadingDate: "",
    productType: "",
    weight: "",
    weightUnit: "KG",
    truckType: "",
    noOfTrucks: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(formData)
    setOpen(false)
    setFormData({
      loadingCity: "",
      unloadingCity: "",
      loadingDate: "",
      productType: "",
      weight: "",
      weightUnit: "KG",
      truckType: "",
      noOfTrucks: "",
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Load
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <DialogTitle>Create New Load</DialogTitle>
          <DialogDescription>Post a new shipment load for transporters to bid on.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="loadingCity">Loading City</Label>
              <Input
                id="loadingCity"
                value={formData.loadingCity}
                onChange={(e) => setFormData({ ...formData, loadingCity: e.target.value })}
                placeholder="e.g., Mumbai"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unloadingCity">Unloading City</Label>
              <Input
                id="unloadingCity"
                value={formData.unloadingCity}
                onChange={(e) => setFormData({ ...formData, unloadingCity: e.target.value })}
                placeholder="e.g., Delhi"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="loadingDate">Loading Date</Label>
              <Input
                id="loadingDate"
                type="datetime-local"
                value={formData.loadingDate}
                onChange={(e) => setFormData({ ...formData, loadingDate: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="productType">Product Type</Label>
              <Input
                id="productType"
                value={formData.productType}
                onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                placeholder="e.g., Electronics"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Weight</Label>
              <div className="flex gap-2">
                <Input
                  id="weight"
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  placeholder="0"
                  required
                  className="flex-1"
                />
                <Select
                  value={formData.weightUnit}
                  onValueChange={(value) => setFormData({ ...formData, weightUnit: value })}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {weightUnits.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="noOfTrucks">No. of Trucks</Label>
              <Input
                id="noOfTrucks"
                type="number"
                min="1"
                value={formData.noOfTrucks}
                onChange={(e) => setFormData({ ...formData, noOfTrucks: e.target.value })}
                placeholder="1"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="truckType">Truck Type</Label>
            <Select
              value={formData.truckType}
              onValueChange={(value) => setFormData({ ...formData, truckType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select truck type" />
              </SelectTrigger>
              <SelectContent>
                {truckTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Load</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
