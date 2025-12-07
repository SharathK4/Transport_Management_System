// Core entity types for TMS
export type LoadStatus = "POSTED" | "OPEN_FOR_BIDS" | "BOOKED" | "CANCELLED"
export type BidStatus = "PENDING" | "ACCEPTED" | "REJECTED"
export type BookingStatus = "CONFIRMED" | "COMPLETED" | "CANCELLED"
export type WeightUnit = "KG" | "TON"

export interface Load {
  loadId: string
  shipperId: string
  loadingCity: string
  unloadingCity: string
  loadingDate: string
  productType: string
  weight: number
  weightUnit: WeightUnit
  truckType: string
  noOfTrucks: number
  status: LoadStatus
  datePosted: string
  remainingTrucks?: number
}

export interface TruckCapacity {
  truckType: string
  count: number
}

export interface Transporter {
  transporterId: string
  companyName: string
  rating: number
  availableTrucks: TruckCapacity[]
}

export interface Bid {
  bidId: string
  loadId: string
  transporterId: string
  transporterName?: string
  proposedRate: number
  trucksOffered: number
  status: BidStatus
  submittedAt: string
  score?: number
}

export interface Booking {
  bookingId: string
  loadId: string
  bidId: string
  transporterId: string
  transporterName?: string
  allocatedTrucks: number
  finalRate: number
  status: BookingStatus
  bookedAt: string
}
