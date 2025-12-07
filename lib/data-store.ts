import type { Load, Transporter, Bid, Booking } from "./types"

// Initial data
const initialLoads: Load[] = [
  {
    loadId: "load-001",
    shipperId: "shipper-001",
    loadingCity: "Mumbai",
    unloadingCity: "Delhi",
    loadingDate: "2025-01-15T08:00:00Z",
    productType: "Electronics",
    weight: 15000,
    weightUnit: "KG",
    truckType: "Container",
    noOfTrucks: 3,
    status: "OPEN_FOR_BIDS",
    datePosted: "2025-01-10T10:00:00Z",
    remainingTrucks: 2,
  },
  {
    loadId: "load-002",
    shipperId: "shipper-002",
    loadingCity: "Bangalore",
    unloadingCity: "Chennai",
    loadingDate: "2025-01-18T06:00:00Z",
    productType: "Textiles",
    weight: 8,
    weightUnit: "TON",
    truckType: "Open Body",
    noOfTrucks: 2,
    status: "POSTED",
    datePosted: "2025-01-11T14:00:00Z",
    remainingTrucks: 2,
  },
  {
    loadId: "load-003",
    shipperId: "shipper-001",
    loadingCity: "Hyderabad",
    unloadingCity: "Kolkata",
    loadingDate: "2025-01-20T09:00:00Z",
    productType: "Machinery",
    weight: 25,
    weightUnit: "TON",
    truckType: "Flatbed",
    noOfTrucks: 4,
    status: "BOOKED",
    datePosted: "2025-01-09T11:00:00Z",
    remainingTrucks: 0,
  },
  {
    loadId: "load-004",
    shipperId: "shipper-003",
    loadingCity: "Pune",
    unloadingCity: "Ahmedabad",
    loadingDate: "2025-01-22T07:00:00Z",
    productType: "FMCG",
    weight: 12000,
    weightUnit: "KG",
    truckType: "Refrigerated",
    noOfTrucks: 2,
    status: "OPEN_FOR_BIDS",
    datePosted: "2025-01-12T09:00:00Z",
    remainingTrucks: 1,
  },
  {
    loadId: "load-005",
    shipperId: "shipper-002",
    loadingCity: "Jaipur",
    unloadingCity: "Lucknow",
    loadingDate: "2025-01-25T10:00:00Z",
    productType: "Furniture",
    weight: 18,
    weightUnit: "TON",
    truckType: "Closed Body",
    noOfTrucks: 3,
    status: "CANCELLED",
    datePosted: "2025-01-08T16:00:00Z",
    remainingTrucks: 3,
  },
]

const initialTransporters: Transporter[] = [
  {
    transporterId: "trans-001",
    companyName: "FastTrack Logistics",
    rating: 4.8,
    availableTrucks: [
      { truckType: "Container", count: 15 },
      { truckType: "Open Body", count: 10 },
      { truckType: "Flatbed", count: 8 },
    ],
  },
  {
    transporterId: "trans-002",
    companyName: "SafeMove Transport",
    rating: 4.5,
    availableTrucks: [
      { truckType: "Refrigerated", count: 12 },
      { truckType: "Closed Body", count: 20 },
    ],
  },
  {
    transporterId: "trans-003",
    companyName: "Express Carriers",
    rating: 4.2,
    availableTrucks: [
      { truckType: "Container", count: 8 },
      { truckType: "Flatbed", count: 15 },
      { truckType: "Open Body", count: 12 },
    ],
  },
  {
    transporterId: "trans-004",
    companyName: "Prime Freight",
    rating: 4.9,
    availableTrucks: [
      { truckType: "Refrigerated", count: 6 },
      { truckType: "Container", count: 10 },
      { truckType: "Closed Body", count: 14 },
    ],
  },
]

const initialBids: Bid[] = [
  {
    bidId: "bid-001",
    loadId: "load-001",
    transporterId: "trans-001",
    transporterName: "FastTrack Logistics",
    proposedRate: 45000,
    trucksOffered: 2,
    status: "PENDING",
    submittedAt: "2025-01-10T12:00:00Z",
    score: 0.85,
  },
  {
    bidId: "bid-002",
    loadId: "load-001",
    transporterId: "trans-003",
    transporterName: "Express Carriers",
    proposedRate: 42000,
    trucksOffered: 3,
    status: "ACCEPTED",
    submittedAt: "2025-01-10T14:00:00Z",
    score: 0.91,
  },
  {
    bidId: "bid-003",
    loadId: "load-004",
    transporterId: "trans-002",
    transporterName: "SafeMove Transport",
    proposedRate: 38000,
    trucksOffered: 1,
    status: "PENDING",
    submittedAt: "2025-01-12T11:00:00Z",
    score: 0.78,
  },
  {
    bidId: "bid-004",
    loadId: "load-004",
    transporterId: "trans-004",
    transporterName: "Prime Freight",
    proposedRate: 40000,
    trucksOffered: 2,
    status: "PENDING",
    submittedAt: "2025-01-12T13:00:00Z",
    score: 0.82,
  },
]

const initialBookings: Booking[] = [
  {
    bookingId: "book-001",
    loadId: "load-003",
    bidId: "bid-005",
    transporterId: "trans-001",
    transporterName: "FastTrack Logistics",
    allocatedTrucks: 4,
    finalRate: 55000,
    status: "CONFIRMED",
    bookedAt: "2025-01-10T16:00:00Z",
  },
  {
    bookingId: "book-002",
    loadId: "load-001",
    bidId: "bid-002",
    transporterId: "trans-003",
    transporterName: "Express Carriers",
    allocatedTrucks: 1,
    finalRate: 42000,
    status: "CONFIRMED",
    bookedAt: "2025-01-11T09:00:00Z",
  },
]

// In-memory store
let loads = [...initialLoads]
let transporters = [...initialTransporters]
let bids = [...initialBids]
let bookings = [...initialBookings]

// Store accessor functions
export const dataStore = {
  // Loads
  getLoads: () => [...loads],
  addLoad: (load: Omit<Load, "loadId" | "datePosted" | "status" | "remainingTrucks">) => {
    const newLoad: Load = {
      ...load,
      loadId: `load-${String(loads.length + 1).padStart(3, "0")}`,
      datePosted: new Date().toISOString(),
      status: "POSTED",
      remainingTrucks: load.noOfTrucks,
    }
    loads = [...loads, newLoad]
    return newLoad
  },
  updateLoadStatus: (loadId: string, status: Load["status"]) => {
    loads = loads.map((l) => (l.loadId === loadId ? { ...l, status } : l))
  },
  updateLoadRemainingTrucks: (loadId: string, remainingTrucks: number) => {
    loads = loads.map((l) => (l.loadId === loadId ? { ...l, remainingTrucks } : l))
  },

  // Transporters
  getTransporters: () => [...transporters],
  addTransporter: (transporter: Omit<Transporter, "transporterId">) => {
    const newTransporter: Transporter = {
      ...transporter,
      transporterId: `trans-${String(transporters.length + 1).padStart(3, "0")}`,
    }
    transporters = [...transporters, newTransporter]
    return newTransporter
  },

  // Bids
  getBids: () => [...bids],
  addBid: (bid: Omit<Bid, "bidId" | "submittedAt" | "status" | "score">) => {
    const transporter = transporters.find((t) => t.transporterId === bid.transporterId)
    const newBid: Bid = {
      ...bid,
      bidId: `bid-${String(bids.length + 1).padStart(3, "0")}`,
      transporterName: transporter?.companyName || "Unknown",
      submittedAt: new Date().toISOString(),
      status: "PENDING",
      score: Math.random() * 0.3 + 0.7, // Random score between 0.7 and 1.0
    }
    bids = [...bids, newBid]

    // Update load status to OPEN_FOR_BIDS if it was POSTED
    const load = loads.find((l) => l.loadId === bid.loadId)
    if (load && load.status === "POSTED") {
      dataStore.updateLoadStatus(bid.loadId, "OPEN_FOR_BIDS")
    }

    return newBid
  },
  updateBidStatus: (bidId: string, status: Bid["status"]) => {
    bids = bids.map((b) => (b.bidId === bidId ? { ...b, status } : b))
  },
  acceptBid: (bidId: string) => {
    const bid = bids.find((b) => b.bidId === bidId)
    if (!bid) return null

    // Update bid status
    dataStore.updateBidStatus(bidId, "ACCEPTED")

    // Reject other pending bids for the same load
    bids = bids.map((b) =>
      b.loadId === bid.loadId && b.bidId !== bidId && b.status === "PENDING"
        ? { ...b, status: "REJECTED" as const }
        : b,
    )

    // Create booking
    const booking = dataStore.addBooking({
      loadId: bid.loadId,
      bidId: bid.bidId,
      transporterId: bid.transporterId,
      transporterName: bid.transporterName,
      allocatedTrucks: bid.trucksOffered,
      finalRate: bid.proposedRate,
    })

    // Update load
    const load = loads.find((l) => l.loadId === bid.loadId)
    if (load) {
      const newRemaining = (load.remainingTrucks || load.noOfTrucks) - bid.trucksOffered
      dataStore.updateLoadRemainingTrucks(bid.loadId, Math.max(0, newRemaining))
      if (newRemaining <= 0) {
        dataStore.updateLoadStatus(bid.loadId, "BOOKED")
      }
    }

    return booking
  },
  rejectBid: (bidId: string) => {
    dataStore.updateBidStatus(bidId, "REJECTED")
  },

  // Bookings
  getBookings: () => [...bookings],
  addBooking: (booking: Omit<Booking, "bookingId" | "bookedAt" | "status">) => {
    const newBooking: Booking = {
      ...booking,
      bookingId: `book-${String(bookings.length + 1).padStart(3, "0")}`,
      bookedAt: new Date().toISOString(),
      status: "CONFIRMED",
    }
    bookings = [...bookings, newBooking]
    return newBooking
  },
  updateBookingStatus: (bookingId: string, status: Booking["status"]) => {
    bookings = bookings.map((b) => (b.bookingId === bookingId ? { ...b, status } : b))
  },
}
