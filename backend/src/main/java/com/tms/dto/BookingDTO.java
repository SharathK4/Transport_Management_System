package com.tms.dto;

import com.tms.entity.Booking.BookingStatus;
import java.time.LocalDateTime;
import java.util.UUID;

public class BookingDTO {
    
    public static class CreateRequest {
        private UUID bidId;
        
        public UUID getBidId() { return bidId; }
        public void setBidId(UUID bidId) { this.bidId = bidId; }
    }
    
    public static class Response {
        private UUID bookingId;
        private UUID loadId;
        private UUID bidId;
        private UUID transporterId;
        private String transporterName;
        private String loadingCity;
        private String unloadingCity;
        private int allocatedTrucks;
        private double finalRate;
        private BookingStatus status;
        private LocalDateTime bookedAt;
        
        public UUID getBookingId() { return bookingId; }
        public void setBookingId(UUID bookingId) { this.bookingId = bookingId; }
        public UUID getLoadId() { return loadId; }
        public void setLoadId(UUID loadId) { this.loadId = loadId; }
        public UUID getBidId() { return bidId; }
        public void setBidId(UUID bidId) { this.bidId = bidId; }
        public UUID getTransporterId() { return transporterId; }
        public void setTransporterId(UUID transporterId) { this.transporterId = transporterId; }
        public String getTransporterName() { return transporterName; }
        public void setTransporterName(String transporterName) { this.transporterName = transporterName; }
        public String getLoadingCity() { return loadingCity; }
        public void setLoadingCity(String loadingCity) { this.loadingCity = loadingCity; }
        public String getUnloadingCity() { return unloadingCity; }
        public void setUnloadingCity(String unloadingCity) { this.unloadingCity = unloadingCity; }
        public int getAllocatedTrucks() { return allocatedTrucks; }
        public void setAllocatedTrucks(int allocatedTrucks) { this.allocatedTrucks = allocatedTrucks; }
        public double getFinalRate() { return finalRate; }
        public void setFinalRate(double finalRate) { this.finalRate = finalRate; }
        public BookingStatus getStatus() { return status; }
        public void setStatus(BookingStatus status) { this.status = status; }
        public LocalDateTime getBookedAt() { return bookedAt; }
        public void setBookedAt(LocalDateTime bookedAt) { this.bookedAt = bookedAt; }
    }
}
