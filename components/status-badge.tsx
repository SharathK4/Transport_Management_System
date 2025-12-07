import { cn } from "@/lib/utils"
import type { LoadStatus, BidStatus, BookingStatus } from "@/lib/types"

interface StatusBadgeProps {
  status: LoadStatus | BidStatus | BookingStatus
  className?: string
}

const statusStyles: Record<string, string> = {
  POSTED: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  OPEN_FOR_BIDS: "bg-primary/20 text-primary border-primary/30",
  BOOKED: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  CANCELLED: "bg-destructive/20 text-destructive border-destructive/30",
  PENDING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  ACCEPTED: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  REJECTED: "bg-destructive/20 text-destructive border-destructive/30",
  CONFIRMED: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  COMPLETED: "bg-blue-500/20 text-blue-400 border-blue-500/30",
}

const statusLabels: Record<string, string> = {
  POSTED: "Posted",
  OPEN_FOR_BIDS: "Open for Bids",
  BOOKED: "Booked",
  CANCELLED: "Cancelled",
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  CONFIRMED: "Confirmed",
  COMPLETED: "Completed",
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        statusStyles[status],
        className,
      )}
    >
      {statusLabels[status]}
    </span>
  )
}
