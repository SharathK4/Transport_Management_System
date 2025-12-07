"use client"

import type React from "react"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { DataTable } from "@/components/data-table"
import { StatusBadge } from "@/components/status-badge"
import { BidForm } from "@/components/bids/bid-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useBids, useLoads } from "@/lib/hooks/use-data"
import type { Bid, BidStatus } from "@/lib/types"
import { Search, Check, X } from "lucide-react"

export default function BidsPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<BidStatus | "ALL">("ALL")

  const { bids, addBid, acceptBid, rejectBid } = useBids()
  const { loads } = useLoads()

  const filteredBids = bids.filter((bid) => {
    const matchesSearch =
      bid.transporterName?.toLowerCase().includes(search.toLowerCase()) ||
      bid.loadId.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "ALL" || bid.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getLoadRoute = (loadId: string) => {
    const load = loads.find((l) => l.loadId === loadId)
    return load ? `${load.loadingCity} → ${load.unloadingCity}` : loadId
  }

  const handleAcceptBid = (e: React.MouseEvent, bidId: string) => {
    e.stopPropagation()
    acceptBid(bidId)
  }

  const handleRejectBid = (e: React.MouseEvent, bidId: string) => {
    e.stopPropagation()
    rejectBid(bidId)
  }

  const handleSubmitBid = (data: Record<string, unknown>) => {
    addBid({
      loadId: data.loadId as string,
      transporterId: data.transporterId as string,
      proposedRate: Number(data.proposedRate),
      trucksOffered: Number(data.trucksOffered),
    })
  }

  const columns = [
    {
      key: "loadId",
      label: "Load",
      render: (bid: Bid) => <span className="text-sm">{getLoadRoute(bid.loadId)}</span>,
    },
    {
      key: "transporterName",
      label: "Transporter",
    },
    {
      key: "proposedRate",
      label: "Rate",
      render: (bid: Bid) => <span className="font-medium text-primary">₹{bid.proposedRate.toLocaleString()}</span>,
    },
    {
      key: "trucksOffered",
      label: "Trucks",
    },
    {
      key: "score",
      label: "Score",
      render: (bid: Bid) => <span className="font-mono text-sm">{bid.score?.toFixed(2) || "-"}</span>,
    },
    {
      key: "submittedAt",
      label: "Submitted",
      render: (bid: Bid) => new Date(bid.submittedAt).toLocaleDateString(),
    },
    {
      key: "status",
      label: "Status",
      render: (bid: Bid) => <StatusBadge status={bid.status} />,
    },
    {
      key: "actions",
      label: "Actions",
      render: (bid: Bid) =>
        bid.status === "PENDING" ? (
          <div className="flex gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-emerald-400 hover:text-emerald-300"
              onClick={(e) => handleAcceptBid(e, bid.bidId)}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-destructive hover:text-destructive/80"
              onClick={(e) => handleRejectBid(e, bid.bidId)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : null,
    },
  ]

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-12 md:pt-0">
            <div>
              <h1 className="text-3xl font-bold">Bids</h1>
              <p className="text-muted-foreground mt-1">Review and manage transporter bids</p>
            </div>
            <BidForm onSubmit={handleSubmitBid} />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by transporter..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as BidStatus | "ALL")}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="ACCEPTED">Accepted</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Data Table */}
          <DataTable columns={columns} data={filteredBids} emptyMessage="No bids found" />
        </div>
      </main>
    </div>
  )
}
