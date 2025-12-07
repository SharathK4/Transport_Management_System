package com.tms.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "bookings", indexes = {
    @Index(name = "idx_booking_load", columnList = "load_id"),
    @Index(name = "idx_booking_transporter", columnList = "transporter_id")
})
public class Booking {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID bookingId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "load_id", nullable = false)
    private Load load;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bid_id", nullable = false, unique = true)
    private Bid bid;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transporter_id", nullable = false)
    private Transporter transporter;
    
    @Column(nullable = false)
    private int allocatedTrucks;
    
    @Column(nullable = false)
    private double finalRate;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status = BookingStatus.CONFIRMED;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime bookedAt;
    
    public enum BookingStatus {
        CONFIRMED, COMPLETED, CANCELLED
    }
    
    // Getters and Setters
    public UUID getBookingId() { return bookingId; }
    public void setBookingId(UUID bookingId) { this.bookingId = bookingId; }
    
    public Load getLoad() { return load; }
    public void setLoad(Load load) { this.load = load; }
    
    public Bid getBid() { return bid; }
    public void setBid(Bid bid) { this.bid = bid; }
    
    public Transporter getTransporter() { return transporter; }
    public void setTransporter(Transporter transporter) { this.transporter = transporter; }
    
    public int getAllocatedTrucks() { return allocatedTrucks; }
    public void setAllocatedTrucks(int allocatedTrucks) { this.allocatedTrucks = allocatedTrucks; }
    
    public double getFinalRate() { return finalRate; }
    public void setFinalRate(double finalRate) { this.finalRate = finalRate; }
    
    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }
    
    public LocalDateTime getBookedAt() { return bookedAt; }
    public void setBookedAt(LocalDateTime bookedAt) { this.bookedAt = bookedAt; }
}
