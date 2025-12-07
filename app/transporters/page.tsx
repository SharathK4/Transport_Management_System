"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { TransporterForm } from "@/components/transporters/transporter-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useTransporters } from "@/lib/hooks/use-data"
import type { Transporter } from "@/lib/types"
import { Search, Star, Truck, Edit } from "lucide-react"

export default function TransportersPage() {
  const [search, setSearch] = useState("")
  const { transporters, addTransporter } = useTransporters()

  const filteredTransporters = transporters.filter((t) => t.companyName.toLowerCase().includes(search.toLowerCase()))

  const handleAddTransporter = (data: Record<string, unknown>) => {
    const trucks = (data.availableTrucks as Array<{ truckType: string; count: string }>).map((t) => ({
      truckType: t.truckType,
      count: Number(t.count),
    }))
    addTransporter({
      companyName: data.companyName as string,
      rating: 4.0, // Default rating for new transporters
      availableTrucks: trucks,
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
              <h1 className="text-3xl font-bold">Transporters</h1>
              <p className="text-muted-foreground mt-1">Manage registered transport companies</p>
            </div>
            <TransporterForm onSubmit={handleAddTransporter} />
          </div>

          {/* Search */}
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transporters..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Transporter Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTransporters.map((transporter) => (
              <TransporterCard key={transporter.transporterId} transporter={transporter} />
            ))}
          </div>

          {filteredTransporters.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">No transporters found</div>
          )}
        </div>
      </main>
    </div>
  )
}

function TransporterCard({ transporter }: { transporter: Transporter }) {
  const totalTrucks = transporter.availableTrucks.reduce((sum, t) => sum + t.count, 0)

  return (
    <Card className="bg-card border-border hover:border-primary/50 transition-colors">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle className="text-lg">{transporter.companyName}</CardTitle>
          <div className="flex items-center gap-1 mt-1 text-primary">
            <Star className="h-4 w-4 fill-current" />
            <span className="font-semibold">{transporter.rating}</span>
            <span className="text-muted-foreground text-sm">/ 5.0</span>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <Edit className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Truck className="h-4 w-4" />
          <span>{totalTrucks} trucks available</span>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">Fleet Breakdown</p>
          <div className="space-y-1">
            {transporter.availableTrucks.map((truck) => (
              <div key={truck.truckType} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{truck.truckType}</span>
                <span className="font-medium">{truck.count}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
