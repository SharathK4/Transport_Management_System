"use client"

import useSWR, { mutate } from "swr"
import { dataStore } from "@/lib/data-store"
import type { Load, Transporter, Bid, Booking } from "@/lib/types"

// SWR keys
export const DATA_KEYS = {
  loads: "loads",
  transporters: "transporters",
  bids: "bids",
  bookings: "bookings",
}

// Loads hook
export function useLoads() {
  const { data, error, isLoading } = useSWR(DATA_KEYS.loads, () => dataStore.getLoads())

  const addLoad = (load: Omit<Load, "loadId" | "datePosted" | "status" | "remainingTrucks">) => {
    const newLoad = dataStore.addLoad(load)
    mutate(DATA_KEYS.loads)
    return newLoad
  }

  const updateLoadStatus = (loadId: string, status: Load["status"]) => {
    dataStore.updateLoadStatus(loadId, status)
    mutate(DATA_KEYS.loads)
  }

  return {
    loads: data || [],
    isLoading,
    error,
    addLoad,
    updateLoadStatus,
  }
}

// Transporters hook
export function useTransporters() {
  const { data, error, isLoading } = useSWR(DATA_KEYS.transporters, () => dataStore.getTransporters())

  const addTransporter = (transporter: Omit<Transporter, "transporterId">) => {
    const newTransporter = dataStore.addTransporter(transporter)
    mutate(DATA_KEYS.transporters)
    return newTransporter
  }

  return {
    transporters: data || [],
    isLoading,
    error,
    addTransporter,
  }
}

// Bids hook
export function useBids() {
  const { data, error, isLoading } = useSWR(DATA_KEYS.bids, () => dataStore.getBids())

  const addBid = (bid: Omit<Bid, "bidId" | "submittedAt" | "status" | "score" | "transporterName">) => {
    const newBid = dataStore.addBid(bid)
    mutate(DATA_KEYS.loads) // Also refresh loads since status might change
    mutate(DATA_KEYS.bids)
    return newBid
  }

  const acceptBid = (bidId: string) => {
    const booking = dataStore.acceptBid(bidId)
    mutate(DATA_KEYS.bids)
    mutate(DATA_KEYS.bookings)
    mutate(DATA_KEYS.loads)
    return booking
  }

  const rejectBid = (bidId: string) => {
    dataStore.rejectBid(bidId)
    mutate(DATA_KEYS.bids)
  }

  return {
    bids: data || [],
    isLoading,
    error,
    addBid,
    acceptBid,
    rejectBid,
  }
}

// Bookings hook
export function useBookings() {
  const { data, error, isLoading } = useSWR(DATA_KEYS.bookings, () => dataStore.getBookings())

  const updateBookingStatus = (bookingId: string, status: Booking["status"]) => {
    dataStore.updateBookingStatus(bookingId, status)
    mutate(DATA_KEYS.bookings)
  }

  return {
    bookings: data || [],
    isLoading,
    error,
    updateBookingStatus,
  }
}
