"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTransporters } from "@/lib/hooks/use-data"
import { Star, Truck } from "lucide-react"
import Link from "next/link"

export function TopTransporters() {
  const { transporters } = useTransporters()
  const sortedTransporters = [...transporters].sort((a, b) => b.rating - a.rating)

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Top Transporters</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/transporters">View all</Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedTransporters.map((transporter, index) => (
          <div
            key={transporter.transporterId}
            className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border"
          >
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                {index + 1}
              </div>
              <div>
                <p className="font-medium">{transporter.companyName}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Truck className="h-3 w-3" />
                  {transporter.availableTrucks.reduce((sum, t) => sum + t.count, 0)} trucks available
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-primary">
              <Star className="h-4 w-4 fill-current" />
              <span className="font-semibold">{transporter.rating}</span>
            </div>
          </div>
        ))}
        {sortedTransporters.length === 0 && (
          <p className="text-center text-muted-foreground py-4">No transporters yet</p>
        )}
      </CardContent>
    </Card>
  )
}
