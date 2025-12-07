"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { DataTable } from "@/components/data-table"
import { StatusBadge } from "@/components/status-badge"
import { LoadForm } from "@/components/loads/load-form"
import { LoadDetailModal } from "@/components/loads/load-detail-modal"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLoads } from "@/lib/hooks/use-data"
import type { Load, LoadStatus } from "@/lib/types"
import { Search, MapPin, ArrowRight } from "lucide-react"

export default function LoadsPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<LoadStatus | "ALL">("ALL")
  const [selectedLoad, setSelectedLoad] = useState<Load | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const { loads, addLoad } = useLoads()

  const filteredLoads = loads.filter((load) => {
    const matchesSearch =
      load.loadingCity.toLowerCase().includes(search.toLowerCase()) ||
      load.unloadingCity.toLowerCase().includes(search.toLowerCase()) ||
      load.productType.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "ALL" || load.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const columns = [
    {
      key: "route",
      label: "Route",
      render: (load: Load) => (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>{load.loadingCity}</span>
          <ArrowRight className="h-3 w-3 text-muted-foreground" />
          <span>{load.unloadingCity}</span>
        </div>
      ),
    },
    {
      key: "productType",
      label: "Product",
    },
    {
      key: "weight",
      label: "Weight",
      render: (load: Load) => `${load.weight} ${load.weightUnit}`,
    },
    {
      key: "truckType",
      label: "Truck Type",
    },
    {
      key: "noOfTrucks",
      label: "Trucks",
      render: (load: Load) => (
        <span>
          {load.noOfTrucks}
          {load.remainingTrucks !== undefined && load.remainingTrucks < load.noOfTrucks && (
            <span className="text-muted-foreground text-xs ml-1">({load.remainingTrucks} left)</span>
          )}
        </span>
      ),
    },
    {
      key: "loadingDate",
      label: "Loading Date",
      render: (load: Load) => new Date(load.loadingDate).toLocaleDateString(),
    },
    {
      key: "status",
      label: "Status",
      render: (load: Load) => <StatusBadge status={load.status} />,
    },
  ]

  const handleRowClick = (load: Load) => {
    setSelectedLoad(load)
    setModalOpen(true)
  }

  const handleCreateLoad = (data: Record<string, unknown>) => {
    addLoad({
      shipperId: "shipper-001",
      loadingCity: data.loadingCity as string,
      unloadingCity: data.unloadingCity as string,
      loadingDate: new Date(data.loadingDate as string).toISOString(),
      productType: data.productType as string,
      weight: Number(data.weight),
      weightUnit: data.weightUnit as string,
      truckType: data.truckType as string,
      noOfTrucks: Number(data.noOfTrucks),
    })
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-12 md:pt-0">
            <div>
              <h1 className="text-3xl font-bold">Loads</h1>
              <p className="text-muted-foreground mt-1">Manage and track all shipment loads</p>
            </div>
            <LoadForm onSubmit={handleCreateLoad} />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by city or product..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as LoadStatus | "ALL")}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="POSTED">Posted</SelectItem>
                <SelectItem value="OPEN_FOR_BIDS">Open for Bids</SelectItem>
                <SelectItem value="BOOKED">Booked</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Data Table */}
          <DataTable columns={columns} data={filteredLoads} onRowClick={handleRowClick} emptyMessage="No loads found" />

          {/* Load Detail Modal - pass callback to refresh selected load */}
          <LoadDetailModal
            load={selectedLoad}
            open={modalOpen}
            onOpenChange={setModalOpen}
            onUpdate={() => {
              // Refresh selected load from current data
              if (selectedLoad) {
                const updated = loads.find((l) => l.loadId === selectedLoad.loadId)
                if (updated) setSelectedLoad(updated)
              }
            }}
          />
        </div>
      </main>
    </div>
  )
}
