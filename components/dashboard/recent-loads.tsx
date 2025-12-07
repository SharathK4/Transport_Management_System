"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/status-badge"
import { useLoads } from "@/lib/hooks/use-data"
import { MapPin, ArrowRight, Package } from "lucide-react"
import Link from "next/link"

export function RecentLoads() {
  const { loads } = useLoads()
  const recentLoads = loads.slice(0, 4)

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Recent Loads</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/loads">View all</Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentLoads.map((load) => (
          <div
            key={load.loadId}
            className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  {load.loadingCity}
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  {load.unloadingCity}
                </div>
                <p className="text-xs text-muted-foreground">
                  {load.productType} • {load.weight} {load.weightUnit}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium">{load.noOfTrucks} trucks</p>
                <p className="text-xs text-muted-foreground">{load.truckType}</p>
              </div>
              <StatusBadge status={load.status} />
            </div>
          </div>
        ))}
        {recentLoads.length === 0 && <p className="text-center text-muted-foreground py-4">No loads yet</p>}
      </CardContent>
    </Card>
  )
}
